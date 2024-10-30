import { subscribeToNewBlocks } from './block-subscriber/block-subscriber.service';
import { calculateArbitrageProfit } from './estimator/arbitrage-opportunity-calc';
import { doDexCexArbitrage } from './services/dex-cex-arbitrage.service';

const startAsync = async (): Promise<void> => {
  const result = await calculateArbitrageProfit();
  if (!result) {
    console.log('Arbitrage opportunity is not profitable');

    return;
  }

  console.log(`Estimated profit: ${result.profit} USDT`);

  if (result.kindOfArbitrage === 'DEXCEX') {
    await doDexCexArbitrage(result.tokensToBuy);
  }
};

(async (): Promise<void> => {
  try {
    console.log('Arbitrage bot started...');

    await subscribeToNewBlocks(startAsync);
  } catch (error) {
    console.error(`Server error: ${error}`);
  }
})();
