/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { DatabaseModule } from 'src/database/database.module';
import { FirebaseModule } from 'src/firebase/firebase.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [FirebaseModule, DatabaseModule],
})
export class UsersModule { }
