import { useMemo } from 'react';
import { Link, useLocation, useMatch } from 'react-router-dom';
import { Tabs, TabList, Tab } from '@mui/joy';
import { pagesRoutes } from '../Routes';

export const RoutesTabs = () => {
  const { pathname } = useLocation();
  const matchMigrate = useMatch('/migrate/:did');
  const matchResolve = useMatch('/resolve/:did');
  const rootPath = useMemo(() => {
    if (matchMigrate) {
      return '/';
    }
    if (matchResolve) {
      return '/resolve';
    }
    return pathname;
  }, [pathname]);
  return (
    <Tabs
      aria-label="What do you want to do?"
      defaultValue={'/'}
      value={rootPath}
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
