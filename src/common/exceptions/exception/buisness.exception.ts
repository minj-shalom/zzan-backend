import { HttpException } from '@nestjs/common';

type ExceptionCode = any;

export class BusinessException extends HttpException {
  constructor(exceptionCode: ExceptionCode, message?: string) {
    super(
      {
        statusCode: exceptionCode.httpStatus,
        errorCode: exceptionCode.code,
        errorDesc: exceptionCode.errorString,
        message: message || exceptionCode.message,
      },
      exceptionCode.httpStatus,
    );
  }
}
