import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsEnum,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { ExperienceLevel, Skill } from 'src/database/entities';

export class CreateMenteeProfileDto {
  @ApiProperty({
    example: 'Full Stack Software Developer',
    title: ' career, key skills, and accomplishments',
  })
  @IsString({ message: 'Bio must be string' })
  @IsNotEmpty({ message: 'Bio must not be empty' })
  bio: string;

  @ApiProperty({
    example: 'Master JavaScript',
    title: 'learning goals',
  })
  @IsString({ message: 'goal must be string' })
  @IsNotEmpty({ message: 'goal must not be empty' })
  @IsOptional()
  learning_goals: string;

  @ApiProperty({
    example: Object.values(ExperienceLevel),
    required: true,
  })
  @IsNotEmpty({ message: 'Level must not be empty' })
  @IsEnum(ExperienceLevel, { each: true })
  current_level: ExperienceLevel;

  @ApiProperty({ example: 'Software Engineer' })
  @IsString()
  @IsOptional()
  occupation: string;

  @IsArray()
  @IsOptional()
  @IsUUID('4', { each: true })
  skillIds: string[];
}

export class UpdateMenteeProfileDto extends PartialType(
  CreateMenteeProfileDto,
) {}
