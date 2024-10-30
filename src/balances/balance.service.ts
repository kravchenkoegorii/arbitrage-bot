import { ethersProvider } from '../ethers/ethers';
import { ethers } from 'ethers';
import { binanceClient } from '../binance/client/binance.client';
import { erc20Abi } from './abis';

export async function getMetaMaskBalance(tokenAddress: string, walletAddress: string): Promise<number> {
  try {
    const tokenContract = new ethers.Contract(tokenAddress, erc20Abi, ethersProvider);
    const balance = await tokenContract.balanceOf(walletAddress);
    const formattedBalance = ethers.formatUnits(balance, 6);

    return parseFloat(formattedBalance);
  } catch (error) {
    console.error('Error getting MetaMask balance:', error);

    return null;
  }
}

export async function getBinanceBalance(currency: string): Promise<number> {
  try {
    const allBalances = await binanceClient.getBalances();
    const balance = allBalances.find((bal) => bal.coin === currency);

    return Number(balance.free);
  } catch (error) {
    console.error('Error getting binance balance:', error);

    return 0;
  }
}
