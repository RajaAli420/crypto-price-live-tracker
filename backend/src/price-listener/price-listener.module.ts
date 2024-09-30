import { Module } from '@nestjs/common';
import { PriceListenerGateway } from './price-listener.gateway';
import { PriceListenerService } from './price-listener.service';

@Module({
  providers: [PriceListenerGateway, PriceListenerService],
})
export class PriceListenerModule {}
