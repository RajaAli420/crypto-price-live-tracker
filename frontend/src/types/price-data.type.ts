export interface PriceData {
  currentPrice: number;
  volumeChange: number;
  priceChange: number;
  openPrice: number;
  highPrice: number;
  lowPrice: number;
  closePrice: number;
  symbol: any;
}

export interface OneTimeTicker {
  symbol: string;
  price: string;
}
