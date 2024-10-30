export const factoryAbi = [
  {
    constant: true,
    inputs: [
      { internalType: 'address', name: 'tokenA', type: 'address' },
      { internalType: 'address', name: 'tokenB', type: 'address' },
    ],
    name: 'getPair',
    outputs: [{ internalType: 'address', name: 'pair', type: 'address' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
];

export const uniswapV2PairAbi = [
  {
    constant: true,
    inputs: [],
    name: 'getReserves',
    outputs: [
      { internalType: 'uint112', name: '_reserve0', type: 'uint112' },
      { internalType: 'uint112', name: '_reserve1', type: 'uint112' },
      { internalType: 'uint32', name: '_blockTimestampLast', type: 'uint32' },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
];
