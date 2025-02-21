import { Injectable, Logger } from '@nestjs/common';
import * as ping from 'ping';
import { Cache } from 'cache-manager';
import { Inject } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class PingService {
    private readonly logger = new Logger(PingService.name);

    constructor(@Inject('CACHE_MANAGER') private cacheManager: Cache) { }

    async pingHost(host: string) {
        if (!host) {
            return { error: 'Por favor, forneça um IP ou domínio válido.' };
        }

        const cachedResult = await this.cacheManager.get(host);
        if (cachedResult) {
            this.logger.log(`Retornando cache para ${host}`);
            return cachedResult;
        }

        try {
            const result = await ping.promise.probe(host);
            this.logger.log(`Ping realizado para: ${host}, Status: ${result.alive ? 'Online' : 'Offline'}, Tempo: ${result.time} ms`);

            const ipInfo = await this.getIpInfo(host);

            const response = {
                host: result.host,
                alive: result.alive,
                time: result.time ? `${result.time} ms` : 'N/A',
                location: ipInfo,
            };

            await this.cacheManager.set(host, response, 30);

            return response;
        } catch (error) {
            this.logger.error(`Erro ao testar o ping para ${host}`, error);
            return { error: `Erro ao testar o ping para ${host}` };
        }
    }

    private async getIpInfo(ip: string) {
        try {
            const response = await axios.get(`http://ip-api.com/json/${ip}`);
            return {
                country: response.data.country,
                region: response.data.regionName,
                city: response.data.city,
                isp: response.data.isp,
            };
        } catch (error) {
            this.logger.warn(`Não foi possível obter informações do IP: ${ip}`);
            return null;
        }
    }
}
