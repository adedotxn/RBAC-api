// import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class ImageUploadDto {
  // @IsString()
  imageDescription: string;

  // @IsInt()
  // @IsNotEmpty()
  targetUserId: number;
}
