import { ReactNode } from 'react';
import { Box } from '@mui/joy';

export interface PageWrapperProps {
  children: ReactNode;
}

export const PageWrapper = ({ children, ...props }: PageWrapperProps) => (
  <Box
    {...props}
    sx={{
      maxWidth: 'md',
      mx: 'auto',
      p: 1,
    }}
  >
    {children}
  </Box>
);
