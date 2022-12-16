import { Link, LinkProps } from '@mui/joy';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

export const ExternalLink = ({ children, ...props }: LinkProps) => (
  <Link {...props} target="_blank" rel="noreferrer" endDecorator={<OpenInNewIcon />}>
    {children}
  </Link>
);
