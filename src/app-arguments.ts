import * as dotenv from 'dotenv';

dotenv.config({
  path: `./env/.env.production`,
});

const getAppArguments = (): any => {
  return {
    BINANCE_API_KEY: process.env.BINANCE_API_KEY,
    BINANCE_API_SECRET: process.env.BINANCE_API_SECRET,
    ALCHEMY_API_KEY: process.env.ALCHEMY_API_KEY,
    METAMASK_API_KEY: process.env.METAMASK_API_KEY,
  };
};

export const appArguments = getAppArguments();
