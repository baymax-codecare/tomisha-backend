import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { Request, Response } from 'express';

const DB_NOTFOUND_ENAME = 'EntityNotFound';
const isProd = process.env.NODE_ENV === 'production';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const e = exception?.name === DB_NOTFOUND_ENAME
      ? new NotFoundException()
        : exception;

    const status = e instanceof HttpException
      ? e.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const isInternal = status === HttpStatus.INTERNAL_SERVER_ERROR;

    if (isProd || isInternal) {
      Logger.error(
        `${request.method} ${request.url}`,
        isInternal ? e : '',
        'Exception',
      );
    }

    response
      .status(status)
      .json({
        code: status,
        message: isInternal
          ? 'Internal server error'
          : e.message || null,
      });
  }
}
