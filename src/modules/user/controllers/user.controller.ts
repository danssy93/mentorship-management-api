import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import type { Response } from 'express';
import { UserService } from '../services/user.service';
import { CreateUserDto } from '../dtos/createUser.dto';
import { ResponseFormat } from 'src/common/utils/ResponseFormate';

@ApiTags('User module')
@Controller('user')
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: 'Create a new user',
    description: 'Registers a new user in the system.',
  })
  @ApiOkResponse({
    description: 'Record created successfully',
  })
  @ApiBody({
    type: CreateUserDto,
    description: 'Payload to create a user.',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized access.',
  })
  @ApiBadRequestResponse({
    description: 'Validation failed or required parameters missing.',
  })
  @Post('create')
  async createUser(@Body() payload: CreateUserDto, @Res() res: Response) {
    const user = await this.userService.create(payload);
    return ResponseFormat.success(res, 'User created successfully', user);
  }

  @ApiOperation({
    summary: 'Get Role',
    description: 'Fetches users by their role.',
  })
  @ApiOkResponse({
    description: 'Role retrieved successfully.',
  })
  @ApiBadRequestResponse({
    description: 'Bad request due to invalid input or processing error.',
  })
  @Get(':role')
  async getUserByRole(@Param('role') role: string, @Res() res: Response) {
    const user = await this.userService.findOneBy({ role });
    return ResponseFormat.success(res, 'User fetched successfully', user);
  }
}
