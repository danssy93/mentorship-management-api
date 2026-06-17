import { IsOptional, IsString } from 'class-validator';

export class SendMatchRequestDto {
  @IsString()
  message: string;
}

export class RejectMatchRequestDto {
  @IsString()
  @IsOptional()
  rejection_reason: string;
}
