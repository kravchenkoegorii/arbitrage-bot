import { ethersProvider } from '../ethers/ethers';

export const subscribeToNewBlocks = async (fn: any): Promise<void> => {
  await ethersProvider.on('block', async (blockNumber) => {
    console.log('Received block: ', blockNumber);
    await fn();
  });

  console.log('Subscribed to new blocks.');
};
