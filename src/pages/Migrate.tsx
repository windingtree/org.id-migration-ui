import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { CircularProgress, Box, List, ListItem, Divider } from '@mui/joy';
import { useOwnOrgIds } from '../hooks/useOwnOrgIds';
import { Message } from '../components/Message';

export const Migrate = () => {
  const { address } = useAccount();
  const { data, loading, loaded, error } = useOwnOrgIds();
  return (
    <>
      <Message type="warn" show={address === undefined}>
        To be able to start migration process you have to connect your wallet with account
        which is owner of yours ORGiD(s)
      </Message>
      <Box sx={{ mb: 2 }}>
        <ConnectButton />
      </Box>
      {data && <Divider sx={{ mb: 2 }} />}
      {loading && <CircularProgress size="md" />}
      <Message type="warn" show={address !== undefined && loaded && !data}>
        It seems that account {address} does not own any ORGiDs
      </Message>
      {data && (
        <List>
          {data.map((o, index) => (
            <ListItem key={index}>{o}</ListItem>
          ))}
        </List>
      )}
      <Message type="error" show={error !== undefined}>
        {error}
      </Message>
    </>
  );
};
