import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { ReactNode, useState } from 'react';
import { useForm, UseFormRegister, UseFormUnregister } from 'react-hook-form';
import {
  Button,
  Sheet,
  Box,
  TextField,
  FormControl,
  Typography,
  Badge,
  Divider,
  CircularProgress,
} from '@mui/joy';
import Add from '@mui/icons-material/Add';
import Remove from '@mui/icons-material/Remove';
import { useParams } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import { RequireConnect } from '../components/RequireConnect';
import { Message } from '../components/Message';
import { MigrationInfo } from '../components/MigrationInfo';
import { centerEllipsis } from '../utils/strings';
import { ProfileOption, profileConfig, ProfileForm } from '../utils/orgJson';
import { simpleUid } from '../utils/uid';

export const buildStringOption = (
  option: ProfileOption,
  register: UseFormRegister<ProfileForm>,
  scope?: string,
  scopeIndex?: number,
): ReactNode => (
  <FormControl key={simpleUid()}>
    <TextField
      {...register(
        (scope
          ? `${scope}${scopeIndex !== undefined ? '[' + scopeIndex + ']' : ''}.${
              option.name
            }`
          : option.name) as any,
      )}
      label={option.label}
      placeholder={option.placeholder}
      required={option.required}
    />
  </FormControl>
);

export const buildGroupOption = (
  option: ProfileOption,
  register: UseFormRegister<ProfileForm>,
  unregister: UseFormUnregister<ProfileForm>,
  allowAddGroup = false,
): ReactNode => {
  const [groupItems, setGroupItems] = useState(1);
  return (
    <Sheet variant="outlined" key={simpleUid()} sx={{ p: 2, mt: 1, mb: 1 }}>
      <Badge size="sm" badgeContent={groupItems > 1 ? groupItems : 0}>
        <Typography level="h6" sx={{ mb: 1 }}>
          {option.label}
        </Typography>
      </Badge>
      {Array(groupItems)
        .fill(null)
        .map((_, item) => (
          <Box key={simpleUid()}>
            {groupItems > 1 && item > 0 && <Divider sx={{ my: 1 }} />}
            <Box
              sx={{ display: 'flex', flexDirection: option.groupLayout, gap: 1, mb: 1 }}
            >
              {option.group?.map((o) =>
                buildStringOption(
                  o,
                  register,
                  option.name,
                  allowAddGroup ? item : undefined,
                ),
              )}
            </Box>
          </Box>
        ))}

      {allowAddGroup && (
        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
          <Button
            size="sm"
            variant="soft"
            startDecorator={<Add />}
            sx={{ mt: 1 }}
            onClick={() => setGroupItems(groupItems + 1)}
          >
            Add more {option.label}
          </Button>
          {groupItems > 1 && (
            <Button
              size="sm"
              variant="outlined"
              startDecorator={<Remove />}
              sx={{ mt: 1 }}
              onClick={() => {
                option.group?.forEach((o) => {
                  unregister(`${option.name}[${groupItems - 1}].${o.name}` as any);
                });
                setGroupItems(groupItems - 1);
              }}
            >
              Reduce {option.label}
            </Button>
          )}
        </Box>
      )}
    </Sheet>
  );
};

export const buildForm = (
  config: ProfileOption[],
  register: UseFormRegister<ProfileForm>,
  unregister: UseFormUnregister<ProfileForm>,
): ReactNode =>
  config.map((option) => {
    switch (option.type) {
      case 'string':
        return buildStringOption(option, register);
      case 'object':
        return buildGroupOption(option, register, unregister);
      case 'group':
        return buildGroupOption(option, register, unregister, true);
      default:
        return null;
    }
  });

export const Profile = () => {
  const { address } = useAccount();
  const { did } = useParams();
  const { data, loading, loaded, error, errorCode, reload } = useApi<string>(
    'GET',
    'api/did',
    did !== undefined,
    { did },
  );
  const {
    register,
    unregister,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileForm>();
  const onSubmit = handleSubmit(console.log);

  if (!address) {
    return <RequireConnect />;
  }

  return (
    <>
      <Box sx={{ mb: 2 }}>
        <ConnectButton />
      </Box>
      <Typography
        level="h2"
        component="h2"
        sx={{
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textAlign: 'left',
          display: 'block',
        }}
      >
        ORGiD:&nbsp;{centerEllipsis(did ?? '', 16)}
      </Typography>
      {loading && <CircularProgress size="md" />}
      <MigrationInfo did={did} />
      <form onSubmit={onSubmit}>
        {buildForm(profileConfig, register, unregister)}
        <Button onClick={onSubmit}>Submit</Button>
      </form>
      <Message type="error" show={error !== undefined}>
        {error}
      </Message>
    </>
  );
};
