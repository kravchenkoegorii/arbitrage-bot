import { placeBinanceOrder, swapTokensOnUniswap } from './exchange.service';
import { tokenA, tokenB, VOLUME } from '../shared/constants';
import { withdrawToBinance, withdrawToMetamask } from './deposit.service';
import { trackOrderExecution } from '../binance/binance.service';

export const doDexCexArbitrage = async (tokensToBuy: number): Promise<void> => {
  await swapTokensOnUniswap(tokenA, tokenB, VOLUME, tokensToBuy);
  await withdrawToBinance(tokenB);
  const order = await placeBinanceOrder('SHIB', 'SELL');
  const status = await trackOrderExecution(order.orderId);
  if (status) {
    await withdrawToMetamask('USDT');
  }
};
