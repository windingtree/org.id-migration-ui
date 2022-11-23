import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { Box, CircularProgress, Typography } from '@mui/joy';
import { useParams } from 'react-router-dom';
import { RequestStatus } from '../common/types';
import { HttpStatusCode, useApi } from '../hooks/useApi';
import { RequireConnect } from '../components/RequireConnect';
import { Message } from '../components/Message';
import { MigrationInfo } from '../components/MigrationInfo';
import { centerEllipsis } from '../utils/strings';

export const Profile = () => {
  const { address } = useAccount();
  const { did } = useParams();
  const { data, loading, loaded, error, errorCode, reload } = useApi<string>(
    'GET',
    'api/did',
    did !== undefined,
    { did },
  );

  if (!address) {
    return <RequireConnect />;
  }

  return (
    <>
      <Box sx={{ mb: 2 }}>
        <ConnectButton />
      </Box>
      <Typography
        level="h2"
        component="h2"
        sx={{
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textAlign: 'left',
          display: 'block',
        }}
      >
        ORGiD:&nbsp;{centerEllipsis(did ?? '', 16)}
      </Typography>
      {loading && <CircularProgress size="md" />}
      <MigrationInfo did={did} />
      <Message type="error" show={error !== undefined}>
        {error}
      </Message>
    </>
  );
};
