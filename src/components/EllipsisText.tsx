import { styled } from '@mui/joy/styles';
import { Typography } from '@mui/material';

export const EllipsisText = styled(Typography)`
  max-width: ${({ theme }) => theme.breakpoints.up('md')}px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  text-align: left;
  display: block;
`;
