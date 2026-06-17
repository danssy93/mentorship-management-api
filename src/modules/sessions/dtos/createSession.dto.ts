import { PartialType } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateSessionDto {
  @IsString({ message: 'title must be a string' })
  @IsNotEmpty({ message: 'title must not be empty' })
  title: string;

  @IsString({ message: 'description must be a string' })
  @IsOptional({ message: 'description is optional' })
  description?: string;

  @IsDateString({}, { message: 'schedule_at must be a valid data' })
  @IsNotEmpty({ message: 'schedule must not be empty' })
  scheduled_at: Date;

  @IsNumber({}, { message: 'Duration must be a number' })
  @IsNotEmpty({ message: 'duration must not be empty' })
  duration: number;

  @IsOptional({ message: 'meeting link is optional' })
  @IsString({ message: 'meeeting link must be string' })
  meeting_link?: string;

  @IsUUID('4', {message: 'matchRequestId must be a valid UUID'})
  @IsNotEmpty()
  matchRequestId: string;
}

export class UpdateSessionDto extends PartialType(CreateSessionDto) {}

export class CancelSessionDto {
  @IsString()
  @IsOptional()
  cancellation_reason: string;
}
