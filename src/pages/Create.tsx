/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useRef } from 'react';
import { Wallet } from 'ethers';
import { OrgIdContract } from '@windingtree/org.id-core';
import { useAccount, useSigner, useProvider, useNetwork, useSwitchNetwork } from 'wagmi';
import { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import {
  Button,
  Typography,
  Box,
  FormControl,
  FormLabel,
  FormHelperText,
  Select,
  Option,
  Modal,
  ModalDialog,
  ModalClose,
  Radio,
} from '@mui/joy';
import { ORGJSON } from '@windingtree/org.json-schema/types/org.json';
import { createVC, SignedVC } from '@windingtree/org.id-auth/dist/vc';
import { common } from '@windingtree/org.id-utils';
import { parseDid } from '@windingtree/org.id-utils/dist/parsers';
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
  buildOrgJson,
  buildNftMetadata,
} from '../utils/orgJson';
import { useApi } from '../hooks/useApi';
import { BE_URI, CHAINS, getChain } from '../config';
import { centerEllipsis } from '../utils/strings';
import { ExternalLink } from '../components/ExternalLink';

export interface ValidationError {
  message: string;
}
export interface OrgIdVcResponse {
  url: string;
}

export interface ProfileContext {
  chain: string;
  profile: ProfileFormValues | ProfileUnitFormValues;
}

export interface MigrationConfirmationProps {
  contract: OrgIdContract | undefined;
  chain?: number;
  salt: string | undefined;
  rawOrgJson?: ORGJSON;
  onClose: (status?: OrgIdVcResponse) => void;
}

export const CreationConfirmation = ({
  salt,
  contract,
  chain,
  rawOrgJson,
  onClose,
}: MigrationConfirmationProps) => {
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
  const [hash, setHash] = useState<string | undefined>();
  const [hashLink, setHashLink] = useState<string | undefined>();
  const [txLoading, setTxLoading] = useState<boolean>(false);
  const { data, loading, error, reset } = useApi<OrgIdVcResponse>(
    BE_URI,
    'POST',
    'api/orgIdVc',
    chain !== undefined && vc !== undefined,
    undefined,
    vc,
  );

  const isLoading = useMemo(
    () => signing || loading || txLoading,
    [signing, loading, txLoading],
  );

  const resetState = (data?: OrgIdVcResponse) => {
    setSigning(false);
    setVc(undefined);
    setVcError(undefined);
    setHash(undefined);
    setHashLink(undefined);
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
      create();
      // eslint-disable-next-line no-console
      console.log('data:', data);
    }
  }, [data]);

  const create = useCallback(async () => {
    setHash(undefined);
    if (salt && data && vc && contract && signer) {
      setTxLoading(false);
      const { network } = parseDid(vc.credentialSubject.id as unknown as string);
      const chain = getChain(network);
      try {
        await contract.createOrgId(salt, data.url, signer, undefined, async (txHash) => {
          setHash(txHash);
          setHashLink(`${chain.blockExplorers?.default.url}/tx/${txHash}`);
        });
        setTxLoading(false);
        resetState(data);
      } catch (e) {
        setTxLoading(false);
        setVc(undefined);
      }
    }
  }, [vc, data, salt, contract, signer]);

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

  if (!chain || !rawOrgJson || !signer) {
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
        <ModalClose variant="outlined" disabled={isLoading} />

        <Typography sx={{ mb: 2 }}>
          Please confirm creating of {orgName} on {chainName}
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
            disabled={isLoading}
            loading={isLoading}
          >
            Create
          </Button>
          <Button variant="outlined" onClick={() => resetState()} disabled={isLoading}>
            Close
          </Button>
        </Box>

        <Message type="info" show={hash !== undefined} sx={{ mt: 2 }}>
          <ExternalLink href={hashLink}>{centerEllipsis(hash || '', 12)}</ExternalLink>
        </Message>
      </ModalDialog>
    </Modal>
  );
};

export const Create = () => {
  const chainRef = useRef(null);
  const logoRef = useRef(null);
  const navigate = useNavigate();
  const { address } = useAccount();
  const provider = useProvider();
  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();
  const [name, setName] = useState<string | undefined>();
  const [salt, setSalt] = useState<string | undefined>();
  const [entity, setEntity] = useState<boolean>(false);
  const [rawOrgJson, setRawOrgJson] = useState<ORGJSON | undefined>();
  const methods = useForm<ProfileFormValues | ProfileUnitFormValues>({ mode: 'onBlur' });
  const { watch, handleSubmit, setValue } = methods;
  const watchForm = watch();
  const contract = useMemo(() => {
    if (address && provider && chain) {
      const contractAddress = getChain(chain.id).orgIdAddress;
      return new OrgIdContract(contractAddress, provider);
    }
    return undefined;
  }, [address, provider]);

  const [chainError, setChainError] = useState<string | undefined>();
  const profileConfig = useMemo<ProfileOption[] | undefined>(
    () => (entity ? unitConfig : legalEntityConfig),
    [entity],
  );

  useEffect(() => {
    if (Object.keys(watchForm).length > 0) {
      const { name, legalName } = watchForm as any;
      setName(name || legalName || '');
    }
  }, [watchForm]);

  const onSubmit = handleSubmit(async (d) => {
    if (!chain) {
      setChainError('Target chain is required');
      (chainRef.current as any).scrollIntoView({ behavior: 'smooth' });
      return;
    }
    if (!d.media.logo) {
      (logoRef.current as any).scrollIntoView({ behavior: 'smooth' });
      return;
    }
    if (address && chain && d.media.logo) {
      const { media, ...props } = d;
      const newSalt = common.generateSalt();
      const orgIdHash = common.generateOrgIdWithAddress(address, newSalt);
      setSalt(newSalt);
      const orgJsonInput = {
        ...props,
        media: {
          logo: media.logo,
        },
      } as unknown as ORGJSON;
      setRawOrgJson(buildOrgJson(orgJsonInput, orgIdHash, String(chain.id), address));
    }
  });

  return (
    <>
      <RequireConnect />

      <FormControl sx={{ mb: 3 }} ref={chainRef} error={!!chainError}>
        <FormLabel required>Target chain</FormLabel>
        <Select
          placeholder="Please choose a target chain Id"
          onChange={(_e, value) => {
            setChainError(undefined);
            switchNetwork && switchNetwork(value as number);
          }}
        >
          {CHAINS.map((o) => (
            <Option key={o.id} value={o.id}>
              {o.name} {!o.mainnet && '(Test Network)'}
            </Option>
          ))}
        </Select>
        {!!chainError && <FormHelperText>{chainError}</FormHelperText>}
      </FormControl>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Radio checked={!entity} label="Legal Entity" onChange={() => setEntity(false)} />
        <Radio
          checked={entity}
          onChange={() => setEntity(true)}
          name="radio-buttons"
          label="Organizational Unit"
        />
      </Box>
      <div ref={logoRef} />
      <ProfileImage name={name} onChange={(uri) => setValue('media', { logo: uri })} />

      <FormProvider {...methods}>
        <form onSubmit={onSubmit}>
          <ProfileForm config={profileConfig} />
          <Button type="submit" size="lg" onClick={onSubmit} sx={{ my: 2 }}>
            Submit
          </Button>
        </form>
      </FormProvider>

      <CreationConfirmation
        salt={salt}
        contract={contract}
        chain={chain?.id}
        rawOrgJson={rawOrgJson}
        onClose={(data) => {
          const did = rawOrgJson?.id;
          setRawOrgJson(undefined);
          if (data) {
            navigate(`/resolve/${did}`);
          }
        }}
      />
    </>
  );
};
