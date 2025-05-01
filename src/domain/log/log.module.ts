import { Module } from '@nestjs/common';
import { config } from 'dotenv';
import { LogService } from './application/log.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { FontViewLog } from './domain/invitation-view-log.entity';
import { FontViewLogCustomRepository } from './repository/invitation-view-log.custom.repository';
import { FontModule } from '../font/font.module';
import { LogController } from './presentation/log.controller';
import { CommonModule } from 'src/common/common.module';

config({ path: `.env.${process.env.NODE_ENV}` });

@Module({
  imports: [CommonModule, FontModule, MikroOrmModule.forFeature([FontViewLog])],
  controllers: [LogController],
  providers: [LogService, FontViewLogCustomRepository],
  exports: [LogService],
})
export class LogModule {}
