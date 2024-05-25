import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { TaskStatus } from '../enum/task-status.enum';

export class UpdateTaskDto {
  @ApiProperty({
    required: false,
    enum: TaskStatus,
    example: TaskStatus.IN_PROGRESS,
  })
  @IsEnum(TaskStatus)
  @IsNotEmpty()
  @IsOptional()
  status: TaskStatus;

  @ApiProperty({ required: false, example: 'Title of task' })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  title: string;

  @ApiProperty({ required: false, example: 'Description of task' })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  description: string;
}
