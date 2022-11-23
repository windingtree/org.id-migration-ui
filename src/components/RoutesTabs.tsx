import { Link, useLocation, useMatch } from 'react-router-dom';
import { Tabs, TabList, Tab } from '@mui/joy';
import { pagesRoutes } from '../Routes';

export const RoutesTabs = () => {
  const { pathname } = useLocation();
  const match = useMatch('/migrate/:did');
  return (
    <Tabs
      aria-label="What do you want to do?"
      defaultValue={'/'}
      value={match ? '/' : pathname}
      sx={{ p: 1, borderRadius: 'lg' }}
    >
      <TabList>
        {pagesRoutes
          .filter(({ menu }) => menu)
          .map(({ label, path }, index) => (
            <Tab key={index} value={path} to={path} component={Link}>
              {label}
            </Tab>
          ))}
      </TabList>
    </Tabs>
  );
};
