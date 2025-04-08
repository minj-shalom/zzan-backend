import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { IllegalArgumentException } from '../exception/Illegal.argument.exception';

@Catch(IllegalArgumentException)
export class IllegalArgumentExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost): any {
    const context = host.switchToHttp();

    const response = context.getResponse();
    const status = exception.getStatus();
    const message = exception.message;

    response.status(status).json({
      statusCode: status,
      message: message,
    });
  }
}
