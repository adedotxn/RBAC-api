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
  company_name: string;

  @IsInt()
  no_of_users: number;

  @IsInt()
  no_of_products: number;

  @IsInt()
  percentage: number;

  @IsEnum(['Admin', 'Customer'], {
    message: 'Role must either be Customer or Admin',
  })
  role: 'Admin' | 'Customer';
}
