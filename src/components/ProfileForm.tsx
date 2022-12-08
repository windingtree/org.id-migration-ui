import { useState, useEffect } from 'react';
import {
  FormControl,
  TextField,
  Sheet,
  Box,
  Badge,
  Typography,
  Switch,
  Button,
  Divider,
} from '@mui/joy';
import { useFormContext } from 'react-hook-form';
import Add from '@mui/icons-material/Add';
import Remove from '@mui/icons-material/Remove';
import { ProfileOption } from '../utils/orgJson';
import { getDeepValue } from '../utils/objects';
export interface ProfileFormProps {
  config?: ProfileOption[];
  scope?: string;
  scopeIndex?: number;
}

export interface FieldProps {
  option: ProfileOption;
  scope?: string;
  scopeIndex?: number;
}

export const Field = ({ option, scope, scopeIndex }: FieldProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const scopePrefix = scope
    ? `${scope}${scopeIndex !== undefined ? '.' + scopeIndex : ''}.`
    : '';
  const fieldName = `${scopePrefix}${option.name}`;
  const error = getDeepValue<string>(errors, `${fieldName}.message`);
  if (!['text', 'number'].includes(option.type)) {
    return null;
  }
  return (
    <FormControl key={`field${option.name}`} sx={{ mb: 1 }}>
      <TextField
        {...register(fieldName, option.validation)}
        type={option.type}
        label={option.label}
        placeholder={option.placeholder}
        required={option.required}
        helperText={error}
        error={!!error}
      />
    </FormControl>
  );
};

export const ArrayField = ({ option, scope, scopeIndex }: FieldProps) => {
  const {
    register,
    unregister,
    getValues,
    setValue,
    formState: { errors },
  } = useFormContext();
  const [enabled, setEnabled] = useState<boolean>(!!option.required);
  const [arrayItems, setArrayItems] = useState(1);
  const scopePrefix = scope
    ? `${scope}${scopeIndex !== undefined ? '.' + scopeIndex : ''}.`
    : '';
  const fieldName = `${scopePrefix}${option.name}`;
  const scopeValue = getValues(fieldName);
  useEffect(() => {
    if (Array.isArray(scopeValue)) {
      if (scopeValue.length > 0) {
        setEnabled(true);
      }
      setArrayItems(scopeValue.length);
    }
  }, [scopeValue]);
  useEffect(() => {
    if (!enabled) {
      const arrayItemsOrig = arrayItems;
      setArrayItems(0);
      setValue(option.name, []);
      Array(arrayItemsOrig)
        .fill(null)
        .forEach((_, index) => {
          unregister(`${fieldName}.${index}`);
        });
    }
  }, [enabled]);
  return (
    <Sheet variant="outlined" key={`array${option.name}`} sx={{ p: 2, mt: 1, mb: 1 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ mb: 1 }}>
          <Badge size="sm" badgeContent={arrayItems > 1 ? arrayItems : 0}>
            <Typography>{option.label}</Typography>
          </Badge>
        </Box>
        {option.required === undefined && (
          <Box>
            <Switch checked={enabled} onChange={() => setEnabled(!enabled)} />
          </Box>
        )}
      </Box>
      {enabled && (
        <>
          {Array(arrayItems)
            .fill(null)
            .map((_, index) => {
              const itemName = `${fieldName}.${index}`;
              const error = getDeepValue<string>(errors, `${itemName}.message`);
              return (
                <FormControl key={`item${itemName}${index}`} sx={{ mb: 1 }}>
                  <TextField
                    type={option.arrayItem}
                    placeholder={option.placeholder}
                    required={option.required}
                    helperText={error}
                    error={!!error}
                    {...register(itemName, option.validation)}
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
                  setValue(fieldName, scopeValue);
                  unregister(`${fieldName}.${arrayItems - 1}`);
                }}
              >
                Reduce {option.label}
              </Button>
            )}
          </Box>
        </>
      )}
    </Sheet>
  );
};

