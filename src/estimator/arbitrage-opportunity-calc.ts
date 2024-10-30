import { DEPOSIT_FEE_CEX, FEE_CEX, FEE_DEX, SYMBOL, VOLUME } from '../shared/constants';
import { getNetworkFee } from '../fees/network-fee';
import { getReservesAndPrice } from '../uniswap/uniswap.service';
import { getBinanceSymbolPrice } from '../binance/binance.service';
import { ArbitrageResult } from '../shared/types';

export async function calculateArbitrageProfit(): Promise<ArbitrageResult> {
  try {
    const binancePrice = await getBinanceSymbolPrice(SYMBOL);
    if (!binancePrice) {
      throw new Error('Failed to fetch Binance price');
    }

    const { price: uniswapPrice, reserve0 } = await getReservesAndPrice();
    if (!uniswapPrice) {
      throw new Error('Failed to fetch Uniswap price');
    }

    const tokensToBuyDEX = VOLUME / uniswapPrice;
    const networkFeeInUsdt = await getNetworkFee();

    if (tokensToBuyDEX > reserve0) {
      console.log('Not enough liquidity on Uniswap for the desired volume');

      return null;
    }

    // Арбитраж DEX -> CEX
    const totalCostOnDEX = VOLUME + VOLUME * FEE_DEX;
    const totalRevenueOnCEX =
      tokensToBuyDEX * binancePrice - tokensToBuyDEX * binancePrice * (FEE_CEX + DEPOSIT_FEE_CEX);
    const profitDEXToCEX = totalRevenueOnCEX - totalCostOnDEX - networkFeeInUsdt;

    console.log(`Profit from DEX to CEX: ${profitDEXToCEX.toFixed(2)} USDT`);

    if (profitDEXToCEX < -5) {
      return null;
    }

    return { profit: profitDEXToCEX, kindOfArbitrage: 'DEXCEX', tokensToBuy: tokensToBuyDEX * 0.99 };
  } catch (error) {
    console.error('Error calculating arbitrage profit:', error.message);

    return null;
  }
}
