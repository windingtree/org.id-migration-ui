import { ReactNode, useEffect, useMemo, useState } from 'react';
import { UseFormRegister, UseFormUnregister, useFormContext } from 'react-hook-form';
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
import { ProfileOption } from '../utils/orgJson';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FormErrors = any;

export interface ProfileConfig {
  profileConfig?: ProfileOption[];
  isUnit?: boolean;
}

export interface ProfileFormProps {
  config: ProfileOption[] | undefined;
}

export const buildStringOption = (
  option: ProfileOption,
  scope?: string,
  scopeIndex?: number,
  keyIndex?: number,
): ReactNode => {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const fieldName = (
    scope
      ? `${scope}${scopeIndex !== undefined ? '.' + scopeIndex : ''}.${option.name}`
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

export const buildArrayOption = (option: ProfileOption, keyIndex?: number): ReactNode => {
  const {
    register,
    unregister,
    getValues,
    setValue,
    formState: { errors },
  } = useFormContext();
  const [arrayItems, setArrayItems] = useState(1);
  const scopeValue = getValues(option.name);
  useEffect(() => {
    if (Array.isArray(scopeValue)) {
      setArrayItems(scopeValue.length);
    }
  }, [scopeValue]);
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
          const fieldName = `${option.name}.${index}`;
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
              setArrayItems(arrayItems - 1);
              scopeValue.pop();
              setValue(option.name, scopeValue);
              unregister(`${option.name}.${arrayItems - 1}`);
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
  allowAddGroup = false,
  scope?: string,
  scopeIndex?: number,
  keyIndex?: number,
): ReactNode => {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down('md'));
  const {
    unregister,
    getValues,
    setValue,
    formState: { errors },
  } = useFormContext();
  const [groupItems, setGroupItems] = useState(1);
  const scopeName = scope
    ? `${scope}${scopeIndex !== undefined ? '.' + scopeIndex : ''}.${option.name}`
    : option.name;
  const scopeValue = getValues(scopeName);
  useEffect(() => {
    if (Array.isArray(scopeValue)) {
      setGroupItems(scopeValue.length);
    }
  }, [scopeValue]);
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
              {option.group?.map((o, index) => {
                if (o.group) {
                  return buildGroupOption(o, true, scopeName, item, index);
                }
                return buildStringOption(
                  o,
                  scopeName,
                  allowAddGroup ? item : undefined,
                  index,
                );
              })}
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
                setGroupItems(groupItems - 1);
                scopeValue.pop();
                setValue(scopeName, scopeValue);
                option.group?.forEach((o) => {
                  unregister(`${scopeName}${groupItems - 1}.${o.name}`);
                });
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

export const ProfileForm = ({ config }: ProfileFormProps) => {
  const nodes = config?.map((option) => {
    switch (option.type) {
      case 'string':
        return buildStringOption(option);
      case 'object':
        return buildGroupOption(option);
      case 'group':
        return buildGroupOption(option, true);
      case 'array':
        return buildArrayOption(option);
      default:
        return null;
    }
  });
  if (!nodes) {
    return null;
  }
  return <>{nodes}</>;
};
