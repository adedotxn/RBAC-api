/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ValidationPipe,
  UseInterceptors,
  UploadedFile,
  ParseIntPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ImageUploadDto } from './dto/image-upload.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  create(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post('login')
  login(@Body(ValidationPipe) loginUserDto: LoginUserDto) {
    return this.usersService.login(loginUserDto);
  }

  // TODO : Secure endpoint to not run unless logged in
  @Post(':id/upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadImage(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) imageUploadDto: ImageUploadDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    // console.log("file", file)
    return this.usersService.uploadImage(id, file, imageUploadDto);
  }


  // @Get(':id/uploads')
  // imageUploads(
  //   @Param('id') id: string,
  //   @Body(ValidationPipe) imageUploadDto: ImageUploadDto,
  // ) {
  //   return this.usersService.uploadImage(id, imageUploadDto);
  // }

  // TODO : Secure endpoint to not run unless logged in
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  // TODO : Secure endpoint to not run unless logged in
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  // TODO : Secure endpoint to not run unless logged in
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
