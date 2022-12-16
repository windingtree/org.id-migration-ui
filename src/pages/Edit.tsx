import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useNetwork, useSigner, useProvider } from 'wagmi';
import { Box, Button, Modal, ModalClose, ModalDialog, Typography } from '@mui/joy';
import ReplayIcon from '@mui/icons-material/Replay';
import { ORGJSON } from '@windingtree/org.json-schema/types/org.json';
import { parseDid } from '@windingtree/org.id-utils/dist/parsers';
import { OrgIdContract } from '@windingtree/org.id-core';
import { createVC, SignedVC } from '@windingtree/org.id-auth/dist/vc';
import { createVerificationMethodWithBlockchainAccountId } from '@windingtree/org.json-utils';
import { useForm, FormProvider } from 'react-hook-form';
import { Wallet } from 'ethers';
import { RequireConnect } from '../components/RequireConnect';
import { useProfile } from '../hooks/useProfile';
import { Message } from '../components/Message';
import { ProfileForm } from '../components/ProfileForm';
import {
  buildNftMetadata,
  getNameFromProfile,
  legalEntityConfig,
  ProfileFormValues,
  ProfileOption,
  ProfileUnitFormValues,
  unitConfig,
  Profile,
  sanitizeObject,
} from '../utils/orgJson';
import { centerEllipsis } from '../utils/strings';
import { ProfileImage } from '../components/ProfileImage';
import { ExternalLink } from '../components/ExternalLink';
import { BE_URI, getChain } from '../config';
import { useApi } from '../hooks/useApi';
import { UploadedFile } from '../common/types';

export interface UpdateOrgIdConfirmationProps {
  rawOrgJson?: ORGJSON;
  onClose: (status?: string) => void;
}

