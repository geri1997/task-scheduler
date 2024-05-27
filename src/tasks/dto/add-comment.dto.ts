import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AddCommentDto {
  @ApiProperty({
    required: true,
    description: 'Main text of the comment.',
    example: 'This task is blocked because ...',
  })
  @IsString()
  @IsNotEmpty()
  text: string;
}
