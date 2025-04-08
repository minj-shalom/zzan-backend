import { Module } from '@nestjs/common';
import { DomainModules, GlobalExceptionFilter } from 'src';

@Module({
  imports: [...DomainModules],
  providers: [...GlobalExceptionFilter],
})
export class AppModule {}
