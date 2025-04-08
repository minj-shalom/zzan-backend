import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AppLogger } from '../logger/logger.service';
import { createRequestContext } from '../request-context/util';
import { BusinessException } from '../exceptions/exception/buisness.exception';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private appLogger: AppLogger) {
    this.appLogger.setContext(LoggingInterceptor.name);
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const ctx = createRequestContext(request);
    const user = context.switchToHttp().getRequest().user?.email ?? 'guest';

    const now = Date.now();

    return next.handle().pipe(
      tap(() => {
        const response = context.switchToHttp().getResponse();
        const statusCode = response.statusCode;

        const responseTime = Date.now() - now;

        const resData = { method, statusCode, responseTime, user };

        this.appLogger.log(ctx, 'Request completed', { resData });
      }),
      catchError((e) => {
        let error: any = undefined;

        if (e instanceof BusinessException) {
          error = e;
        } else {
          error = {
            message: e.message,
          };
        }

        this.appLogger.error(ctx, 'Request failed', { error, user });

        // Re-throw the error to propagate it to the next error handling layer
        return throwError(() => e);
      }),
    );
  }
}
