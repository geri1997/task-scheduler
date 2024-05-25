import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { TaskStatus } from '../enum/task-status.enum';

export class UpdateTaskDto {
  @ApiProperty()
  @IsEnum(TaskStatus)
  @IsNotEmpty()
  @IsOptional()
  status: TaskStatus;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  description: string;
}
