import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator'

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string

  @IsString()
  @IsNotEmpty()
  password: string

  @IsEnum(['Admin', 'Customer'], {
    message: 'Role must either be Customer or Admin',
  })
  role: 'Admin' | 'Customer'
}
