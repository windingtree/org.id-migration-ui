import { Box } from '@mui/joy';
import { SxProps } from '@mui/joy/styles/types';
import { Link } from 'react-router-dom';
import { OrgIdData } from '@windingtree/org.id-core';
import { centerEllipsis } from '../utils/strings';

export interface OrgIdsListProps {
  chainId?: number;
  data?: OrgIdData[];
  sx?: SxProps;
}

export const OrgIdsList = ({ chainId, data, sx }: OrgIdsListProps) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, ...sx }}>
    {data?.map((o, index) => (
      <Box key={index}>
        <Link to={`/resolve/did:orgid:${chainId}:${o.orgId}`}>
          {centerEllipsis(`did:orgid:${chainId}:${o.orgId}`, 16)}
        </Link>
      </Box>
    ))}
  </Box>
);
