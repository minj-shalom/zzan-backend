import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ThrottlerModule } from '@nestjs/throttler';
import MikroOrmConfig from './mikro-orm.config';

@Module({
  imports: [
    MikroOrmModule.forRoot(MikroOrmConfig),
    ThrottlerModule.forRoot({
      ttl: 10,
      limit: 2,
    }),
  ],
})
export class ConfigurationModule {}
