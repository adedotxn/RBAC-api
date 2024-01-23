/* eslint-disable prettier/prettier */
import { IsEmail, IsEnum, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  companyName: string;

  @IsInt()
  numberOfUsers: number = 0;

  @IsInt()
  numberOfProducts: number = 0;

  @IsInt()
  percentage: number = 0;

  @IsEnum(['Admin', 'Customer'], {
    message: 'Role must either be Customer or Admin',
  })
  role: 'Admin' | 'Customer';
}

