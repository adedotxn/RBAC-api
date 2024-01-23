/* eslint-disable prettier/prettier */
import { ConflictException, Inject, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ImageUploadDto } from './dto/image-upload.dto';
import * as firebase from 'firebase-admin';
import { DatabaseService } from 'src/database/database.service';




@Injectable()
export class UsersService {

  constructor(
    @Inject('FIREBASE_ADMIN') private readonly firebaseService: firebase.app.App,
    private readonly databaseService: DatabaseService
  ) { }

  protected async userExists(id: number) {
    return await this.databaseService.user.findUnique({ where: { id: Number(id) } });
  }

  async create(createUserDto: CreateUserDto) {
    const { email, password, ...rest } = createUserDto

    try {

      const response = await this.firebaseService.auth().createUser({
        email, password,
      })

      if (response.uid) {
        const response = await this.databaseService.user.create({
          data: {
            email, ...rest
          }
        })

        return { message: "User account created", response }
      }
    } catch (error) {
      if (error.errorInfo && error.errorInfo.code === 'auth/email-already-exists') {
        throw new ConflictException('User with this email already exists. Try another')
      }
      console.log(error)

      throw new InternalServerErrorException(`An unexpected error occured`)
    }
  }

  login(loginUserDto: LoginUserDto) {
    return loginUserDto;
  }

  async uploadImage(id: number, file: Express.Multer.File, imageUploadDto: ImageUploadDto) {
    const { targetUserId, imageDescription } = imageUploadDto;

    const bucket = this.firebaseService.storage().bucket()
    const user = await this.userExists(id);
    const targetUser = Boolean(await this.userExists(targetUserId))

    if (!user) {
      throw new NotFoundException(`User with ID "${id}" does not exist.`);
    }

    if (!targetUser) {
      throw new NotFoundException(`User with ID "${id}" does not exist.`);
    }

    if (user.role !== 'Admin') {
      throw new UnauthorizedException(`User with ID "${id}" does not have permission to upload images`);
    }

    try {
      // Save file to bucket
      const buffer = file.buffer;
      const bucketFile = bucket.file(file.originalname);
      await bucketFile.save(buffer)
      await bucketFile.makePublic();

      const imageUrl = `https://storage.googleapis.com/${bucket.name}/${bucketFile.name}`;

      if (imageUrl) {
        // If file saved, update DB
        const imageUpload = await this.databaseService.imageUpload.create({
          data: {
            imageUrl,
            imageDescription,
            User: { connect: { id: Number(targetUserId) } },
          },
        });

        return imageUpload
      }
    } catch (error) {
      throw new InternalServerErrorException(`Error uploading image: ${error}`)
    }
  }

  findAll() {
    return this.databaseService.user.findMany();
  }

  findOne(id: number) {
    return this.databaseService.user.findUnique({ where: { id } });
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
