import { useMemo, useState } from 'react';
import { Link, useLocation, useMatch } from 'react-router-dom';
import IconButton from '@mui/joy/IconButton';
import Menu from '@mui/joy/Menu';
import MenuItem from '@mui/joy/MenuItem';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import MenuIcon from '@mui/icons-material/Menu';
import { pagesRoutes } from '../Routes';

export const NavigationMenu = () => {
  const { pathname } = useLocation();
  const matchMigrate = useMatch('/migrate/:did');
  const matchResolve = useMatch('/resolve/:did');
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const rootPath = useMemo(() => {
    if (matchMigrate) {
      return '/';
    }
    if (matchResolve) {
      return '/resolve';
    }
    return pathname;
  }, [pathname]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton variant="outlined" onClick={handleClick}>
        <MenuIcon />
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose} placement="bottom-end">
        {pagesRoutes
          .filter(({ menu }) => menu)
          .map(({ label, path }, index) => (
            <MenuItem
              key={index}
              to={path}
              component={Link}
              {...(rootPath === path && { selected: true, variant: 'soft' })}
              onClick={handleClose}
            >
              <ListItemDecorator>{label}</ListItemDecorator>
            </MenuItem>
          ))}
      </Menu>
    </div>
  );
};
