import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, InternalServerErrorException, Logger } from "@nestjs/common";
import { Request, Response } from "express";
import { HttpExceptionErrors } from "./customs.exception";
import { ExceptionsHandler } from "@nestjs/core/exceptions/exceptions-handler";
import { BaseExceptionFilter } from "@nestjs/core";

@Catch(HttpException, Error, HttpExceptionErrors)
export class HttpExceptionFilter extends BaseExceptionFilter {
  catch(exception: Error | HttpException | HttpExceptionErrors, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error'
    if (exception instanceof Error) {
      status = HttpStatus.INTERNAL_SERVER_ERROR
      message = 'Internal server error'
    }
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.message;
    }
    const exceptionResponse: any = {
      statusCode: status,
      path: request.url,
      method: request.method,
      timestamp: new Date().toISOString(),
      message: message
    }

    if (exception instanceof HttpExceptionErrors) {
      exceptionResponse.errors = exception.errors;
    }
    response.status(status).json(exceptionResponse);
    
  }
}