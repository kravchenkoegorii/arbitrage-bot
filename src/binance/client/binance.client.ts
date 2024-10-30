import { MainClient } from 'binance';
import Binance from 'binance-api-node';
import { appArguments } from '../../app-arguments';

export const binanceClient = new MainClient({
  api_key: appArguments.BINANCE_API_KEY,
  api_secret: appArguments.BINANCE_API_SECRET,
});

export const binance = Binance({
  apiKey: appArguments.BINANCE_API_KEY,
  apiSecret: appArguments.BINANCE_API_SECRET,
});
