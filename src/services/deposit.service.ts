import { ethers } from 'ethers';
import { binanceClient } from '../binance/client/binance.client';
import { getBinanceBalance, getMetaMaskBalance } from '../balances/balance.service';
import { BINANCE_DEPOSIT_ADDRESSES, METAMASK_ADDRESS, tokenA, tokenB } from '../shared/constants';
import { erc20Abi } from '../balances/abis';
import { ethersProvider } from '../ethers/ethers';

export async function withdrawToMetamask(currency: string, amount?: number): Promise<void> {
  try {
    const assetBalance = await getBinanceBalance(currency);
    if (assetBalance === 0) {
      throw new Error(`No balance found for asset ${currency}`);
    }

    const withdrawalResult = await binanceClient.withdraw({
      coin: currency,
      address: METAMASK_ADDRESS,
      amount: amount ? amount : assetBalance,
      network: 'ETH',
      name: 'Metamask_Wallet',
    });

    console.log(`Withdrawal from binance for ${currency} successful:`, withdrawalResult);
  } catch (error) {
    console.error('Error withdrawing funds to Metamask:', error.message);
  }
}

export async function withdrawToBinance(currency: string, amount?: number): Promise<void> {
  try {
    const currencyContractAddress = currency === 'USDT' ? tokenB : tokenA;
    if (!currencyContractAddress) {
      throw new Error(`Contract address not found for ${currency}`);
    }
    const balance = await getMetaMaskBalance(currencyContractAddress, METAMASK_ADDRESS);
    console.log(`Current balance of ${currencyContractAddress}: ${balance} tokens`);

    if (balance < 0) {
      throw new Error('Insufficient token balance');
    }

    const signer = await ethersProvider.getSigner();
    const tokenContract = new ethers.Contract(currencyContractAddress, erc20Abi, signer);
    const tx = await tokenContract.transfer(BINANCE_DEPOSIT_ADDRESSES[currency], balance ? balance : amount);
    console.log('Transaction sent from METAMASK:', tx.hash);

    const receipt = await tx.wait();
    console.log('Transaction confirmed:', receipt.transactionHash);
  } catch (error) {
    console.error('Error transferring tokens to Binance:', error.message);
  }
}
