import { ReactNode, useState } from 'react';
import { UseFormRegister, UseFormUnregister } from 'react-hook-form';
import Add from '@mui/icons-material/Add';
import Remove from '@mui/icons-material/Remove';
import { useMediaQuery } from '@mui/material';
import {
  Button,
  Sheet,
  Box,
  TextField,
  FormControl,
  Typography,
  Badge,
  Divider,
  useTheme,
} from '@mui/joy';
import {
  ProfileOption,
  ProfileFormValues,
  ProfileUnitFormValues,
} from '../utils/orgJson';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FormErrors = any;

export interface ProfileConfig {
  profileConfig?: ProfileOption[];
  isUnit?: boolean;
}

export interface ProfileFormProps {
  config: ProfileOption[] | undefined;
  register: UseFormRegister<ProfileFormValues | ProfileUnitFormValues>;
  unregister: UseFormUnregister<ProfileFormValues | ProfileUnitFormValues>;
  errors: FormErrors;
}

export const buildStringOption = (
  option: ProfileOption,
  register: UseFormRegister<ProfileFormValues | ProfileUnitFormValues>,
  errors: FormErrors,
  scope?: string,
  scopeIndex?: number,
  keyIndex?: number,
): ReactNode => {
  const fieldName = (
    scope
      ? `${scope}${scopeIndex !== undefined ? '[' + scopeIndex + ']' : ''}.${option.name}`
      : option.name
  ) as any; // eslint-disable-line @typescript-eslint/no-explicit-any
  const error = scope
    ? scopeIndex !== undefined
      ? errors[scope]?.[scopeIndex]?.[option.name]?.message
      : errors[scope]?.[option.name]?.message
    : errors[option.name]?.message;
  return (
    <FormControl key={`str${option.name}${keyIndex}`} sx={{ mb: 1 }}>
      <TextField
        {...register(fieldName, option.validation)}
        label={option.label}
        placeholder={option.placeholder}
        required={option.required}
        helperText={error}
        error={!!error}
      />
    </FormControl>
  );
};

export const buildArrayOption = (
  option: ProfileOption,
  register: UseFormRegister<ProfileFormValues | ProfileUnitFormValues>,
  unregister: UseFormUnregister<ProfileFormValues | ProfileUnitFormValues>,
  errors: FormErrors,
  keyIndex?: number,
): ReactNode => {
  const [arrayItems, setArrayItems] = useState(1);
  return (
    <Sheet
      variant="outlined"
      key={`arr${option.name}${keyIndex}`}
      sx={{ p: 2, mt: 1, mb: 1 }}
    >
      <Badge size="sm" badgeContent={arrayItems > 1 ? arrayItems : 0}>
        <Typography level="h6" sx={{ mb: 1 }}>
          {option.label}
        </Typography>
      </Badge>
      {Array(arrayItems)
        .fill(null)
        .map((_, index) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const fieldName = `${option.name}[${index}]` as any;
          const error = errors[option.name]?.[index]?.message;
          return (
            <FormControl key={`itm${option.name}${index}`} sx={{ mb: 1 }}>
              <TextField
                {...register(fieldName, option.validation)}
                placeholder={option.placeholder}
                required={option.required}
                helperText={error}
                error={!!error}
              />
            </FormControl>
          );
        })}
      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
        <Button
          size="sm"
          variant="soft"
          startDecorator={<Add />}
          sx={{ mt: 1 }}
          onClick={() => setArrayItems(arrayItems + 1)}
        >
          Add more {option.label}
        </Button>
        {arrayItems > 1 && (
          <Button
            size="sm"
            variant="outlined"
            startDecorator={<Remove />}
            sx={{ mt: 1 }}
            onClick={() => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              unregister(`${option.name}[${arrayItems - 1}]` as any);
              setArrayItems(arrayItems - 1);
            }}
          >
            Reduce {option.label}
          </Button>
        )}
      </Box>
    </Sheet>
  );
};

export const buildGroupOption = (
  option: ProfileOption,
  register: UseFormRegister<ProfileFormValues | ProfileUnitFormValues>,
  unregister: UseFormUnregister<ProfileFormValues | ProfileUnitFormValues>,
  errors: FormErrors,
  allowAddGroup = false,
  keyIndex?: number,
): ReactNode => {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down('md'));
  const [groupItems, setGroupItems] = useState(1);
  return (
    <Sheet
      variant="outlined"
      key={`grp${option.name}${keyIndex}`}
      sx={{ p: 2, mt: 1, mb: 1 }}
    >
      <Badge size="sm" badgeContent={groupItems > 1 ? groupItems : 0}>
        <Typography level="h6" sx={{ mb: 1 }}>
          {option.label}
        </Typography>
      </Badge>
      {Array(groupItems)
        .fill(null)
        .map((_, item) => (
          <Box key={`grpItm${item}`}>
            {groupItems > 1 && item > 0 && <Divider sx={{ my: 1 }} />}
            <Box
              sx={{
                display: 'flex',
                flexDirection: !isSm ? option.groupLayout : 'column',
                gap: 1,
                mb: 1,
              }}
            >
              {option.group?.map((o, index) =>
                buildStringOption(
                  o,
                  register,
                  errors,
                  option.name,
                  allowAddGroup ? item : undefined,
                  index,
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
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

export const ProfileForm = ({
  config,
  register,
  unregister,
  errors,
}: ProfileFormProps) => {
  const nodes = config?.map((option) => {
    switch (option.type) {
      case 'string':
        return buildStringOption(option, register, errors);
      case 'object':
        return buildGroupOption(option, register, unregister, errors);
      case 'group':
        return buildGroupOption(option, register, unregister, errors, true);
      case 'array':
        return buildArrayOption(option, register, unregister, errors);
      default:
        return null;
    }
  });
  if (!nodes) {
    return null;
  }
  return <>{nodes}</>;
};