import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { TaskType } from '../enum/task-type.enum';

export class CreateTaskDto {
  @ApiProperty({ example: 'Task title', required: true })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Task description', required: true })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: TaskType.CONTENT, required: true, enum: TaskType })
  @IsEnum(TaskType)
  @IsNotEmpty()
  type: TaskType;
}
