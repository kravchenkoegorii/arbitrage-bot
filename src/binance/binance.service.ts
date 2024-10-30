import { binance, binanceClient } from './client/binance.client';
import { SymbolPrice } from 'binance';
import axios from 'axios';
import { OrderStatus } from '../shared/enums';

export const getBinanceSymbolPrice = async (symbol: string): Promise<number> => {
  try {
    const priceData = (await binanceClient.getSymbolPriceTicker({ symbol: symbol })) as SymbolPrice;

    console.log(`Symbol: ${priceData?.symbol}`);
    console.log(`Price: ${priceData?.price}`);

    return Number(priceData?.price);
  } catch (error) {
    console.error(`Error fetching symbol price from Binance for ${symbol}:`, error.message);
  }
};

export const getBinanceOrderBookPrice = async (symbol: string, amount: number) => {
  try {
    const orderBook = await axios.get('https://api.binance.com/api/v3/depth?limit=500&symbol=SHIBUSDT');
    let price: number;
    for (const order of orderBook.data.bids) {
      if (amount <= 0) {
        break;
      }
      amount -= Number(order[1]);
      price = Number(order[0]);
    }

    return price;
  } catch (error) {
    console.error(`Error fetching order book from Binance for ${symbol}:`, error.message);
  }
};

export const trackOrderExecution = async (orderId: number): Promise<boolean> => {
  return new Promise<boolean>(async (resolve, reject) => {
    const ws = await binance.ws.user(async (msg) => {
      if (msg.eventType === 'executionReport' && msg.orderId === orderId) {
        console.log(`Order update: ${msg.orderId}, status: ${msg.orderStatus}`);

        if (msg.orderStatus === OrderStatus.FILLED) {
          console.log(`Order ${msg.orderId} is complete with status: ${msg.orderStatus}`);
          ws();
          resolve(true);
        }

        if (msg.orderStatus === OrderStatus.CANCELED) {
          console.log(`Order ${msg.orderId} is canceled with status: ${msg.orderStatus}`);
          ws();
          resolve(false);
        }
      }
    });

    setTimeout(() => {
      ws();
      reject(new Error(`Order ${orderId} tracking timeout`));
    }, 60000);
  });
};
