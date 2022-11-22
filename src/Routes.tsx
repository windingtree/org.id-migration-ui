import { ReactNode, useEffect } from 'react';
import { useLocation, useRoutes, Navigate } from 'react-router-dom';
import { useAccount } from 'wagmi';

// Pages
import { Migrate } from './pages/Migrate';
import { Resolve } from './pages/Resolve';
import { Create } from './pages/Create';

export interface ProtectedProps {
  component: ReactNode;
  path?: string;
}

export type RouteConfig = {
  path: string;
  element: ReactNode;
  title: string;
  label: string;
  protected?: boolean;
};

export type Routes = RouteConfig[];

export const Protected = ({ component, path = '/' }: ProtectedProps) => {
  const location = useLocation();
  const { address } = useAccount();

  return (
    <>{address !== undefined ? component : <Navigate to={path} state={{ location }} />}</>
  );
};

export const pagesRoutes: Routes = [
  {
    path: '/',
    element: <Migrate />,
    title: 'Migrate ORGiD',
    label: 'Migrate',
  },
  {
    path: '/resolve',
    element: <Resolve />,
    title: 'Resolve ORGiD',
    label: 'Resolve',
  },
  {
    path: '/create',
    element: <Create />,
    title: 'Create ORGiD',
    label: 'Create',
  },
];

export const parseRoutes = pagesRoutes.map((route: RouteConfig) =>
  route.protected
    ? {
        ...route,
        element: <Protected component={route.element} />,
      }
    : route,
);

export const pagesTitles = pagesRoutes.reduce<Record<string, string>>(
  (a, { path, title }) => ({
    ...a,
    [path]: title,
  }),
  {},
);

export const Routes = () => {
  const location = useLocation();
  useEffect(() => {
    const title = pagesTitles[location.pathname] ?? 'ORGiD';
    document.title = title;
    return;
  }, [location]);
  return useRoutes(parseRoutes);
};
