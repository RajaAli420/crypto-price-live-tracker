import { OnEvent } from '@nestjs/event-emitter';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'http';
import { PriceListenerService } from './price-listener.service';
import { Socket } from 'dgram';

@WebSocketGateway({ cors: true })
export class PriceListenerGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  @WebSocketServer()
  server: Server;
  constructor(private readonly priceListenerService: PriceListenerService) {}
  afterInit() {
    console.log('WebSocket Gateway Initialized');
  }

  handleConnection(client: any) {
    console.log('Client connected:', client.connected);
    this.priceListenerService.connectStream(client.connected);
  }

  handleDisconnect(client: any) {
    this.priceListenerService.disconnectStream();
    console.log('Client disconnected:', client.id);
  }

  @OnEvent('price-update')
  price(body: any) {
    const symbol = body.symbol;
    if (symbol === 'PEPEUSDT') {
      this.server.emit('price-update-pepe', body);
    }
    if (symbol === 'SOLUSDT') {
      this.server.emit('price-update-sol', body);
    }
    if (symbol === 'AVAXUSDT') {
      this.server.emit('price-update-avax', body);
    }
  }
  @SubscribeMessage('get-one-time-ticker')
  getOneTimeTicker(
    @MessageBody() body: { symbol: string },
    @ConnectedSocket() socket: Socket,
  ) {
    this.priceListenerService.getPriceOneTime(body.symbol, socket);
  }
}
