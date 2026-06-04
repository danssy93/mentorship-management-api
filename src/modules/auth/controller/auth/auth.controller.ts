import {
  Body,
  Controller,
  HttpStatus,
  Logger,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../../services/auth/auth.service';
import { LoginDto, RefreshTokenDto } from '../../dtos/login.dto';
import type { Response } from 'express';
import { ResponseFormat } from 'src/common/utils/ResponseFormate';
import AppError from 'src/common/errors/AppError';
import { CurrentUser } from 'src/common/guards/current-admin.guard';
import { User } from 'src/database/entities';
import {
  ApiOperation,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiBody,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../guards/jwt-auth/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authservice: AuthService) {}

  @ApiOperation({
    summary: 'user Authentication',
    description: 'Validate login credential and provide auth token',
  })
  @ApiOkResponse({
    description: 'Login successful',
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid credentials',
  })
  @ApiBody({
    type: LoginDto,
    description: 'Login details',
  })
  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    const { message, data } = await this.authservice.login(loginDto);
    if (!data) {
      throw new AppError('Login failed', HttpStatus.UNAUTHORIZED);
    }
    return ResponseFormat.success(res, message, data);
  }

  @ApiOkResponse({
    description: 'Token refreshed successfully',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  @ApiNotFoundResponse({
    description: 'User record not found',
  })
  @Post('refresh-token')
  async refreshToken(
    @Body() refreshToken: RefreshTokenDto,
    @Res() res: Response,
  ) {
    const token = await this.authservice.generateRefreshToken(refreshToken);
    if (!token) {
      throw new AppError('Token refresh failed', HttpStatus.UNAUTHORIZED);
    }
    return ResponseFormat.success(res, 'Token successfully refreshed', token);
  }

  @ApiOperation({
    summary: 'Deactivate customer token',
    description: 'Logout customer and blacklist token',
  })
  @ApiOkResponse({
    description: 'Deactivation/Logout successful',
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid user',
  })
  @ApiBadRequestResponse({
    description: 'Validation failed or required parameters missing.',
  })
  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@CurrentUser() user: User, @Res() res: Response) {
    await this.authservice.logout(user.id);
    return ResponseFormat.success(res, 'Logout successful', null);
  }
}
