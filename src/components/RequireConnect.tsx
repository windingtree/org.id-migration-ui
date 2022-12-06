import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { Box, Card, Stack, Typography } from '@mui/joy';

export const RequireConnect = () => {
  const { address } = useAccount();
  if (address) return null;
  return (
    <Stack direction="column" alignItems="center" maxWidth="100%">
      <Stack width="30rem">
        {/* <AspectRatio sx={{ width: 300, borderRadius: 'md', overflow: 'auto' }}>
                <img src={profileData.logo} />
              </AspectRatio> */}
        <Typography>
          Migrate your ORGiD benefit from last developments and be ready for the
          marketplace launch
        </Typography>
        <Card sx={{ alignItems: 'center', p: 4, mt: 5, mb: 5, border: '1px solid #000' }}>
          <Typography fontSize="2.5em">Migrate your ORGiD</Typography>
          <Box sx={{ mt: 3 }}>
            <ConnectButton chainStatus={'none'} showBalance={false} />
          </Box>
        </Card>
        <>
          <Typography>Discord</Typography>
          <Typography>Read more about Winding Tree protocol</Typography>
        </>
      </Stack>
    </Stack>
  );
};
