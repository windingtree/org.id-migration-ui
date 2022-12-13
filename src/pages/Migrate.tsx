import { useMemo } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { Button, Box, AspectRatio, Stack } from '@mui/joy';
import { useNavigate } from 'react-router-dom';
import { Grid, Typography } from '@mui/material';
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
import { EllipsisText } from '../components/EllipsisText';
import { BE_URI, POLLER_TIMEOUT } from '../config';
import { DataTable } from '../components/DataTable';
import { centerEllipsis } from '../utils/strings';

const icons = {
  ready: <></>,
  requested: <UpdateIcon color="info" />,
  progress: <UpdateIcon color="action" />,
  failed: <ErrorIcon color="error" />,
  completed: <CheckCircleOutlineIcon color="success" />,
};

export const StatusIcon = ({ state }: { state: string }) => {
  if (!state) {
    return null;
  }
  return (
    <Box sx={{ mt: 3 }} title={state}>
      {icons[state]}
    </Box>
  );
};

const tableHeaders = ['ORGiD Details', 'Status', 'Action Needed'];

export const Migrate = () => {
  const navigate = useNavigate();
  const { address } = useAccount();
  const { data, loading, loaded, error, errorCode, reload } = useApi<Dids>(
    BE_URI,
    'GET',
    `api/dids/${address}`,
    address !== undefined,
  );
  usePoller(reload, address !== undefined, POLLER_TIMEOUT, 'Check DIDs');

  const tableData = useMemo(() => {
    if (!data) return [];
    return data.map((d) => ({
      orgId: (
        <Grid container>
          <Grid item xs={12} sm={3} md={2}>
            <AspectRatio
              ratio="1/1"
              sx={{ width: 80, borderRadius: '50%', overflow: 'auto' }}
            >
              <img src={d.logo} />
            </AspectRatio>
          </Grid>
          <Grid item xs={12} sm={9} md={10} pl={1} pt={2}>
            <Stack maxWidth="100%">
              <Typography fontWeight={600} variant="body1">
                {d.name}
              </Typography>
              <EllipsisText variant="body2">{centerEllipsis(d.did, 12)}</EllipsisText>
            </Stack>
          </Grid>
        </Grid>
      ),
      status: <StatusIcon state={d.state} />,
      action: (
        <Button
          sx={{ mt: 2, maxWidth: '100%' }}
          color={d.state === 'completed' ? 'info' : 'primary'}
          disabled={!['ready', 'completed'].includes(d.state)}
          onClick={() =>
            navigate(d.state === 'completed' ? `resolve/${d.newDid}` : `migrate/${d.did}`)
          }
        >
          {d.state === 'completed' ? 'Resolve' : 'Migrate'}
        </Button>
      ),
    }));
  }, [data, StatusIcon]);

  if (!address) {
    return <RequireConnect />;
  }

  return (
    <>
      <Box sx={{ mb: 2, display: 'flex', flexDirection: 'row', gap: 2 }}>
        <Box>
          <ConnectButton chainStatus={'none'} showBalance={false} />
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
      {data && <DataTable headers={tableHeaders} data={tableData} />}
      <Message
        type="error"
        show={error !== undefined && errorCode !== HttpStatusCode.NotFound}
      >
        {error}
      </Message>
    </>
  );
};
