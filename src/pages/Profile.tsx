/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useCallback, useContext, useRef } from 'react';
import { Wallet } from 'ethers';
import { useAccount, useSigner } from 'wagmi';
import { useMemo, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import {
  Button,
  Typography,
  CircularProgress,
  Box,
  FormControl,
  FormLabel,
  FormHelperText,
  Select,
  Option,
  Modal,
  ModalDialog,
  ModalClose,
} from '@mui/joy';
import { ORGJSON } from '@windingtree/org.json-schema/types/org.json';
import { parseDid } from '@windingtree/org.id-utils/dist/parsers';
import { createVC, SignedVC } from '@windingtree/org.id-auth/dist/vc';
import { useOldOrgId } from '../hooks/useOldOrgId';
import { RequireConnect } from '../components/RequireConnect';
import { Message } from '../components/Message';
import { ProfileImage } from '../components/ProfileImage';
import { ProfileForm } from '../components/ProfileForm';
import {
  ProfileOption,
  legalEntityConfig,
  unitConfig,
  ProfileFormValues,
  ProfileUnitFormValues,
  getDefaultProfile,
  buildOrgJson,
  buildNftMetadata,
} from '../utils/orgJson';
import { useApi } from '../hooks/useApi';
import { RequestStatus } from '../common/types';
import { BE_URI, DEST_CHAINS, getChain } from '../config';

export interface ValidationError {
  message: string;
}

export interface ProfileContext {
  chain: string;
  profile: ProfileFormValues | ProfileUnitFormValues;
}

export interface MigrationConfirmationProps {
  did?: string;
  chain?: string;
  rawOrgJson?: ORGJSON;
  onClose: (status?: RequestStatus) => void;
}

export const profileContext = createContext<Record<string, ProfileContext>>({});

export const MigrationConfirmation = ({
  did,
  chain,
  rawOrgJson,
  onClose,
}: MigrationConfirmationProps) => {
  const orgId = useMemo<string | undefined>(() => {
    const result = parseDid(did || '');
    return result.orgId;
  }, [did]);
  const { data: signer } = useSigner();
  const chainName = useMemo(() => {
    if (chain) {
      const config = getChain(chain);
      return config.name;
    }
  }, [chain]);
  const orgName = useMemo(
    () =>
      rawOrgJson?.organizationalUnit
        ? rawOrgJson.organizationalUnit.name
        : rawOrgJson?.legalEntity
        ? rawOrgJson.legalEntity.legalName
        : '',
    [rawOrgJson],
  );
  const [signing, setSigning] = useState<boolean>(false);
  const [vc, setVc] = useState<SignedVC | undefined>();
  const [vcError, setVcError] = useState<string | undefined>();
  const { data, loading, error, reset } = useApi<RequestStatus>(
    BE_URI,
    'POST',
    'api/request',
    did !== undefined && chain !== undefined && vc !== undefined,
    undefined,
    { did, chain: Number(chain), orgIdVc: JSON.stringify(vc) },
  );

  const resetState = (data?: RequestStatus) => {
    setSigning(false);
    setVc(undefined);
    setVcError(undefined);
    reset();
    onClose(data);
  };

  useEffect(() => {
    if (rawOrgJson) {
      // eslint-disable-next-line no-console
      console.log('rawOrgJson:', rawOrgJson);
    }
  }, [rawOrgJson]);

  useEffect(() => {
    if (vc) {
      // eslint-disable-next-line no-console
      console.log('VC:', vc);
    }
  }, [vc]);

  useEffect(() => {
    if (data) {
      // eslint-disable-next-line no-console
      console.log('Request status:', data);
      resetState(data);
    }
  }, [data]);

  const signOrgIdVc = useCallback(async () => {
    if (!rawOrgJson) {
      return;
    }
    setVcError(undefined);
    setSigning(true);
    try {
      const verificationMethod = `${rawOrgJson.id}#key1`;
      const blockchainAccountId =
        rawOrgJson?.verificationMethod?.[0]?.blockchainAccountId;
      setVc(
        await createVC(verificationMethod, ['OrgJson'])
          .setCredentialSubject(rawOrgJson)
          .setNftMetaData(buildNftMetadata(rawOrgJson))
          .signWithBlockchainAccount(
            blockchainAccountId as unknown as string,
            signer as Wallet,
          ),
      );
      setSigning(false);
    } catch (err) {
      setVcError(
        (err as any).reason || (err as Error).message || 'Unknown ORGiD VC build error',
      );
      setSigning(false);
    }
  }, [rawOrgJson, signer]);

  if (!orgId || !chain || !rawOrgJson || !signer) {
    return null;
  }

  return (
    <Modal open={rawOrgJson !== undefined} onClose={() => resetState()}>
      <ModalDialog
        sx={{
          minWidth: 300,
          borderRadius: 'md',
          p: 3,
        }}
      >
        <ModalClose variant="outlined" disabled={signing || loading} />

        <Typography sx={{ mb: 2 }}>
          Please confirm migration of {orgName} from Mainnet to {chainName}
        </Typography>

        <Typography sx={{ mb: 2 }} fontWeight="bold">
          This process is gasless. You will not have to pay any fee but simply sign your
          digital credential
        </Typography>

        <Typography sx={{ mb: 2 }}>
          Please make sure to scroll down inside your wallet to activate the{' '}
          <strong>Sign</strong> button
        </Typography>

        <Message type="error" show={vcError !== undefined} sx={{ mb: 2 }}>
          {vcError}
        </Message>

        <Message type="error" show={error !== undefined} sx={{ mb: 2 }}>
          {error}
        </Message>

        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
          <Button
            variant="solid"
            onClick={signOrgIdVc}
            disabled={signing || loading}
            loading={signing || loading}
          >
            Migrate
          </Button>
          <Button
            variant="outlined"
            onClick={() => resetState()}
            disabled={signing || loading}
          >
            Close
          </Button>
        </Box>
      </ModalDialog>
    </Modal>
  );
};

export const Profile = () => {
  const chainRef = useRef(null);
  const logoRef = useRef(null);
  const ctx = useContext(profileContext);
  const navigate = useNavigate();
  const { address } = useAccount();
  const { did } = useParams();
  const orgId = useMemo<string | undefined>(() => {
    const result = parseDid(did || '');
    return result.orgId;
  }, [did]);
  const [chain, setChain] = useState<string | undefined>();
  const [name, setName] = useState<string | undefined>();
  const [rawOrgJson, setRawOrgJson] = useState<ORGJSON | undefined>();
  const methods = useForm<ProfileFormValues | ProfileUnitFormValues>({ mode: 'onBlur' });
  const { watch, reset, handleSubmit, setValue } = methods;
  const watchForm = watch();
  const { orgJson, loading, error } = useOldOrgId(did);
  const [defaultState, setDefaultState] = useState<
    ProfileFormValues | ProfileUnitFormValues | undefined
  >();
  const [chainError, setChainError] = useState<string | undefined>();
  const profileConfig = useMemo<ProfileOption[] | undefined>(
    () => (orgJson && orgJson.organizationalUnit ? unitConfig : legalEntityConfig),
    [orgJson],
  );

  useEffect(() => {
    if (did && Object.keys(watchForm).length > 0) {
      ctx[did] = {
        ...ctx[did],
        profile: watchForm,
      };
      const { name, legalName } = watchForm as any;
      setName(name || legalName || '');
    }
  }, [did, watchForm]);

  useEffect(() => {
    if (did && orgJson) {
      setDefaultState(getDefaultProfile(orgJson));
      setName(
        orgJson && orgJson.organizationalUnit
          ? orgJson.organizationalUnit?.name
          : orgJson && orgJson.legalEntity
          ? orgJson.legalEntity?.legalName
          : '',
      );
    }
  }, [did, orgJson]);

  useEffect(() => {
    if (defaultState) {
      reset(defaultState);
    }
  }, [reset, defaultState]);

  const onSubmit = handleSubmit(async (d) => {
    if (!chain) {
      setChainError('Target chain is required');
      (chainRef.current as any).scrollIntoView({ behavior: 'smooth' });
      return;
    }
    if (!d.logo) {
      (logoRef.current as any).scrollIntoView({ behavior: 'smooth' });
      return;
    }
    if (orgJson && orgId && address && chain && d.logo) {
      const { logo, ...props } = d;
      const orgJsonInput = {
        ...props,
        media: {
          logo,
        },
      } as unknown as ORGJSON;
      setRawOrgJson(buildOrgJson(orgJsonInput, orgId, chain, address));
    }
  });

  return (
    <>
      <RequireConnect />

      {loading && <CircularProgress size="md" />}

      <FormControl sx={{ mb: 3 }} ref={chainRef} error={!!chainError}>
        <FormLabel required>Target chain</FormLabel>
        <Select
          placeholder="Please choose a target chain Id"
          onChange={(_e, value) => {
            setChainError(undefined);
            setChain(value as string);
          }}
        >
          {DEST_CHAINS.map((o) => (
            <Option key={o.chainId} value={String(o.chainId)}>
              {o.name}
            </Option>
          ))}
        </Select>
        {!!chainError && <FormHelperText>{chainError}</FormHelperText>}
      </FormControl>

      <div ref={logoRef} />
      <ProfileImage
        url={defaultState?.logo}
        name={name}
        orgId={orgId}
        onChange={(uri) => setValue('logo', uri)}
      />

      <FormProvider {...methods}>
        <form onSubmit={onSubmit}>
          <ProfileForm config={profileConfig} />
          <Button type="submit" size="lg" onClick={onSubmit} sx={{ my: 2 }}>
            Submit
          </Button>
        </form>
      </FormProvider>

      <Message type="error" show={error !== undefined} sx={{ mb: 2 }}>
        {error}
      </Message>

      <MigrationConfirmation
        did={did}
        chain={chain}
        rawOrgJson={rawOrgJson}
        onClose={(data) => {
          setRawOrgJson(undefined);
          if (data) {
            navigate('/');
          }
        }}
      />
    </>
  );
};
