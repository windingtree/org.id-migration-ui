import { ListItemButton } from '@mui/joy';
import { styled } from '@mui/joy/styles';

export const EllipsisListButton = styled(ListItemButton)`
  max-width: ${({ theme }) => theme.breakpoints.up('md')}px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  text-align: left;
  display: block;
`;
