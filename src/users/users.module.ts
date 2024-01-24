/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { DatabaseModule } from 'src/database/database.module';
import { FirebaseModule } from 'src/firebase/firebase.module';
import { AuthGuard } from 'src/auth/auth.guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
  controllers: [UsersController],
  providers: [UsersService, {
    provide: APP_GUARD,
    useClass: AuthGuard,
  },],
  exports: [UsersService],
  imports: [FirebaseModule, DatabaseModule],
})
export class UsersModule { }
