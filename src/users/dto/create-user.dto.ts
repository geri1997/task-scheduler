import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  Length,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'Geri' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Luga' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: 'luga.geri@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '12345678As' })
  @IsString()
  @IsNotEmpty()
  @IsStrongPassword({
    minLength: 8,
    minNumbers: 1,
    minUppercase: 1,
    minSymbols: 0,
  })
  password: string;

  @ApiProperty({ example: 'Software Engineer', required: false })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  role?: string;

  @ApiProperty({ type: 'string', format: 'binary', required: false })
  image?: string;
}
