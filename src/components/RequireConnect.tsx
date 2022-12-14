import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { Box, Card, Link, Stack, Typography } from '@mui/joy';

export interface RequireConnectProps {
  legend?: string;
}

export const RequireConnect = ({ legend = '' }: RequireConnectProps) => {
  const { address } = useAccount();
  if (address) return null;
  return (
    <Stack direction="column" alignItems="center" maxWidth="100%">
      <Stack width="30rem">
        {legend && <Typography>{legend}</Typography>}
        <Card sx={{ alignItems: 'center', p: 4, mt: 5, mb: 5, border: '1px solid #000' }}>
          <Box>
            <ConnectButton chainStatus={'none'} showBalance={false} />
          </Box>
        </Card>
        <>
          <Link
            fontWeight={600}
            href="https://discord.com/channels/898350336069218334/898350336069218340"
            target="_blank"
          >
            Discord
          </Link>
          <Link
            fontWeight={600}
            href="https://developers.windingtree.com"
            target="_blank"
          >
            Read more about Winding Tree protocol
          </Link>
        </>
      </Stack>
    </Stack>
  );
};
