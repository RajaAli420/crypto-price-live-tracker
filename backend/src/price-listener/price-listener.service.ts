import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Socket } from 'dgram';
import { WebSocket } from 'ws';
@Injectable()
export class PriceListenerService {
  private readonly binanceWsUrl = 'wss://stream.binance.com:9443/ws';
  protected socketClient: WebSocket;
  symbols = ['solusdt', 'avaxusdt', 'pepeusdt'];
  constructor(private eventEmitter: EventEmitter2) {}
  //for streaming prices
  onModuleInit() {
    this.connectStream(false);
  }

  subscribeToPriceUpdate() {
    const subscriptions = this.symbols.map((symbol) => `${symbol}@ticker`);
    if (this.socketClient.readyState === WebSocket.OPEN)
      this.socketClient.send(
        JSON.stringify({
          method: 'SUBSCRIBE',
          params: subscriptions,
          id: 1,
        }),
      );
  }
  connectStream(isClientConnected: boolean) {
    if (isClientConnected) {
      this.socketClient = new WebSocket(this.binanceWsUrl);

      this.socketClient.on('open', () => {
        console.log('Connection established');
        this.subscribeToPriceUpdate();
      });

      this.socketClient.on('message', (data) => {
        const parsedData = JSON.parse(data.toString());
        this.handleTickerUpdate(parsedData);
      });

      this.socketClient.on('close', () => {
        console.log('Socket connection closed');
      });

      this.socketClient.on('error', (error) => {
        console.log(error, 'Socket');
      });
    } else {
      console.log('Socket is already connected');
    }
  }
  handleTickerUpdate(data: any) {
    const symbol = data.s;
    let symbolData = {};
    if (symbol) {
      symbolData = {
        currentPrice: parseFloat(data.w),
        volumeChange: parseFloat(data.v),
        priceChange: parseFloat(data.p),
        openPrice: parseFloat(data.o),
        highPrice: parseFloat(data.h),
        lowPrice: parseFloat(data.l),
        closePrice: parseFloat(data.c),
        symbol,
      };
      this.eventEmitter.emit('price-update', symbolData);
    }
    return symbolData;
  }
  disconnectStream() {
    if (this.socketClient && this.socketClient.readyState === WebSocket.OPEN)
      this.socketClient?.close();
    console.log('WebSocket connection closed');
  }

  getPriceOneTime(symbol: string, socket: Socket) {
    const newServer = new WebSocket('wss://ws-api.binance.com:443/ws-api/v3');
    newServer.onopen = () => {
      console.log('New WebSocket API connection opened');
      const requestBody = {
        id: 1,
        method: 'ticker.price',
        params: {
          symbol: symbol.toUpperCase(),
        },
      };
      newServer.send(JSON.stringify(requestBody));
    };

    newServer.onmessage = (event) => {
      const data = JSON.parse(event.data.toString());
      socket.emit('one-time-ticker-price', data.result);
      newServer.close();
    };

    newServer.onerror = (error) => {
      console.log('New WebSocket API error:', error);
    };

    newServer.onclose = () => {
      console.log('New WebSocket API connection closed');
    };
  }
}
