import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
} from 'class-validator';
import { Skill } from 'src/database/entities';

export class CreateMentorProfileDto {
  @ApiProperty({
    example: 'Full Stack Software Developer',
    title: ' career, key skills, and accomplishments',
  })
  @IsString({ message: 'Bio must be string' })
  @IsNotEmpty({ message: 'Bio must not be empty' })
  bio: string;

  @ApiProperty({
    example: 5,
    title: 'years of experience',
  })
  @IsNumber()
  @IsNotEmpty({ message: 'YOE must not be empty' })
  years_of_experience: number;

  @ApiProperty({
    example: ['uuid-1', 'uuid-2'],
    required: true,
  })
  @IsArray({ message: 'Skills must be an array' })
  @IsNotEmpty({ message: 'Skills must not be empty' })
  @IsUUID('4',{ each: true })
  skillIds: string[];

  @ApiProperty({
    example: '$100',
    title: 'session rate',
  })
  @IsNumber()
  @IsNotEmpty({ message: 'session must not be empty' })
  session_rate: number;

  @ApiProperty({
    example: '$40',
    title: 'hourly rate',
  })
  @IsNumber()
  @IsNotEmpty({ message: 'hourly must not be empty' })
  hourly_rate: number;
}

export class UpdateMentorProfileDto extends PartialType(
  CreateMentorProfileDto,
) {}