export const UpdateOrgIdConfirmation = ({
  rawOrgJson,
  onClose,
}: UpdateOrgIdConfirmationProps) => {
  const { data: signer } = useSigner();
  const provider = useProvider();
  const [signing, setSigning] = useState<boolean>(false);
  const [vc, setVc] = useState<SignedVC | undefined>();
  const [localError, setLocalError] = useState<string | undefined>();
  const [hash, setHash] = useState<string | undefined>();
  const [hashLink, setHashLink] = useState<string | undefined>();
  const [txLoading, setTxLoading] = useState<boolean>(false);
  const {
    data: uploadedVc,
    loading,
    error,
    reset,
  } = useApi<UploadedFile>(
    BE_URI,
    'POST',
    'api/orgIdVc',
    vc !== undefined,
    undefined,
    vc,
  );

  const resetState = (withError?: string) => {
    setSigning(false);
    setVc(undefined);
    setLocalError(undefined);
    setHash(undefined);
    setHashLink(undefined);
    reset();
    onClose(withError);
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

  const signOrgIdVc = useCallback(async () => {
    if (!rawOrgJson) {
      return;
    }
    setLocalError(undefined);
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
      setLocalError(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (err as any).reason || (err as Error).message || 'Unknown ORGiD VC build error',
      );
      setSigning(false);
    }
  }, [rawOrgJson, signer]);

  const update = useCallback(async () => {
    setHash(undefined);
    setTxLoading(false);
    setLocalError(undefined);
    if (uploadedVc && vc && signer) {
      try {
        setTxLoading(true);
        const { network, orgId } = parseDid(vc.credentialSubject.id as unknown as string);
        const chain = getChain(network);
        const contract = new OrgIdContract(chain.orgIdAddress, provider);
        await contract.setOrgJson(
          orgId,
          uploadedVc.url,
          signer,
          undefined,
          async (txHash) => {
            setHash(txHash);
            setHashLink(`${chain.blockExplorers?.default.url}/tx/${txHash}`);
          },
        );
        setTxLoading(false);
        resetState();
      } catch (err) {
        setLocalError(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (err as any).reason || (err as Error).message || 'Unknown ORGiD update error',
        );
        setTxLoading(false);
        setVc(undefined);
        reset();
      }
    }
  }, [vc, uploadedVc, signer, provider]);

  useEffect(() => {
    if (uploadedVc) {
      update();
    }
  }, [uploadedVc]);

  const isLoading = useMemo(
    () => signing || loading || txLoading,
    [signing, loading, txLoading],
  );

  if (!rawOrgJson || !signer) {
    return null;
  }

  return (
    <Modal open={rawOrgJson !== undefined} onClose={() => resetState('Cancelled')}>
      <ModalDialog
        sx={{
          minWidth: 300,
          borderRadius: 'md',
          p: 3,
        }}
      >
        <ModalClose variant="outlined" disabled={isLoading} />

        <Typography sx={{ mb: 2 }}>
          Please confirm the profile update of {getNameFromProfile(rawOrgJson)}
        </Typography>

        <Typography sx={{ mb: 2 }}>
          Please make sure to scroll down inside your wallet to activate the{' '}
          <strong>Sign</strong> button
        </Typography>

        <Message type="error" show={localError !== undefined} sx={{ mb: 2 }}>
          {localError}
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
            Update
          </Button>
          <Button
            variant="outlined"
            onClick={() => resetState('Cancelled')}
            disabled={isLoading}
          >
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

export const Edit = () => {
  const logoRef = useRef(null);
  const navigate = useNavigate();
  const { did } = useParams();
  const { address } = useAccount();
  const { chain } = useNetwork();
  const [localError, setLocalError] = useState<string | undefined>();
  const { data, loading, error, reload } = useProfile(did, chain?.id, address);
  const methods = useForm<ProfileFormValues | ProfileUnitFormValues>({ mode: 'onBlur' });
  const { reset, handleSubmit, setValue } = methods;
  const [profileConfig, setProfileConfig] = useState<ProfileOption[] | undefined>();
  const [initialData, setInitialData] = useState<Profile | undefined>();
  const [profileType, setProfileType] = useState<string | undefined>();
  const [rawOrgJson, setRawOrgJson] = useState<ORGJSON | undefined>();

  useEffect(() => {
    if (data) {
      let profile: Profile | undefined;
      let formConfig: ProfileOption[] | undefined;
      let type: string | undefined;
      if (data.organizationalUnit) {
        profile = data.organizationalUnit;
        formConfig = unitConfig;
        type = 'organizationalUnit';
      }
      if (data.legalEntity) {
        profile = data.legalEntity;
        formConfig = legalEntityConfig;
        type = 'legalEntity';
      }
      if (!profile) {
        setLocalError('Unknown type of profile');
        return;
      }
      setProfileConfig(formConfig);
      setInitialData(profile);
      setProfileType(type);
    }
  }, [reset, data]);

  useEffect(() => {
    setTimeout(() => reset(initialData), 1000);
  }, [initialData]);

  const onSubmit = handleSubmit(async (d) => {
    try {
      setLocalError(undefined);
      if (!profileType) {
        setLocalError('Unknown profile type');
        return;
      }
      if (!data) {
        setLocalError('Something went wrong. Original ORGiD profile is missed');
        return;
      }
      if (!address || !chain) {
        setLocalError('Wallet not connected');
        return;
      }
      if (!d?.media?.logo) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (logoRef.current as any).scrollIntoView({ behavior: 'smooth' });
        return;
      }
      const orgJsonInput = sanitizeObject<ORGJSON>({
        ...data,
        [profileType]: d,
        verificationMethod: [
          createVerificationMethodWithBlockchainAccountId(
            `${data.id}#key1`,
            data.id,
            'eip155',
            chain.id,
            address,
            'Default verification method',
          ),
        ],
      });
      setRawOrgJson(orgJsonInput);
    } catch (err) {
      setLocalError(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (err as any).reason ||
          (err as Error).message ||
          'Unknown profile form handler error',
      );
    }
  });

  if (!address) {
    return (
      <RequireConnect legend="To be able to edit your ORGiD you have to connect your wallet" />
    );
  }

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
        <ConnectButton showBalance={false} />
        <Button variant="soft" onClick={reload} loading={loading} disabled={loading}>
          <ReplayIcon />
        </Button>
      </Box>

      <div ref={logoRef} />
      <ProfileImage
        url={initialData?.media?.logo}
        onChange={(uri) => setValue('media.logo', uri)}
        sx={{ mt: 2 }}
      />

      <FormProvider {...methods}>
        <form onSubmit={onSubmit}>
          <ProfileForm config={profileConfig} sx={{ mt: 2 }} />
          <Button type="submit" size="lg" onClick={onSubmit} sx={{ my: 2 }}>
            Submit
          </Button>
        </form>
      </FormProvider>

      <Message type="error" show={error !== undefined} sx={{ mb: 2 }}>
        {error}
      </Message>

      <Message type="error" show={localError !== undefined} sx={{ mb: 2 }}>
        {localError}
      </Message>

      <UpdateOrgIdConfirmation
        rawOrgJson={rawOrgJson}
        onClose={(error) => {
          setRawOrgJson(undefined);
          if (!error) {
            navigate('/my');
          } else {
            setLocalError(error);
          }
        }}
      />
    </>
  );
};
