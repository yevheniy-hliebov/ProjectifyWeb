import { HttpException, HttpStatus } from '@nestjs/common';

export class HttpExceptionErrors extends HttpException {
  constructor(message: string, statusCode: number, public errors: Record<string, any>) {
    super({ message, errors }, statusCode);
  }
}