/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'
import { InputDataDto } from './dto/input-data.dto'
import { Role } from '@prisma/client'
import { DatabaseService } from '../database/database.service'
import { ImageUploadDto } from './dto/image-upload.dto'

const mockFirebaseService = {
  storage: () => ({
    bucket: () => ({
      file: (_filename: string) => ({
        save: (buffer: Buffer) => Promise.resolve(),
        makePublic: () => Promise.resolve(),
      }),
    }),
  }),
}

class MockDatabaseService extends DatabaseService { }

describe('UsersController', () => {
  let controller: UsersController
  let usersService: UsersService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        {
          provide: 'FIREBASE_ADMIN',
          useValue: mockFirebaseService,
        },
        {
          provide: DatabaseService,
          useClass: MockDatabaseService,
        },
      ],
    }).compile()

    controller = module.get<UsersController>(UsersController)
    usersService = module.get<UsersService>(UsersService)
  })

  describe('findAll', () => {
    it('should call findAll method of UsersService', async () => {
      const role = Role.Admin

      const result = [
        {
          id: 1,
          email: 'test@example.com',
          password: 'pwddd',
          role,
        },
      ]

      jest.spyOn(usersService, 'findAll').mockResolvedValue(result)

      expect(await controller.findAll()).toBe(result)
    })
  })

  describe('findOne', () => {
    it('should call findAll method of UsersService', async () => {
      const email = 'test@example.com'

      const result = {
        id: 1,
        password: 'sdksjd',
        email: 'test@example.com',
        role: Role.Admin,
      }

      jest.spyOn(usersService, 'findOne').mockResolvedValue(result)

      expect(await controller.findOne(email)).toBe(result)
    })
  })

  describe('input', () => {
    it('should call input method of UsersService', async () => {
      const id = 1
      const inputDataDto: InputDataDto = {
        companyName: 'Batman Inc.',
        numberOfUsers: 25,
        numberOfProducts: 50,
      }

      const result = {
        message: 'Input received.',
        data: {
          id,
          userId: 1,
          ...inputDataDto,
          percentage: 50,
          createdAt: new Date(),
        },
      }

      jest.spyOn(usersService, 'input').mockResolvedValue(result)

      expect(await controller.input(id, inputDataDto)).toBe(result)
    })
  })

  describe('uploadImages', () => {
    it('should call uploadImages method of UsersService', async () => {
      const id = 2

      const imageUploadDto: ImageUploadDto = {
        imageDescription: 'a test image',
        targetCustomerUserId: 1,
      }

      const mockImageFile: Express.Multer.File = {
        fieldname: 'file',
        originalname: 'example.jpg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        size: 1024,
        buffer: Buffer.from('Mock image content', 'base64'), // Ensure it's a valid image buffer
        stream: null,
        destination: null,
        filename: null,
        path: null,
      }

      const result = {
        message: 'Image Upload successfull',

        data: {
          id: 'sdhgsdh',
          imageUrl: 'https://image.jpg',
          imageDescription: 'a test image',
          targetCustomerUserId: id,
          uploaderAdminUserId: 2,
          uploadedAt: new Date(),
        },
      }

      jest.spyOn(usersService, 'uploadImage').mockResolvedValue(result)

      expect(
        await controller.uploadImage(id, imageUploadDto, mockImageFile)
      ).toBe(result)
    })
  })

  describe('getImages', () => {
    it('should call getImages method of UsersService', async () => {
      const id = 1

      const result = [
        {
          id: 'sdhgsdh',
          imageUrl: 'https://image.jpg',
          imageDescription: 'a test image',
          targetCustomerUserId: id,
          uploaderAdminUserId: 2,
          uploadedAt: new Date(),
        },
      ]

      jest.spyOn(usersService, 'getImages').mockResolvedValue(result)

      expect(await controller.getImages(id)).toBe(result)
    })
  })
})
