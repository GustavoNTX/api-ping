import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { PingModule } from './ping/ping.module';

@Module({
  imports: [
    CacheModule.register({
      ttl: 30,
      max: 100,
    }),
    PingModule,
  ],
})
export class AppModule { }
