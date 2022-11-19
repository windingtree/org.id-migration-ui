export interface ChainConfig {
  name: string;
  chainId: number;
  orgIdAddress: string;
  rpc: string;
  dest?: boolean;
}

export const checkEnvVariables = (vars: string[]): void =>
  vars.forEach((variable) => {
    if (!process.env[variable] || process.env[variable] === '') {
      throw new Error(`${variable} must be provided in the ENV`);
    }
  });

checkEnvVariables([]);

export const CHAINS: ChainConfig[] = [
  {
    name: 'Gnosis Chain',
    chainId: 100,
    orgIdAddress: '0xb63d48e9d1e51305a17F4d95aCa3637BBC181b44',
    rpc: 'https://poa-xdai.gateway.pokt.network/v1/lb/0b1afa3b501711635aee21f6',
    dest: true,
  },
  {
    name: 'Polygon',
    chainId: 137,
    orgIdAddress: '0x8a093Cb94663994d19a778c7EA9161352a434c64',
    rpc: 'https://poly-mainnet.gateway.pokt.network/v1/lb/0b1afa3b501711635aee21f6',
    dest: true,
  },
  {
    name: 'Goerli',
    chainId: 5,
    orgIdAddress: '0xe02dF24d8dFdd37B21690DB30F4813cf6c4D9D93',
    rpc: 'https://eth-goerli.g.alchemy.com/v2/aw5WyUmvvU_Uf4fI8nDj51Nx0QeUJ0lr',
  },
  {
    name: 'Sokol',
    chainId: 77,
    orgIdAddress: '0xDd1231c0FD9083DA42eDd2BD4f041d0a54EF7BeE',
    rpc: 'https://sokol.poa.network',
    dest: true,
  },
];

export const DEST_CHAINS = CHAINS.filter((c) => c.dest);
