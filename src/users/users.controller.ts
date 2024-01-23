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
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ImageUploadDto } from './dto/image-upload.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { InputDataDto } from './dto/input-data.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  create(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll(@Query('role') role?: 'Admin' | 'Customer') {
    return this.usersService.findAll(role);
  }

  // TODO : Secure endpoint to not run unless logged in
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Post('login')
  login(@Body(ValidationPipe) loginUserDto: LoginUserDto) {
    return this.usersService.login(loginUserDto);
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
