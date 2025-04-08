import { HttpException } from '@nestjs/common';
import { FontExceptionCode } from '../error-codes/font.exception.codes';

type ExceptionCode = FontExceptionCode;

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
