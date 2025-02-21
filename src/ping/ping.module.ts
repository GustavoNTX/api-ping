import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { PingService } from './ping.service';
import { PingController } from './ping.controller';

@Module({
  imports: [CacheModule.register()],
  controllers: [PingController],
  providers: [PingService],
})
export class PingModule { }
