import { useCallback, useEffect, useState, createContext, useContext } from 'react';
import { useAccount } from 'wagmi';
import { getOwnOrgIds } from '../api/be';

export interface UseOwnOrgIdsHook {
  data: string[] | undefined;
  loading: boolean;
  loaded: boolean;
  error: string | undefined;
}

export interface OwnOrgIdsContext {
  address?: string;
  data?: string[];
}

export const ownOrgIdsContext = createContext<OwnOrgIdsContext>({});

export const useOwnOrgIds = (): UseOwnOrgIdsHook => {
  const { address } = useAccount();
  const ctx = useContext(ownOrgIdsContext);
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState<boolean>(false);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [data, setData] = useState<string[] | undefined>();

  const getOrgIds = useCallback(
    async (address: string) => {
      try {
        if (ctx.address && ctx.address === address && ctx.data) {
          setData(ctx.data);
          setLoading(false);
          setLoaded(true);
          return;
        }
        setError(undefined);
        setLoading(true);
        setLoaded(false);
        const data = await getOwnOrgIds(address);
        ctx.address = address;
        ctx.data = data;
        setData(data);
        setLoading(false);
        setLoaded(true);
      } catch (error) {
        setError((error as Error).message || 'Unknown useOrgIds error');
        setError(undefined);
        setData(undefined);
        setLoading(false);
        setLoaded(true);
      }
    },
    [ctx],
  );

  useEffect(() => {
    if (!address) {
      setData(undefined);
      return;
    }
    getOrgIds(address);
  }, [address]);

  return { data, loading, loaded, error };
};
