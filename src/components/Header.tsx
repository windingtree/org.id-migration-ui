import { AspectRatio, Stack, Typography } from '@mui/joy';
import { NavigationMenu } from './NavigationMenu';

export const Header = () => {
  return (
    <Stack
      px={6}
      py={4}
      direction="row"
      justifyContent="space-between"
      alignItems="center"
    >
      <Stack direction="row" spacing={1} justifyContent="flex-start">
        <AspectRatio variant="plain" ratio="1/1" sx={{ width: 80 }}>
          <img src="/winding-tree-icon.svg" />
        </AspectRatio>
        <Stack>
          <Typography fontSize="2em" fontWeight={600}>
            ORGiD Migration Tool
          </Typography>
          <Typography fontWeight={500} color="neutral">
            A project by Winding Tree
          </Typography>
        </Stack>
      </Stack>
      <NavigationMenu />
    </Stack>
  );
};
