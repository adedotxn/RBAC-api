import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { ImageUploadDto } from './dto/image-upload.dto'
import * as firebase from 'firebase-admin'
import { DatabaseService } from '../database/database.service'
import { InputDataDto } from './dto/input-data.dto'

@Injectable()
export class UsersService {
  constructor(
    @Inject('FIREBASE_ADMIN')
    private readonly firebaseService: firebase.app.App,
    private readonly databaseService: DatabaseService
  ) {}

  protected async userExists(id: number) {
    return await this.databaseService.user.findUnique({
      where: { id: Number(id) },
    })
  }

  private calculatePercentage(
    numberOfUsers: number,
    numberOfProducts: number
  ): number {
    if (numberOfProducts === 0) return 0
    const percentage = (numberOfUsers / numberOfProducts) * 100
    return percentage
  }

  async create(createUserDto: CreateUserDto) {
    const { email, password, ...rest } = createUserDto

    try {
      const response = await this.databaseService.user.create({
        data: {
          email,
          password,
          ...rest,
        },
      })
      return { message: 'User account created', data: response }
    } catch (error) {
      throw new InternalServerErrorException(`An unexpected error occured`)
    }
  }

  async input(id: number, inputDataDto: InputDataDto) {
    const user = Boolean(await this.userExists(id))
    const { numberOfProducts, numberOfUsers, ...rest } = inputDataDto

    if (!user)
      throw new NotFoundException(`User with ID "${id}" does not exist.`)

    try {
      const response = await this.databaseService.input.create({
        data: {
          numberOfProducts,
          numberOfUsers,
          percentage: this.calculatePercentage(numberOfUsers, numberOfProducts),
          User: { connect: { id: Number(id) } },
          ...rest,
        },
      })

      return { message: 'Input received.', data: response }
    } catch (error) {
      throw new InternalServerErrorException(`An error occured`)
    }
  }

  async recentInputs(id: number, customerId: number, limit: number = 10) {
    const user = await this.userExists(id)
    const customer = Boolean(await this.userExists(customerId))

    if (!user)
      throw new NotFoundException(`User with ID "${id}" does not exist.`)
    if (user.role !== 'Admin')
      throw new UnauthorizedException(
        `User with ID "${id}" does not have permission to read recent inputs`
      )

    if (!customer)
      throw new NotFoundException(`User with ID "${id}" does not exist.`)

    try {
      const inputs = await this.databaseService.input.findMany({
        where: {
          userId: customerId,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: limit,
      })

      return inputs
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

  async uploadImage(
    id: number,
    file: Express.Multer.File,
    imageUploadDto: ImageUploadDto
  ) {
    if (!file) {
      throw new BadRequestException()
    }

    const { targetCustomerUserId, imageDescription } = imageUploadDto

    const user = await this.userExists(id)
    const targetUser = await this.userExists(targetCustomerUserId)

    if (!user)
      throw new NotFoundException(`User with ID "${id}" does not exist.`)

    if (user.role !== 'Admin')
      throw new UnauthorizedException(
        `User with ID "${id}" does not have permission to upload images`
      )

    if (!targetUser)
      throw new NotFoundException(`User with ID "${id}" does not exist.`)

    if (targetUser.role === 'Admin')
      throw new UnauthorizedException(
        `User with ID "${id}" is an Admin and cannot have images uploaded to their account`
      )

    const bucket = this.firebaseService.storage().bucket()
    try {
      // Save file to bucket
      const buffer = file.buffer
      const bucketFile = bucket.file(file.originalname)
      await bucketFile.save(buffer)
      await bucketFile.makePublic()

      const imageUrl = `https://storage.googleapis.com/${bucket.name}/${bucketFile.name}`

      if (imageUrl) {
        // If file saved, update DB
        const imageUpload = await this.databaseService.image.create({
          data: {
            imageUrl,
            imageDescription,
            User: { connect: { id: Number(targetCustomerUserId) } },
            Uploader: { connect: { id: Number(id) } },
          },
        })

        return { message: 'Image Upload successfull', data: imageUpload }
      }
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException(error)
    }
  }

  async getImages(id: number) {
    const user = await this.userExists(id)
    if (!user)
      throw new NotFoundException(`User with ID "${id}" does not exist.`)
    if (user.role !== 'Customer')
      throw new UnauthorizedException(
        `User with "Admin" role cannot view uploads`
      )

    try {
      const images = await this.databaseService.image.findMany({
        where: {
          targetCustomerUserId: id,
        },
      })

      return images
    } catch (error) {
      throw new BadRequestException()
    }
  }

  findAll(role?: 'Admin' | 'Customer') {
    if (role)
      return this.databaseService.user.findMany({
        where: {
          role,
        },
      })

    return this.databaseService.user.findMany()
  }

  findOne(email: string) {
    return this.databaseService.user.findUnique({ where: { email } })
  }

  remove(id: number) {
    return `This action removes a #${id} user`
  }
}
