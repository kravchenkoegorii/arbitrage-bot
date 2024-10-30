import { ethers } from 'ethers';

const alchemyUrl = 'https://eth-mainnet.g.alchemy.com/v2/IAWdSKVye_giVNra6zIKuLKE5_0Mexp7';

export const ethersProvider = new ethers.JsonRpcProvider(alchemyUrl);
