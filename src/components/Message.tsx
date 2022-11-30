import { ReactNode } from 'react';
import { Alert, Typography, AlertProps } from '@mui/joy';
import { SxProps } from '@mui/joy/styles/types';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';
import ErrorIcon from '@mui/icons-material/Error';

export type MessageType = 'info' | 'warn' | 'error';

export interface MessageProps {
  type: MessageType;
  text?: string;
  children?: ReactNode;
  show?: boolean;
  sx?: SxProps;
}

export type MessageConfig = Record<
  MessageType,
  {
    color: AlertProps['color'];
    icon: JSX.Element;
  }
>;

const messageConfig: MessageConfig = {
  info: {
    color: 'info',
    icon: <InfoIcon />,
  },
  warn: {
    color: 'warning',
    icon: <WarningIcon />,
  },
  error: {
    color: 'danger',
    icon: <ErrorIcon />,
  },
};

export const Message = ({ type, text, children, show = true, sx }: MessageProps) => {
  if (!show) {
    return null;
  }
  return (
    <Alert
      color={messageConfig[type].color}
      variant="soft"
      startDecorator={messageConfig[type].icon}
      sx={{ mb: 2, ...sx }}
    >
      <Typography fontSize="sm">{children ?? (text || '')}</Typography>
    </Alert>
  );
};
