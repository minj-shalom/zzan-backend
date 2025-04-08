import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { config } from 'dotenv';
import { Font } from './domain/font.entity';
import { FontController } from './presentation/font.controller';
import { FontService } from './application/font.service';
import { FontCustomRepository } from './repository/font.custom.repository';
import { CommonModule } from 'src/common/common.module';

config({ path: `.env.${process.env.NODE_ENV}` });

@Module({
  imports: [CommonModule, MikroOrmModule.forFeature([Font])],
  controllers: [FontController],
  providers: [FontService, FontCustomRepository],
  exports: [FontService],
})
export class FontModule {}
