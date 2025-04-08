import { APP_FILTER } from '@nestjs/core';
import { IllegalArgumentExceptionFilter } from './common/exceptions/handler/Illegal.argument.exception.filter';
import { ConfigurationModule } from './infrastructure/configuration/configuration.module';
import { CommonModule } from './common/common.module';
import { FontModule } from './domain/font/font.module';

export const DomainModules = [CommonModule, ConfigurationModule, FontModule];

export const GlobalExceptionFilter = [
  { provide: APP_FILTER, useClass: IllegalArgumentExceptionFilter },
];
