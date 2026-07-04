import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class SendMatchRequestDto {
  @ApiProperty({
    example: 'Hi, I would love to learn Nestjs etc',
  })
  @IsString()
  message: string;
}

export class RejectMatchRequestDto {
  @ApiProperty({
    example: 'Am very occupy at the moment',
  })
  @IsString()
  @IsOptional()
  rejection_reason: string;
}
