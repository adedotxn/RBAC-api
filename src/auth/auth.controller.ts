/* eslint-disable prettier/prettier */
import { Body, Controller, Post, HttpCode, HttpStatus, UseGuards, Get, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from './auth.guard';
import { SignupDto } from './dto/signup.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }


    @Post('signup')
    signUp(@Body() signupDto: SignupDto) {
        return this.authService.signUp(signupDto)
    }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    logIn(@Body() loginDto: LoginDto) {
        return this.authService.logIn(loginDto.email, loginDto.password);
    }

    // @UseGuards(AuthGuard)
    // @Get('profile')
    // getProfile(@Request() req) {
    //     return req.user;
    // }
}