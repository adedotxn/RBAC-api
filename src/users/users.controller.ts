import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ImageUploadDto } from './dto/image-upload.dto';

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
  uploadImage(
    @Param('id') id: string,
    @Body(ValidationPipe) imageUploadDto: ImageUploadDto,
  ) {
    return this.usersService.uploadImage(id, imageUploadDto);
  }

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
