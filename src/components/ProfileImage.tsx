import { useState, useEffect, forwardRef } from 'react';
import Uploady, {
  useItemStartListener,
  useItemFinishListener,
  useItemErrorListener,
  useUploadyContext,
} from '@rpldy/uploady';
import { asUploadButton } from '@rpldy/upload-button';
import {
  Box,
  Card,
  CardOverflow,
  AspectRatio,
  Button,
  IconButton,
  FormControl,
  CircularProgress,
  Input,
  Typography,
  Modal,
  ModalDialog,
  ModalClose,
} from '@mui/joy';
import ImageIcon from '@mui/icons-material/Image';
import UploadIcon from '@mui/icons-material/Upload';
import DeleteIcon from '@mui/icons-material/Delete';
import { centerEllipsis } from '../utils/strings';
import { BE_URI } from '../config';
import { Message } from './Message';
import { SxProps } from '@mui/joy/styles/types';

export interface ProfileImageProps {
  url?: string;
  name?: string;
  orgId?: string;
  onChange(url?: string): void;
  sx?: SxProps;
}

export interface ImageCardProps {
  value?: string;
  name?: string;
  orgId?: string;
  onChange(url?: string): void;
  sx?: SxProps;
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

export const ImageCard = ({ value, name, orgId, onChange, sx }: ImageCardProps) => {
  const ctx = useUploadyContext();
  const [loading, setLoading] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
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
    <Box sx={sx}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              width: 150,
              borderRadius: '50%',
              overflow: 'hidden',
              border: '1px solid rgba(0,0,0,0.1)',
              boxShadow: '0px 5px 8px -7px rgba(0,0,0,0.5)',
            }}
          >
            {!url && (
              <AspectRatio ratio={1} objectFit="cover">
                <div>
                  <ImageIcon sx={{ color: 'text.tertiary', fontSize: '3em' }} />
                </div>
              </AspectRatio>
            )}
            {url && (
              <AspectRatio ratio={1} objectFit="cover">
                <img src={url} />
              </AspectRatio>
            )}
          </Box>
          <Button size="sm" variant="plain" onClick={() => setEditMode(true)}>
            Change image
          </Button>
        </Box>
        <Box sx={{ ml: 1, mt: -3 }}>
          {name && (
            <Typography level="h2" fontSize={'1.2em'} sx={{ mb: 1 }}>
              {name}
            </Typography>
          )}
          <Typography>{centerEllipsis(orgId ?? '', 6)}</Typography>
        </Box>
      </Box>
      <Message
        type="warn"
        text="Please upload a logotype of your organization"
        show={!url}
        sx={{ mt: 1 }}
      />
      <Modal open={editMode} onClose={() => setEditMode(false)}>
        <ModalDialog
          sx={{
            maxWidth: 500,
            borderRadius: 'md',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 1,
              }}
            >
              <Box>
                <Typography level="h4" fontWeight="bold" fontSize="1em">
                  Change image
                </Typography>
              </Box>
              <Box>
                <ModalClose />
              </Box>
            </Box>
            <Box>
              <Card variant="outlined" sx={{ maxWidth: 350 }}>
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
                      gap: 1,
                      mt: 1,
                    }}
                  >
                    <FormControl disabled={loading}>
                      <Input
                        value={customUrl}
                        onChange={({ target }) => {
                          setCustomUrl(target.value);
                        }}
                      />
                    </FormControl>
                    <Box>
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
                  </Box>

                  <Message type="error" show={error !== undefined} sx={{ mt: 1, mb: 0 }}>
                    {error}
                  </Message>
                </CardOverflow>
              </Card>
            </Box>
          </Box>
        </ModalDialog>
      </Modal>
    </Box>
  );
};

export const ProfileImage = ({ url, name, orgId, onChange, sx }: ProfileImageProps) => {
  return (
    <Uploady method="POST" destination={{ url: `${BE_URI}/api/file` }}>
      <ImageCard onChange={onChange} value={url} name={name} orgId={orgId} sx={sx} />
    </Uploady>
  );
};
