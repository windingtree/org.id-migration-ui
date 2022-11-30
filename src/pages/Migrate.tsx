import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { Button, List, ListItemContent, Box } from '@mui/joy';
import { useNavigate } from 'react-router-dom';
import RefreshIcon from '@mui/icons-material/Refresh';
import UpdateIcon from '@mui/icons-material/Update';
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { Dids } from '../common/types';
import { useApi } from '../hooks/useApi';
import { HttpStatusCode } from '../hooks/useApi';
import { usePoller } from '../hooks/usePoller';
import { RequireConnect } from '../components/RequireConnect';
import { Message } from '../components/Message';
import { EllipsisListButton } from '../components/EllipsisListButton';
import { POLLER_TIMEOUT } from '../config';

const icons = {
  ready: null,
  requested: <UpdateIcon color="info" sx={{ ml: 1 }} />,
  progress: <UpdateIcon color="action" sx={{ ml: 1 }} />,
  failed: <ErrorIcon color="error" sx={{ ml: 1 }} />,
  completed: <CheckCircleOutlineIcon color="success" sx={{ ml: 1 }} />,
};

export const StatusIcon = ({ state }: { state: string }) => {
  if (!state) {
    return null;
  }
  return icons[state];
};

export const Migrate = () => {
  const navigate = useNavigate();
  const { address } = useAccount();
  const { data, loading, loaded, error, errorCode, reload } = useApi<Dids>(
    'GET',
    `api/dids/${address}`,
    address !== undefined,
  );
  usePoller(reload, address !== undefined, POLLER_TIMEOUT, 'Check DIDs');

  if (!address) {
    return <RequireConnect />;
  }

  return (
    <>
      <Box sx={{ mb: 2, display: 'flex', flexDirection: 'row', gap: 2 }}>
        <Box>
          <ConnectButton />
        </Box>
        <Box>
          <Button variant="soft" onClick={reload} loading={loading} disabled={loading}>
            <RefreshIcon />
          </Button>
        </Box>
      </Box>
      <Message type="warn" show={address !== undefined && loaded && !data}>
        It seems that account {address} does not own any ORGiDs
      </Message>
      {data && (
        <List>
          {data.map((d, index) => (
            <ListItemContent
              key={index}
              sx={{
                display: 'flex',
                flexDirection: 'row',
                gap: 1,
                alignItems: 'center',
                maxWidth: 500,
              }}
            >
              <EllipsisListButton
                disabled={!['ready', 'completed'].includes(d.state)}
                onClick={() =>
                  navigate(
                    d.state === 'completed' ? `resolve/${d.did}` : `migrate/${d.did}`,
                  )
                }
              >
                {d.did}
              </EllipsisListButton>
              <StatusIcon state={d.state} />
            </ListItemContent>
          ))}
        </List>
      )}
      <Message
        type="error"
        show={error !== undefined && errorCode !== HttpStatusCode.NotFound}
      >
        {error}
      </Message>
    </>
  );
};
