import { IsNotEmpty, IsString } from 'class-validator';

export class ImageUploadDto {
  @IsString()
  @IsNotEmpty()
  userIdUploadingTo: string;

  @IsString()
  @IsNotEmpty()
  imageUrl: string;

  @IsString()
  imageDescription: string;

  @IsString()
  uploadedAt: string;
}
