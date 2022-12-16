import { Box } from '@mui/joy';
import { Grid } from '@mui/material';
import { SxProps } from '@mui/joy/styles/types';
import { Link } from 'react-router-dom';
import { OrgIdData } from '@windingtree/org.id-core';
import EditIcon from '@mui/icons-material/Edit';
import { centerEllipsis } from '../utils/strings';

export interface OrgIdsListProps {
  chainId?: number;
  data?: OrgIdData[];
  sx?: SxProps;
}

export const OrgIdsList = ({ chainId, data, sx }: OrgIdsListProps) => {
  if (!data) {
    return null;
  }
  return (
    <Box sx={sx}>
      {data.map((o, index) => (
        <Grid key={index} container columns={16} spacing={1} sx={{ mb: 1 }}>
          <Grid item xs={14} sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
            <Link to={`/resolve/did:orgid:${chainId}:${o.orgId}`} title="Resolve">
              {centerEllipsis(`did:orgid:${chainId}:${o.orgId}`, 16)}
            </Link>
          </Grid>
          <Grid item xs={2}>
            <Link to={`/edit/did:orgid:${chainId}:${o.orgId}`} title="Edit">
              <EditIcon color="action" />
            </Link>
          </Grid>
        </Grid>
      ))}
    </Box>
  );
};
