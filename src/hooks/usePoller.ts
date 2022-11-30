import { useEffect } from 'react';

export type PollerContextFunction = () => void | Promise<void>;

export const usePoller = (
  fn: PollerContextFunction,
  enabled = true,
  interval = 5000,
  pollerName?: string,
) => {
  if (typeof fn !== 'function') {
    throw new TypeError("Can't poll without a callback function");
  }

  return useEffect(() => {
    let disabled = false;
    let failures = 0;

    const poll = async () => {
      if (disabled || !enabled) {
        return;
      }

      try {
        await fn();
      } catch (error) {
        failures++;
      }

      if (failures < 100) {
        setTimeout(poll, interval);
      }
    };

    if (enabled) {
      poll();
    }

    return () => {
      disabled = true;
      failures = 0;
    };
  }, [fn, enabled, interval, pollerName]);
};
