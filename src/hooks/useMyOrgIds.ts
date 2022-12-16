import { useState, useEffect, useCallback } from 'react';
import { OrgIdContract, OrgIdData } from '@windingtree/org.id-core';
import { useProvider } from 'wagmi';
import { useGlobalState } from './useGlobalState';
import { getChain } from '../config';

export interface UseMyOrgIdsHook {
  loading: boolean;
  data?: OrgIdData[];
  error?: string;
  reload(): void;
}

export const useMyOrgIds = (address?: string, chainId?: number): UseMyOrgIdsHook => {
  const provider = useProvider();
  const [data, setData] = useGlobalState<Record<string, OrgIdData[]>>('myOrgIds', {});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>();

  const reload = useCallback(async () => {
    try {
      setError(undefined);
      setLoading(false);
      if (!address || !chainId) {
        return;
      }
      setLoading(true);
      const selectedChain = getChain(chainId);
      const contract = new OrgIdContract(selectedChain.orgIdAddress, provider);
      const orgIds = await contract.getOwnOrgIds(address);
      setData({
        ...data,
        [address]: orgIds,
      });
      setLoading(false);
    } catch (err) {
      setError((err as Error).message || 'Unknown useMyOrgIds error');
      setLoading(false);
    }
  }, [address, chainId, provider]);

  useEffect(() => {
    if (address && !data[address]) {
      reload();
    }
  }, [address]);

  return {
    loading,
    data: address ? data[address] : undefined,
    error,
    reload,
  };
};
