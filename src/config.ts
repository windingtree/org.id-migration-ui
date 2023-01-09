import { Chain } from 'wagmi';
export interface ChainConfig extends Chain {
  orgIdAddress: string;
  dest?: boolean;
  env: string[];
}

export const checkEnvVariables = (vars: string[]): void =>
  vars.forEach((variable) => {
    if (!process.env[variable] || process.env[variable] === '') {
      throw new Error(`${variable} must be provided in the ENV`);
    }
  });

checkEnvVariables(['REACT_APP_BE_URI', 'REACT_APP_VALIDATOR_URI']);

const environment = process.env['REACT_APP_ENV'] || 'stage';

export const CHAINS: ChainConfig[] = [
  {
    name: 'Gnosis Chain',
    network: 'gnosis',
    id: 100,
    rpcUrls: {
      default: {
        http: ['https://poa-xdai.gateway.pokt.network/v1/lb/0b1afa3b501711635aee21f6'],
      },
    },
    nativeCurrency: {
      name: 'xDAI',
      symbol: 'xDAI',
      decimals: 18,
    },
    testnet: false,
    blockExplorers: {
      default: {
        name: 'blockscout',
        url: 'https://blockscout.com/xdai/mainnet',
      },
    },
    orgIdAddress: '0xb63d48e9d1e51305a17F4d95aCa3637BBC181b44',
    dest: true,
    env: ['prod'],
  },
  {
    name: 'Polygon',
    network: 'polygon',
    id: 137,
    rpcUrls: {
      default: {
        http: [
          'https://poly-mainnet.gateway.pokt.network/v1/lb/0b1afa3b501711635aee21f6',
        ],
      },
    },
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
    },
    testnet: false,
    blockExplorers: {
      default: {
        name: 'polygonscan',
        url: 'https://polygonscan.com',
      },
    },
    orgIdAddress: '0x8a093Cb94663994d19a778c7EA9161352a434c64',
    dest: true,
    env: ['prod'],
  },
  {
    name: 'Goerli',
    network: 'goerli',
    id: 5,
    rpcUrls: {
      default: {
        http: ['https://eth-goerli.g.alchemy.com/v2/aw5WyUmvvU_Uf4fI8nDj51Nx0QeUJ0lr'],
      },
    },
    nativeCurrency: {
      name: 'GOR',
      symbol: 'GOR',
      decimals: 18,
    },
    testnet: true,
    blockExplorers: {
      default: {
        name: 'etherscan',
        url: 'https://goerli.etherscan.io',
      },
    },
    orgIdAddress: '0xe02dF24d8dFdd37B21690DB30F4813cf6c4D9D93',
    env: ['stage'],
  },
  {
    name: 'Chiado',
    network: 'chiado',
    id: 10200,
    rpcUrls: {
      default: {
        http: ['https://rpc.chiadochain.net'],
      },
    },
    nativeCurrency: {
      name: 'xDAI',
      symbol: 'xDAI',
      decimals: 18,
    },
    testnet: true,
    blockExplorers: {
      default: {
        name: 'blockscout',
        url: 'https://blockscout.chiadochain.net',
      },
    },
    orgIdAddress: '0xaa727223949Bf082a8AFcb29B34B358d9bad8736',
    dest: true,
    env: ['stage'],
  },
];

export const DEST_CHAINS = CHAINS.filter((c) => c.dest && c.env.includes(environment));

export const getChain = (chainId: string | number): ChainConfig => {
  const chain = CHAINS.find((c) => c.id === Number(chainId));
  if (!chain) {
    throw new Error(`Chain with Id: ${chainId} not found`);
  }
  return chain;
};

export const BE_URI = process.env.REACT_APP_BE_URI || '';
export const VALIDATOR_URI = process.env.REACT_APP_VALIDATOR_URI || '';

export const POLLER_TIMEOUT = 3000;
