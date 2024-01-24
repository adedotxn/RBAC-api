/* eslint-disable prettier/prettier */
import { BadRequestException, ConflictException, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { SignupDto } from './dto/signup.dto';
import * as firebase from 'firebase-admin';


@Injectable()
export class AuthService {
    constructor(
        @Inject('FIREBASE_ADMIN') private readonly firebaseService: firebase.app.App,
        private usersService: UsersService,
        private jwtService: JwtService
    ) { }

    async signUp(signupDto: SignupDto) {
        const { email, password } = signupDto
        try {

            const hashedPassword = await bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS));

            const response = await this.firebaseService.auth().createUser({
                email, password: hashedPassword,
            })

            if (response.uid) {
                const data = { email, password: hashedPassword, role: signupDto.role }
                return await this.usersService.create(data)
            }
        } catch (error) {
            if (error.errorInfo && error.errorInfo.code === 'auth/email-already-exists') {
                throw new ConflictException('User with this email already exists. Try another')
            }

            throw new BadRequestException()
        }
    }

    async logIn(email: string, password: string) {
        try {
            const userRecord = await this.firebaseService.auth().getUserByEmail(email);

            if (userRecord.uid) {
                const user = await this.usersService.findOne(email);
                if (!user) throw new NotFoundException(`User with email "${email}" does not exist`);


                const passwordValid = await bcrypt.compare(password, user?.password);
                if (passwordValid === false) throw new UnauthorizedException();

                const payload = { sub: user.id, email: user.email, role: user.role };
                return {
                    access_token: await this.jwtService.signAsync(payload),
                };
            }
        } catch (error) {
            console.log(error)
            throw new BadRequestException()
        }
    }


}