/* eslint-disable prettier/prettier */
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class InputDataDto {
    @IsString()
    @IsNotEmpty()
    companyName: string;

    @IsInt()
    numberOfUsers: number = 0;

    @IsInt()
    numberOfProducts: number = 0;
}