export const ObjectField = ({ option, scope, scopeIndex }: FieldProps) => {
  const { unregister, getValues, setValue } = useFormContext();
  const [enabled, setEnabled] = useState<boolean>(!!option.required);
  const scopePrefix = scope
    ? `${scope}${scopeIndex !== undefined ? '.' + scopeIndex : ''}.`
    : '';
  const fieldName = `${scopePrefix}${option.name}`;
  const scopeValue = getValues(fieldName);
  useEffect(() => {
    if (scopeValue && Object.keys(scopeValue).length > 0) {
      setEnabled(true);
    }
  }, [scopeValue]);
  useEffect(() => {
    const scopeValueOrig = scopeValue;
    if (!enabled && scopeValueOrig) {
      setValue(`${fieldName}`, {});
      Object.keys(scopeValueOrig).forEach((key) => {
        unregister(`${fieldName}.${key}`);
      });
    }
  }, [enabled]);
  return (
    <Sheet variant="outlined" key={`array${fieldName}`} sx={{ p: 2, mt: 1, mb: 1 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ mb: 1 }}>
          <Typography>{option.label}</Typography>
        </Box>
        {option.required === undefined && (
          <Box>
            <Switch checked={enabled} onChange={() => setEnabled(!enabled)} />
          </Box>
        )}
      </Box>
      {enabled && <ProfileForm config={option.group} scope={`${fieldName}`} />}
    </Sheet>
  );
};

export const ArrayObjectField = ({ option, scope, scopeIndex }: FieldProps) => {
  const { unregister, getValues, setValue } = useFormContext();
  const [enabled, setEnabled] = useState<boolean>(!!option.required);
  const scopePrefix = scope
    ? `${scope}${scopeIndex !== undefined ? '.' + scopeIndex : ''}.`
    : '';
  const fieldName = `${scopePrefix}${option.name}`;
  const scopeValue = getValues(fieldName);
  const [groupItems, setGroupItems] = useState(1);
  useEffect(() => {
    if (Array.isArray(scopeValue)) {
      setGroupItems(scopeValue.length);
      if (scopeValue.length > 0 && Object.keys(scopeValue[0]).length > 0) {
        setEnabled(true);
      }
    }
  }, [scopeValue]);
  useEffect(() => {
    const scopeValueOrig = scopeValue;
    if (!enabled && Array.isArray(scopeValueOrig)) {
      setValue(`${fieldName}`, []);
      scopeValueOrig.forEach((level, index) => {
        if (level) {
          Object.keys(level).forEach((key) => {
            unregister(`${fieldName}.${index}.${key}`);
          });
        }
      });
    }
  }, [enabled]);
  return (
    <Sheet variant="outlined" key={`group${fieldName}`} sx={{ p: 2, mt: 1, mb: 1 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ mb: 1 }}>
          <Badge size="sm" badgeContent={groupItems > 1 ? groupItems : 0}>
            <Typography>{option.label}</Typography>
          </Badge>
        </Box>
        {option.required === undefined && (
          <Box>
            <Switch checked={enabled} onChange={() => setEnabled(!enabled)} />
          </Box>
        )}
      </Box>
      {enabled && (
        <>
          {Array(groupItems)
            .fill(null)
            .map((_, index) => (
              <Box key={index}>
                {index > 0 && <Divider sx={{ my: 2 }} />}
                <ProfileForm config={option.group} scope={fieldName} scopeIndex={index} />
              </Box>
            ))}
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
                  const scopeValueOrig = scopeValue[groupItems];
                  const groupItemsOrig = groupItems;
                  setGroupItems(groupItems - 1);
                  scopeValue.pop();
                  setValue(fieldName, scopeValue);
                  if (scopeValueOrig) {
                    Object.keys(scopeValueOrig).forEach((key) => {
                      unregister(`${fieldName}.${groupItemsOrig}.${key}`);
                    });
                  }
                }}
              >
                Reduce {option.label}
              </Button>
            )}
          </Box>
        </>
      )}
    </Sheet>
  );
};

export const ProfileForm = ({ config, scope, scopeIndex }: ProfileFormProps) => (
  <>
    {config?.map((option, index) => {
      switch (option.type) {
        case 'number':
        case 'text':
          return (
            <Field key={index} option={option} scope={scope} scopeIndex={scopeIndex} />
          );
        case 'array':
          return (
            <ArrayField
              key={index}
              option={option}
              scope={scope}
              scopeIndex={scopeIndex}
            />
          );
        case 'object':
          return (
            <ObjectField
              key={index}
              option={option}
              scope={scope}
              scopeIndex={scopeIndex}
            />
          );
        case 'group':
          return (
            <ArrayObjectField
              key={index}
              option={option}
              scope={scope}
              scopeIndex={scopeIndex}
            />
          );
        default:
          return null;
      }
    })}
  </>
);
