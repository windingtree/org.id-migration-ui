import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { Box } from '@mui/joy';
import { Message } from '../components/Message';

export const RequireConnect = () => {
  const { address } = useAccount();

  if (address) {
    return null;
  }

  return (
    <>
      <Message type="warn" show={address === undefined}>
        Please connect your wallet to continue
      </Message>
      <Box sx={{ mb: 2 }}>
        <ConnectButton />
      </Box>
    </>
  );
};
