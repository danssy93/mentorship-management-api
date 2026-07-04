import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { ProgressStatus } from 'src/database/entities';

export class CreateGoalDto {
  @ApiProperty({
    example: 'Master React fundamentals',
  })
  @IsString({ message: 'Title must be a string' })
  @IsNotEmpty({ message: 'Title must not be empty' })
  title: string;

  @ApiProperty({
    example: 'I want to be the best frontend in the world',
  })
  @IsOptional({ message: 'Description is optional' })
  @IsString({ message: 'Description must be a string' })
  description?: string;

  @ApiProperty({
    example: '2026-12-31',
  })
  @IsOptional()
  @IsDateString({}, { message: 'Target date must be a valid date' })
  target_date?: Date;

  @ApiProperty({
    example: 'uuid of accepted match request',
  })
  @IsUUID('4', { message: 'MatchRequestId must be a valid UUID' })
  @IsNotEmpty({ message: 'MatchRequestId must not be empty' })
  matchRequestId: string;
}

export class UpdateGoalDto extends PartialType(CreateGoalDto) {
  @ApiProperty({
    enum: ProgressStatus,
    required: false,
  })
  @IsEnum(ProgressStatus, { message: 'Invalid status' })
  @IsOptional({ message: 'status is optional' })
  status: ProgressStatus;

  @ApiProperty({ example: 50, required: false })
  @IsNumber({}, { message: 'Progress percentage must be a number' })
  @IsOptional({ message: 'Progress percentage is  optional' })
  progress_percentage: number;
}
