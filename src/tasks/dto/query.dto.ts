import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { SortByEnum } from '../enum/sort-by.enum';
import { SortEnum } from '../enum/sort.enum';
import { TaskStatus } from '../enum/task-status.enum';

export class QueryDto {
  @ApiProperty({
    required: false,
    description: 'Page number.',
    minimum: 1,
    example: 1,
    default: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  @Min(1)
  page?: number;

  @ApiProperty({
    required: false,
    description: 'Number of tasks to get per page.',
    maximum: 20,
    example: 10,
    default: 10,
  })
  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  @Max(20)
  size?: number;

  @ApiProperty({
    required: false,
    enum: SortByEnum,
    description: 'Key to sort by.',
    default: SortByEnum.CREATED_DATE,
  })
  @IsEnum(SortByEnum)
  @IsNotEmpty()
  @IsOptional()
  sortBy?: SortByEnum;

  @ApiProperty({
    required: false,
    enum: SortEnum,
    description: 'Sort by ascending or descending.',
    default: SortEnum.ASCENDING,
  })
  @IsEnum(SortEnum)
  @IsNotEmpty()
  @IsOptional()
  sort?: SortEnum;

  @ApiProperty({
    required: false,
    description:
      'Get tasks that are created at specified date. Format YYYY-MM-DD',
    example: '2024-25-10',
  })
  @IsDateString()
  @IsNotEmpty()
  @IsOptional()
  dateCreated?: string;

  @ApiProperty({
    required: false,
    description:
      'Get tasks that are updated at specified date. Format YYYY-MM-DD',
    example: '2024-25-10',
  })
  @IsDateString()
  @IsNotEmpty()
  @IsOptional()
  dateUpdated?: string;

  @ApiProperty({
    required: false,
    description: 'Get tasks assigned to the specified user id.',
    example: '6651f57d50d91165c7cefd5f',
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  user?: string;

  @ApiProperty({
    required: false,
    enum: TaskStatus,
    description: 'Get tasks that have the specified status.',
    example: TaskStatus.IN_PROGRESS,
  })
  @IsEnum(TaskStatus)
  @IsNotEmpty()
  @IsOptional()
  status?: TaskStatus;

  @ApiProperty({
    required: false,
    description:
      'Search for tasks that contain the searched text(case insensitive) in the title.',
    example: 'as a user I sh',
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  search?: string;
}
