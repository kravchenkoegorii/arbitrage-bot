import { ethers } from 'ethers';
import { ethersProvider } from '../ethers/ethers';
import axios from 'axios';

async function getEthToUsdtRate(): Promise<number> {
  try {
    const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');

    return response.data.ethereum.usd;
  } catch (error) {
    console.error('Error fetching ETH/USDT exchange rate:', error);

    return 0;
  }
}

export async function getNetworkFee(): Promise<number> {
  try {
    const gasPrice = await ethersProvider.getFeeData();
    const gasLimit = 21000;

    const networkFee = gasPrice.maxFeePerGas * BigInt(gasLimit);
    const networkFeeInEth = ethers.formatEther(networkFee);

    console.log(`Current Gas Price: ${ethers.formatUnits(gasPrice.maxFeePerGas, 'gwei')} Gwei`);

    const ethToUsdtRate = await getEthToUsdtRate();
    const networkFeeInUsdt = parseFloat(networkFeeInEth) * ethToUsdtRate;

    console.log(`Network Fee for a standard transaction: ${networkFeeInUsdt.toFixed(2)} USDT`);

    return networkFeeInUsdt;
  } catch (error) {
    console.error('Error calculating network fee:', error);
  }
}
