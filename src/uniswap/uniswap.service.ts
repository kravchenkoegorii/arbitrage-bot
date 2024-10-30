import { factoryAddress, tokenA, tokenB } from '../shared/constants';
import { ethers } from 'ethers';
import { factoryAbi, uniswapV2PairAbi } from './abis';
import { ethersProvider } from '../ethers/ethers';

const getPairAddress = async (tokenA: string, tokenB: string): Promise<string> => {
  const factoryContract = new ethers.Contract(factoryAddress, factoryAbi, ethersProvider);
  try {
    return await factoryContract.getPair(tokenA, tokenB);
  } catch (error) {
    console.error('Error getting pair address:', error);
    throw error;
  }
};

export const getReservesAndPrice = async (): Promise<{ price: number; reserve0: number; reserve1: number }> => {
  const uniswapV2PairAddress = await getPairAddress(tokenA, tokenB);
  const uniswapV2Pair = new ethers.Contract(uniswapV2PairAddress, uniswapV2PairAbi, ethersProvider);

  try {
    const reserves = await uniswapV2Pair.getReserves();
    const reserve0 = parseFloat(ethers.formatUnits(reserves[0], 18));
    const reserve1 = parseFloat(ethers.formatUnits(reserves[1], 6));
    const price = reserve1 / reserve0;

    console.log(`Reserves: ${reserve0} SHIB, ${reserve1} USDT`);
    console.log(`Current price: 1 SHIB = ${price} USDT`);

    return { price, reserve0, reserve1 };
  } catch (error) {
    console.error('Error getting reserves:', error);
  }
};
