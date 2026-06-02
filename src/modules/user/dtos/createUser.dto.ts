import { UserRole } from 'src/database/entities';
import { PartialType } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  Matches,
  MinLength,
  IsArray,
  IsEnum,
  ArrayNotEmpty,
  IsPhoneNumber,
  IsOptional,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    example: 'John',
    description: 'The first name of the user',
    required: true,
  })
  @IsString({ message: 'First name must be a string' })
  @IsNotEmpty({ message: 'First name is require' })
  @Matches(/^[^\s]+$/, { message: 'Name cannot contain whitespace.' })
  first_name: string;

  @ApiProperty({
    example: 'Samuel',
    description: 'The last name of the user',
    required: true,
  })
  @IsString({ message: 'Last name must be a string' })
  @IsNotEmpty({ message: 'Last name is require' })
  @Matches(/^[^\s]+$/, { message: 'Name cannot contain whitespace.' })
  last_name: string;

  @ApiProperty({
    example: '+2348104075057',
    description: 'The phone number of the user',
    required: true,
  })
  @IsPhoneNumber('NG', {
    message: 'Phone number must be a valid Nigerian phone number',
  })
  @IsString({ message: 'Phone number must be a string' })
  @IsNotEmpty({ message: 'Phone number is require' })
  @Matches(/^[^\s]+$/, { message: 'Name cannot contain whitespace.' })
  phone: string;

  @ApiProperty({
    example: 'tobis@gmail.com',
    description: 'The email address of the user',
    required: true,
  })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @IsString({ message: 'Email must be a string' })
  @IsNotEmpty({ message: 'Email is require' })
  @Matches(/^[^\s]+$/, { message: 'Name cannot contain whitespace.' })
  email: string;

  @ApiProperty({
    example: '123456',
    required: true,
    title: 'Change Password',
  })
  @IsNotEmpty({ message: 'Old Password is required' })
  @IsString({ message: 'Old Password must be a string' })
  @Matches(/^[^\s]+$/, { message: 'Old Password cannot contain whitespace.' })
  @MinLength(6, { message: 'Old Password must be at least 4 characters long.' })
  password: string;

  @ApiProperty({ example: Object.values(UserRole), required: true })
  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(UserRole, { each: true })
  roles: UserRole[];
}

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsString()
  refreshToken?: string | null;
}
