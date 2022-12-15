import { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { OrgIdContract, OrgIdData } from '@windingtree/org.id-core';
import { providers } from 'ethers';
import { getChain } from '../config';

export interface UseMyOrgIdsHook {
  loading: boolean;
  data?: OrgIdData[];
  error?: string;
  reload(): void;
}

export const hookContext = createContext<Record<string, OrgIdData[] | undefined>>({});

export const useMyOrgIds = (address?: string, chainId?: number): UseMyOrgIdsHook => {
  const ctx = useContext(hookContext);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>();

  const reload = useCallback(async () => {
    try {
      setError(undefined);
      if (!address || !chainId) {
        return;
      }
      setLoading(true);
      const selectedChain = getChain(chainId);
      const provider = new providers.JsonRpcProvider(selectedChain.rpc);
      const contract = new OrgIdContract(selectedChain.orgIdAddress, provider);
      const orgIds = await contract.getOwnOrgIds(address);
      ctx[address] = orgIds;
      setLoading(false);
    } catch (err) {
      setError((err as Error).message || 'Unknown useMyOrgIds error');
      setLoading(false);
    }
  }, [address, chainId]);

  useEffect(() => {
    if (address && !ctx[address]) {
      reload();
    }
  }, [address]);

  return {
    loading,
    data: address ? ctx[address] : undefined,
    error,
    reload,
  };
};
