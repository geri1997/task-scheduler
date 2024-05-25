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
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  @Min(1)
  page?: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  @Max(20)
  size?: number;

  @ApiProperty()
  @IsEnum(SortByEnum)
  @IsNotEmpty()
  @IsOptional()
  sortBy?: SortByEnum;

  @ApiProperty()
  @IsEnum(SortEnum)
  @IsNotEmpty()
  @IsOptional()
  sort?: SortEnum;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  @IsOptional()
  dateCreated?: string;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  @IsOptional()
  dateUpdated?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  user?: string;

  @ApiProperty()
  @IsEnum(TaskStatus)
  @IsNotEmpty()
  @IsOptional()
  status?: TaskStatus;
}
