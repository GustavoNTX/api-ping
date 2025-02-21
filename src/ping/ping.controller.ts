import { Controller, Get, Query } from '@nestjs/common';
import { PingService } from './ping.service';

@Controller('ping')
export class PingController {
    constructor(private readonly pingService: PingService) { }

    @Get()
    async ping(@Query('host') host: string) {
        return this.pingService.pingHost(host);
    }
}
