import { BE_URI } from '../config';
import { useApi, HttpStatusCode } from '../hooks/useApi';

export interface UseOldOrgIdHook {
  orgId?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  orgJson?: Record<string, any>;
  loading: boolean;
  loaded: boolean;
  error?: string;
  errorCode?: HttpStatusCode;
  reload: () => Promise<void>;
}

export const useOldOrgId = (did?: string): UseOldOrgIdHook => {
  const { data, loading, loaded, error, errorCode, reload } = useApi<
    Record<string, unknown>
  >(BE_URI, 'GET', 'api/did', did !== undefined, { did });
  return {
    orgId: did,
    orgJson: data,
    loading,
    loaded,
    error,
    errorCode,
    reload,
  };
};
