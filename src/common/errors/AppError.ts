import { HttpStatus } from '@nestjs/common';
import { ErrorMessages } from 'src/database/enums';

class AppError extends Error {
  message: string;
  isOperational: boolean;
  statusCode: HttpStatus;

  constructor(message: ErrorMessages | string, statusCode: HttpStatus) {
    super();

    this.message = message;
    this.isOperational = true;
    this.statusCode = statusCode;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
