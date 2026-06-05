import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { SkillCategory } from 'src/database/entities';

export class SkillsDto {
  @ApiProperty({
    example: 'TypeScript',
    title: 'Skills',
    required: true,
  })
  @IsString({ message: 'Skills must be a string' })
  @IsNotEmpty({ message: 'Skill is required' })
  name: string;

  @ApiProperty({
    example: SkillCategory.ENGINEERING,
    required: true,
  })
  @IsEnum(SkillCategory, { message: 'Category must be a valid SkillCategory' })
  @IsNotEmpty({ message: 'Category is required' })
  category: SkillCategory;

  @IsString({ message: 'Description must be a string' })
  @IsOptional({ message: 'Description is optional' })
  description?: string;
}
