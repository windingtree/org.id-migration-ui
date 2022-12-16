import { ORGJSON } from '@windingtree/org.json-schema/types/org.json';
import { DidResolutionResponse } from '@windingtree/org.id-resolver';
import { useState, useEffect } from 'react';
import { utils } from 'ethers';
import { useApi } from './useApi';
import { VALIDATOR_URI } from '../config';

export interface UseProfileHook {
  data?: ORGJSON;
  loading: boolean;
  error?: string;
  reload(): void;
}

export const hookCache: Record<string, ORGJSON | undefined> = {};

export const useProfile = (
  did?: string,
  chainId?: number,
  owner?: string,
): UseProfileHook => {
  const [data, setData] = useState<Record<string, ORGJSON | undefined>>({});
  const [error, setError] = useState<string | undefined>();
  const {
    data: report,
    loading,
    error: resolverError,
    reload,
  } = useApi<{
    resolutionResponse: DidResolutionResponse;
  }>(VALIDATOR_URI, 'GET', 'orgid', did !== undefined, { orgid: did, force: 'true' });

  useEffect(() => {
    setError(undefined);
    if (!did || !owner) {
      return;
    }
    if (report) {
      if (report.resolutionResponse.didDocument === null) {
        setData({
          ...data,
          [owner]: undefined,
        });
        setError(`ORGiD resolution error: ${resolverError}`);
        return;
      }
      const profileOwner =
        report.resolutionResponse.didDocumentMetadata?.data?.owner ?? '';
      if (utils.getAddress(profileOwner) !== utils.getAddress(owner)) {
        setData({
          ...data,
          [owner]: undefined,
        });
        setError(`Connected account ${owner} is not an owner of the ORGiD ${did}`);
        return;
      }
      setData({
        ...data,
        [owner]: report.resolutionResponse.didDocument,
      });
    }
  }, [did, chainId, owner, report]);

  return {
    data: owner ? data[owner] : undefined,
    loading,
    error,
    reload,
  };
};
