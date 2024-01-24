import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  ValidationPipe,
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { LoginDto } from './dto/login.dto'
import { SignupDto } from './dto/signup.dto'
import { SkipAuth } from './auth.decorator'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @SkipAuth()
  @Post('signup')
  signUp(@Body(ValidationPipe) signupDto: SignupDto) {
    return this.authService.signUp(signupDto)
  }

  @SkipAuth()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  logIn(@Body(ValidationPipe) loginDto: LoginDto) {
    return this.authService.logIn(loginDto.email, loginDto.password)
  }
}
