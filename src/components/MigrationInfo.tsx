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

export interface MigrationInfoProps {
  did?: string;
}

export const MigrationInfo = ({ did }: MigrationInfoProps) => {
  const { data, loading, loaded, error } = useApi<RequestStatus>(
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
