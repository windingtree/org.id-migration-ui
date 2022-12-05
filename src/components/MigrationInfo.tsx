import { useApi } from '../hooks/useApi';
import { RequestStatus } from '../common/types';
import {
  Card,
  Typography,
  List,
  ListItem,
  ListDivider,
  CircularProgress,
} from '@mui/joy';
import { BE_URI } from '../config';

export interface MigrationInfoProps {
  did?: string;
}

export const MigrationInfo = ({ did }: MigrationInfoProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data, loading, loaded, error } = useApi<RequestStatus>(
    BE_URI,
    'GET',
    'api/request/did',
    did !== undefined,
    { did },
  );

  if (!did) {
    return null;
  }

  return (
    <Card>
      {loading && <CircularProgress size="md" />}
      {data && (
        <List>
          <ListItem>Id: {data.id}</ListItem>
          <ListDivider />
          <ListItem>State: {data.state}</ListItem>
          <ListDivider />
        </List>
      )}
      {!data && <Typography>This ORGiD is ready for migration</Typography>}
    </Card>
  );
};
