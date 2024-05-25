import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateTaskDto {
  @ApiProperty({ example: 'Task title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Task description' })
  @IsString()
  @IsNotEmpty()
  description: string;

  attachments?: string[];
}
