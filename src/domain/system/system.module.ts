import { Module } from '@nestjs/common';
import { config } from 'dotenv';
import { SystemController } from './presentation/system.controller';
import { CommonModule } from 'src/common/common.module';

config({ path: `.env.${process.env.NODE_ENV}` });

@Module({
  imports: [CommonModule],
  controllers: [SystemController],
})
export class SystemModule {}
