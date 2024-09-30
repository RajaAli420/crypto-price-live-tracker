import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PriceListenerModule } from './price-listener/price-listener.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [PriceListenerModule, EventEmitterModule.forRoot()],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
