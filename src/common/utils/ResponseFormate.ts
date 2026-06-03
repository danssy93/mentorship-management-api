import { HttpStatus } from '@nestjs/common';
import type { Response } from 'express';

export class ResponseFormat {
  /**
    * Send a standardized success response
    @param res - Express response object
    @param message - Success message
    @param code - HTTP status code (default: 200)
    @param data -Response payload
    */

  static success<T>(
    res: Response,
    message: string,
    data: T,
    code: HttpStatus = HttpStatus.OK,
  ): void {
    this.send(res, true, code, message, data);
  }

  /**
    * Send a standardized success response
    @param res - Express response object
    @param message - Success message
    @param code - HTTP status code (default: 200)
    */
  static ok(
    res: Response,
    message: string,
    code: HttpStatus = HttpStatus.OK,
  ): void {
    res.status(code).json({
      success: true,
      message,
    });
  }

  /**
    * Send a failure JSON response to the client
    @param res - Express response object
    @param message - Error message
    @param code - HTTP status code (default: 400)
    @param data - Error details or additional information
    */

  static failure<T>(
    res: Response,
    message: string,
    code: HttpStatus = HttpStatus.BAD_REQUEST,
    data?: T,
  ): void {
    this.send(res, false, code, message, data);
  }

  /**method to send JSON responses to the client.
    @param res - Express response object
    @param responseCode - Response code metadata
    @param message - Custom message (falls back to default response message)
    @param code - HTTP status code (default: 200)
    @param data - Response payload
    */

  private static send<T>(
    res: Response,
    responseCode: boolean,
    code: HttpStatus = HttpStatus.OK,
    message: string,
    data: T,
  ): void {
    res.status(code).json({
      success: responseCode,
      message,
      data: data || undefined,
    });
  }
}
