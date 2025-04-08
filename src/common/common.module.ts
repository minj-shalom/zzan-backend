import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AppLoggerModule } from './logger/logger.module';
import { LoggingInterceptor } from './interceptors/logging.interceptor';

@Module({
  imports: [AppLoggerModule],
  providers: [{ provide: APP_INTERCEPTOR, useClass: LoggingInterceptor }],
  exports: [AppLoggerModule],
})
export class CommonModule {}
