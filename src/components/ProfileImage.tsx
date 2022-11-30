import { useState, forwardRef, useEffect } from 'react';
import Uploady, {
  useItemStartListener,
  useItemFinishListener,
  useItemErrorListener,
} from '@rpldy/uploady';
import { asUploadButton } from '@rpldy/upload-button';
import { SxProps } from '@mui/joy/styles/types';
import {
  Box,
  Card,
  CardOverflow,
  AspectRatio,
  Button,
  IconButton,
  FormLabel,
  Typography,
} from '@mui/joy';
import ImageIcon from '@mui/icons-material/Image';
import UploadIcon from '@mui/icons-material/Upload';
import CloseIcon from '@mui/icons-material/Close';
import { BE_URI } from '../config';
import { Message } from './Message';

export interface ProfileImageProps {
  label: string;
  required?: boolean;
  onChange: (url?: string) => void;
  sx?: SxProps;
}

export interface ImageCardProps {
  onChange: (url?: string) => void;
}

export const CustomUploadButton = asUploadButton(
  // eslint-disable-next-line react/display-name, @typescript-eslint/no-explicit-any
  forwardRef(({ loading, ...props }: any, ref) => (
    <Button
      variant="soft"
      size="sm"
      {...props}
      ref={ref as never}
      startDecorator={<UploadIcon />}
      loading={loading}
      disabled={loading}
    >
      Upload image
    </Button>
  )),
);

export const ImageCard = ({ onChange }: ImageCardProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [url, setUrl] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();
  useItemStartListener(() => {
    setError(undefined);
    setLoading(true);
  });
  useItemFinishListener(({ uploadResponse }) => {
    if (uploadResponse) {
      setLoading(false);
      setUrl(uploadResponse.data.url);
    }
  });
  useItemErrorListener(({ uploadResponse }) => {
    setLoading(false);
    setError(uploadResponse?.data?.message ?? 'Unknown error');
  });
  useEffect(() => {
    onChange(url);
  }, [url]);
  const onReset = () => {
    setLoading(false);
    setError(undefined);
    setUrl(undefined);
  };
  return (
    <Card variant="outlined" sx={{ maxWidth: 375 }}>
      <CardOverflow>
        {!url && (
          <AspectRatio objectFit="cover">
            <div>
              <ImageIcon sx={{ color: 'text.tertiary', fontSize: '3em' }} />
            </div>
          </AspectRatio>
        )}
        {url && (
          <AspectRatio objectFit="cover">
            <img src={url} />
          </AspectRatio>
        )}
      </CardOverflow>
      <CardOverflow sx={{ p: 2 }}>
        <Box
          sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}
        >
          <CustomUploadButton extraProps={{ loading }} />
          <IconButton variant="outlined" onClick={onReset}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Message type="error" show={error !== undefined} sx={{ mt: 1, mb: 0 }}>
          {error}
        </Message>
      </CardOverflow>
    </Card>
  );
};

export const ProfileImage = ({ label, required, onChange, sx }: ProfileImageProps) => {
  return (
    <Box sx={sx}>
      <Uploady method="POST" destination={{ url: `${BE_URI}/api/file` }}>
        <FormLabel required={required}>{label}</FormLabel>
        <ImageCard onChange={onChange} />
      </Uploady>
    </Box>
  );
};
