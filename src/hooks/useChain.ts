import { useState, useEffect } from 'react';
import { useNetwork } from 'wagmi';
import { CHAINS } from '../config';

export interface UseChainHook {
  chainId?: number;
  supported: boolean;
}

export const useChain = (): UseChainHook => {
  const { chain } = useNetwork();
  const [supported, setSupported] = useState<boolean>(true);

  useEffect(() => {
    if (chain) {
      try {
        const selected = CHAINS.find((c) => c.id === Number(chain.id));
        setSupported(selected !== undefined);
      } catch {
        setSupported(false);
      }
    } else {
      setSupported(false);
    }
  }, [chain]);

  return {
    chainId: chain?.id,
    supported,
  };
};
