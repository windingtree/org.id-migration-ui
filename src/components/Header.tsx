import { AspectRatio, Stack, Typography } from '@mui/joy';
import { NavigationMenu, PageTitle } from './NavigationMenu';

export const Header = () => {
  return (
    <Stack
      px={6}
      py={4}
      direction="row"
      justifyContent="space-between"
      alignItems="center"
    >
      <Stack direction="row" spacing={1} alignItems="center" justifyContent="flex-start">
        <AspectRatio variant="plain" ratio="1/1" sx={{ width: 80 }}>
          <img src="/winding-tree-icon.svg" />
        </AspectRatio>
        <Stack>
          <Typography fontSize="1.4em" fontWeight={600}>
            ORGiD Tools
          </Typography>
          <Typography fontSize="0.8em" fontWeight={500} color="neutral">
            A project by Winding Tree
          </Typography>
          <PageTitle sx={{ mt: 1 }} />
        </Stack>
      </Stack>
      <NavigationMenu />
    </Stack>
  );
};
