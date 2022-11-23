import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { CircularProgress, IconButton, List, Box } from '@mui/joy';
import { useNavigate } from 'react-router-dom';
import RefreshIcon from '@mui/icons-material/Refresh';
import UpdateIcon from '@mui/icons-material/Update';
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { Dids } from '../common/types';
import { useApi } from '../hooks/useApi';
import { HttpStatusCode } from '../hooks/useApi';
import { RequireConnect } from '../components/RequireConnect';
import { Message } from '../components/Message';
import { EllipsisListButton } from '../components/EllipsisListButton';

export const StatusIcons = ({ state }: { state: string }) => {
  const icons = {
    ready: null,
    requested: <UpdateIcon sx={{ ml: 1 }} />,
    progress: <UpdateIcon sx={{ ml: 1 }} />,
    failed: <ErrorIcon sx={{ ml: 1 }} />,
    completed: <CheckCircleOutlineIcon sx={{ ml: 1 }} />,
  };
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
          <IconButton onClick={reload} disabled={loading}>
            <RefreshIcon />
          </IconButton>
        </Box>
      </Box>
      {loading && <CircularProgress size="md" />}
      <Message type="warn" show={address !== undefined && loaded && !data}>
        It seems that account {address} does not own any ORGiDs
      </Message>
      {data && (
        <List>
          {data.map((d, index) => (
            <EllipsisListButton
              key={index}
              disabled={d.state !== 'ready'}
              onClick={() => navigate(`migrate/${d.did}`)}
            >
              {d.did}
              <StatusIcons state={d.state} />
            </EllipsisListButton>
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
