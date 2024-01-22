import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ImageUploadDto } from './dto/image-upload.dto';

@Injectable()
export class UsersService {
  create(createUserDto: CreateUserDto) {
    return createUserDto;
  }

  login(loginUserDto: LoginUserDto) {
    return loginUserDto;
  }

  uploadImage(id: string, imageUploadDto: ImageUploadDto) {
    // check if id has admin role
    //if yes, send the file to the userId in the imageUploadDto
    //if no, send an unauthorised error indicating they do not have the permission

    return [id, imageUploadDto];
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
