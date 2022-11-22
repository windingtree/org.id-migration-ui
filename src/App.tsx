import '@fontsource/public-sans';
import '@rainbow-me/rainbowkit/styles.css';
import { BrowserRouter } from 'react-router-dom';
import { CssVarsProvider, extendTheme } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import {
  injectedWallet,
  rainbowWallet,
  walletConnectWallet,
  ledgerWallet,
  argentWallet,
  braveWallet,
  coinbaseWallet,
  metaMaskWallet,
  omniWallet,
  trustWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { publicProvider } from 'wagmi/providers/public';
import { Routes } from './Routes';
import { PageWrapper } from './components/PageWrapper';
import { RoutesTabs } from './components/RoutesTabs';
import { CHAINS } from './config';

// Theme customization
const theme = extendTheme({});

const { chains, provider, webSocketProvider } = configureChains(
  CHAINS.map((c) => ({
    id: c.chainId,
    name: c.name,
    network: c.name,
    rpcUrls: {
      default: c.rpc,
    },
  })),
  [publicProvider()],
);

const connectors = connectorsForWallets([
  {
    groupName: 'Choose your wallet',
    wallets: [
      injectedWallet({ chains }),
      metaMaskWallet({ chains }),
      walletConnectWallet({ chains }),
      coinbaseWallet({ appName: 'ORGiD', chains }),
      ledgerWallet({ chains }),
      trustWallet({ chains }),
      rainbowWallet({ chains }),
      argentWallet({ chains }),
      braveWallet({ chains }),
      omniWallet({ chains }),
    ],
  },
]);

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
});

export const App = () => (
  <CssVarsProvider theme={theme}>
    <CssBaseline />
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <BrowserRouter>
          <RoutesTabs />
          <PageWrapper>
            <Routes />
          </PageWrapper>
        </BrowserRouter>
      </RainbowKitProvider>
    </WagmiConfig>
  </CssVarsProvider>
);
