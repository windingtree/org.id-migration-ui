import { ReactNode, useEffect } from 'react';
import { useLocation, useRoutes, Navigate } from 'react-router-dom';
import { useAccount } from 'wagmi';

// Pages
import { Migrate } from './pages/Migrate';
import { Resolve } from './pages/Resolve';
import { Create } from './pages/Create';
import { Profile } from './pages/Profile';
import { MyOrgIds } from './pages/MyOrgIds';
import { Edit } from './pages/Edit';

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
  menu?: boolean;
  children?: RouteConfig[];
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
    path: '/resolve',
    element: <Resolve />,
    title: 'Resolve ORGiD',
    label: 'Resolve',
    menu: true,
    children: [
      {
        path: ':did',
        element: <Resolve />,
        title: 'Resolve ORGiD',
        label: 'Resolve',
      },
    ],
  },
  {
    path: '/create',
    element: <Create />,
    title: 'Create ORGiD',
    label: 'Create',
    menu: true,
  },
  {
    path: '/',
    element: <Migrate />,
    title: 'Migrate ORGiD',
    label: 'Migrate',
    menu: true,
  },
  {
    path: '/migrate/:did',
    element: <Profile />,
    title: 'Migrate ORGiD',
    label: 'Migrate',
  },
  {
    path: '/my',
    element: <MyOrgIds />,
    title: 'My ORGiDs',
    label: 'My ORGiDs',
    menu: true,
  },
  {
    path: '/edit/:did',
    element: <Edit />,
    title: 'Edit ORGiD',
    label: 'Edit',
    menu: false,
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
