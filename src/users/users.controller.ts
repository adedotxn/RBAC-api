/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ValidationPipe,
  UseInterceptors,
  UploadedFile,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ImageUploadDto } from './dto/image-upload.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { InputDataDto } from './dto/input-data.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get()
  findAll(@Query('role') role?: 'Admin' | 'Customer') {
    return this.usersService.findAll(role);
  }

  // TODO : Secure endpoint to not run unless logged in
  @Get(':email')
  findOne(@Param('email') email: string) {
    return this.usersService.findOne(email);
  }

  @Post(':id/input')
  input(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) inputDataDto: InputDataDto
  ) {
    return this.usersService.input(id, inputDataDto)
  }


  @Get(':id/inputs/:customerId')
  recentInputS(
    @Param('id', ParseIntPipe) id: number,
    @Param('customerId', ParseIntPipe) customerId: number,
  ) {
    return this.usersService.recentInputs(id, customerId)
  }


  // TODO : Secure endpoint to not run unless logged in
  @Post(':id/upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadImage(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) imageUploadDto: ImageUploadDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    return this.usersService.uploadImage(id, file, imageUploadDto);
  }
}
