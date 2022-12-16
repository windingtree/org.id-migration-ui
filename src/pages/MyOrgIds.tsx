import { Box, Button } from '@mui/joy';
import RefreshIcon from '@mui/icons-material/Refresh';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { Message } from '../components/Message';
import { RequireConnect } from '../components/RequireConnect';
import { CHAINS } from '../config';
import { useChain } from '../hooks/useChain';
import { useMyOrgIds } from '../hooks/useMyOrgIds';
import { OrgIdsList } from '../components/OrgIdsList';

export const MyOrgIds = () => {
  const { address } = useAccount();
  const { chainId, supported } = useChain();
  const { data, loading, error, reload } = useMyOrgIds(address, chainId);

  if (!address) {
    return (
      <RequireConnect legend="To be able to review your registered ORGiDs you have to connect your wallet" />
    );
  }

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
        <ConnectButton showBalance={false} />
        <Button variant="soft" onClick={reload} loading={loading} disabled={loading}>
          <RefreshIcon />
        </Button>
      </Box>

      <Message type="warn" show={address && !supported} sx={{ mt: 2, mb: 2 }}>
        Please connect your wallet to one of the supported networks:{' '}
        {CHAINS.map((c) => c.name).join(', ')}
      </Message>

      <OrgIdsList chainId={chainId} data={data} sx={{ mt: 3, maxWidth: 'sm' }} />

      <Message type="error" show={error !== undefined} sx={{ mb: 2 }}>
        {error}
      </Message>
    </>
  );
};
