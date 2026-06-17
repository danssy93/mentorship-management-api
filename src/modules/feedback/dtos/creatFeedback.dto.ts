import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateFeedbackDto {
  @IsUUID('4', { message: 'matchRequestId must be a valid UUID' })
  @IsNotEmpty({ message: 'sessionId should not be empty' })
  sessionId: string;

  @IsNumber({}, { message: 'rating must be a number' })
  @IsNotEmpty({ message: 'rating should not be empty' })
  rating: number;

  @IsOptional({ message: 'comment is optional' })
  @IsString({ message: 'comment is a string' })
  comment?: string;
}
