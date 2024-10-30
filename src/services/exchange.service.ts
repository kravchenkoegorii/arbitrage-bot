import { OrderSide } from 'binance';
import { ethers } from 'ethers';
import { METAMASK_ADDRESS, ROUTER_CONTRACT_ADDRESS } from '../shared/constants';
import { erc20Abi } from '../balances/abis';
import { ethersProvider } from '../ethers/ethers';
import { appArguments } from '../app-arguments';
import { binance } from '../binance/client/binance.client';
import { Order, OrderType } from 'binance-api-node';
import { getBinanceOrderBookPrice } from '../binance/binance.service';
import { getBinanceBalance } from '../balances/balance.service';
import { uniswapV2RouterAbi } from './abi';

export const placeBinanceOrder = async (symbol: string, side: OrderSide): Promise<Order> => {
  try {
    const amount = await getBinanceBalance(symbol);
    const price = await getBinanceOrderBookPrice(symbol, amount);
    const order = await binance.order({
      symbol,
      type: OrderType.LIMIT,
      quantity: amount.toString(),
      side: side,
      price: price.toString(),
    });

    console.log(`Order placed: ${order.orderId}`);

    return order;
  } catch (error) {
    console.error(`Error placing order on Binance for ${symbol}:`, error.message);
    throw error;
  }
};

export async function swapTokensOnUniswap(
  tokenIn: string,
  tokenOut: string,
  amountIn: number,
  amountOutMin: number,
): Promise<void> {
  try {
    const wallet = new ethers.Wallet(appArguments.METAMASK_API_KEY, ethersProvider);
    const uniswapV2Router = new ethers.Contract(ROUTER_CONTRACT_ADDRESS, uniswapV2RouterAbi, wallet);
    const token = new ethers.Contract(tokenIn, erc20Abi, wallet);
    const balance = await token.balanceOf(wallet.address);
    if (balance.lt(ethers.parseUnits(amountIn.toString(), 18))) {
      throw new Error('Insufficient balance of the token to swap');
    }

    // Одобрение токенов для Uniswap V2 Router
    const approveTx = await token.approve(ROUTER_CONTRACT_ADDRESS, ethers.parseUnits(amountIn.toString(), 18));
    await approveTx.wait();

    // Путь обмена
    const route = [tokenIn, tokenOut];

    // Дедлайн транзакции (например, 20 минут с текущего времени)
    const deadline = Math.floor(Date.now() / 1000) + 60 * 20;

    // Выполнение обмена
    const swapTx = await uniswapV2Router.swapExactTokensForTokens(
      ethers.parseUnits(amountIn.toString(), 18),
      ethers.parseUnits(amountOutMin.toString(), 18),
      route,
      METAMASK_ADDRESS,
      deadline,
    );

    await swapTx.wait();

    console.log('Swap completed:', swapTx.hash);
  } catch (error) {
    console.error('Error swapping tokens on Uniswap:', error.message);
  }
}
