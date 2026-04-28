import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    let message = 'Internal server error';
    let details: any = null;

    if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
    } else if (typeof exceptionResponse === 'object') {
      message = (exceptionResponse as any).message || message;
      details = (exceptionResponse as any).details || null;
    }

    // Handle validation errors specifically
    if (status === HttpStatus.BAD_REQUEST && Array.isArray(message)) {
      message = 'Validation failed';
      details = message;
    }

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message,
      details,
    };

    this.logger.error(
      `${request.method} ${request.url} - Status: ${status} - Message: ${message}`,
      exception.stack,
    );

    response.status(status).json(errorResponse);
  }
}
