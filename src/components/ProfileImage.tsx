import { useState, useEffect, forwardRef } from 'react';
import Uploady, {
  useItemStartListener,
  useItemFinishListener,
  useItemErrorListener,
  useUploadyContext,
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
  FormControl,
  FormLabel,
  CircularProgress,
  Input,
} from '@mui/joy';
import ImageIcon from '@mui/icons-material/Image';
import UploadIcon from '@mui/icons-material/Upload';
import DeleteIcon from '@mui/icons-material/Delete';
import { BE_URI } from '../config';
import { Message } from './Message';

export interface ProfileImageProps {
  url?: string;
  label: string;
  required?: boolean;
  onChange: (url?: string) => void;
  sx?: SxProps;
}

export interface ImageCardProps {
  value?: string;
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
      endDecorator={loading && <CircularProgress size="sm" />}
      disabled={loading}
    >
      Browse
    </Button>
  )),
);

export const ImageCard = ({ value, onChange }: ImageCardProps) => {
  const ctx = useUploadyContext();
  const [loading, setLoading] = useState<boolean>(false);
  const [url, setUrl] = useState<string | undefined>(value);
  const [customUrl, setCustomUrl] = useState<string>(value || '');
  const [error, setError] = useState<string | undefined>();
  useItemStartListener(() => {
    setError(undefined);
    setLoading(true);
  });
  useItemFinishListener(({ uploadResponse }) => {
    if (uploadResponse) {
      setLoading(false);
      setUrl(uploadResponse.data.url);
      setCustomUrl(uploadResponse.data.url);
    }
  });
  useItemErrorListener(({ uploadResponse }) => {
    setLoading(false);
    setError(uploadResponse?.data?.message ?? 'Unknown error');
  });
  useEffect(() => {
    if (value) {
      setUrl(value);
      setCustomUrl(value);
    }
  }, [value]);
  useEffect(() => {
    onChange(url);
    if (url && !url.startsWith('https://w3s.link/ipfs')) {
      ctx.upload(url, {
        destination: {
          url: `${BE_URI}/api/fileUri`,
        },
      });
    }
  }, [url]);
  const onReset = () => {
    setLoading(false);
    setError(undefined);
    setUrl(undefined);
    setCustomUrl('');
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
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <CustomUploadButton extraProps={{ loading }} />
          <IconButton variant="outlined" onClick={onReset} disabled={loading}>
            <DeleteIcon />
          </IconButton>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <FormControl sx={{ mt: 1 }} disabled={loading}>
            <Input
              value={customUrl}
              onChange={({ target }) => {
                setCustomUrl(target.value);
              }}
            />
          </FormControl>
          <IconButton
            variant="outlined"
            disabled={loading || customUrl.trim() === ''}
            onClick={() => {
              setUrl(customUrl);
            }}
          >
            <UploadIcon />
          </IconButton>
        </Box>

        <Message type="error" show={error !== undefined} sx={{ mt: 1, mb: 0 }}>
          {error}
        </Message>
      </CardOverflow>
    </Card>
  );
};

export const ProfileImage = ({
  url,
  label,
  required,
  onChange,
  sx,
}: ProfileImageProps) => {
  return (
    <FormControl sx={sx}>
      <Uploady method="POST" destination={{ url: `${BE_URI}/api/file` }}>
        <FormLabel required={required}>{label}</FormLabel>
        <ImageCard onChange={onChange} value={url} />
      </Uploady>
    </FormControl>
  );
};
