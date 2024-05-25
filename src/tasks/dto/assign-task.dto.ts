import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AssignTaskDto {
  @ApiProperty({
    required: true,
    example: '6651d00839a46d63aef4473e',
    description:"Id of the task to assign."
  })
  @IsString()
  @IsNotEmpty()
  taskId: string;

  @ApiProperty({
    required: true,
    example: '6651d56174a2107fb2ed5c4c',
    description:"Id of the user to assign the task to."
  })
  @IsString()
  @IsNotEmpty()
  userId: string;
}
