import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { UsersModule } from 'src/users/users.module'
import { JwtModule } from '@nestjs/jwt'
import { jwtConstants } from './constants'
import { FirebaseModule } from 'src/firebase/firebase.module'

@Module({
  imports: [
    FirebaseModule,
    UsersModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '259200s' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
