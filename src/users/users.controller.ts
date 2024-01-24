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
} from '@nestjs/common'
import { UsersService } from './users.service'
import { ImageUploadDto } from './dto/image-upload.dto'
import { FileInterceptor } from '@nestjs/platform-express'
import { InputDataDto } from './dto/input-data.dto'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(@Query('role') role?: 'Admin' | 'Customer') {
    return this.usersService.findAll(role)
  }

  @Get(':email')
  findOne(@Param('email') email: string) {
    return this.usersService.findOne(email)
  }

  // POST data inputs
  @Post(':id/input')
  input(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) inputDataDto: InputDataDto
  ) {
    return this.usersService.input(id, inputDataDto)
  }

  /* Get recent data inputs of users with "customer" role
   * default limit is 10 (i.e 10 most recent inputs)
   */
  @Get(':id/inputs/:customerId')
  recentInputs(
    @Param('id', ParseIntPipe) id: number,
    @Param('customerId', ParseIntPipe) customerId: number,
    @Query('limit') limit?: number
  ) {
    return this.usersService.recentInputs(id, customerId, limit)
  }

  /* Upload Images to a "Customer" role user's account
   * restricted only to users with "Admin" role */
  @Post(':id/upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadImage(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) imageUploadDto: ImageUploadDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    return this.usersService.uploadImage(id, file, imageUploadDto)
  }

  /**Get images uploaded to "Customer" account
   * Restricted to users with "Customer" role
   */
  @Get(':id/uploads')
  getImages(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.getImages(id)
  }
}
