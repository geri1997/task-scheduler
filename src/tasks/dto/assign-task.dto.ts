import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AssignTaskDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  taskId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  userId: string;
}
