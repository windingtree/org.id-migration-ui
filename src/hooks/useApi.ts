import {
  createContext,
  useContext,
  useCallback,
  useState,
  useMemo,
  useEffect,
} from 'react';
import axios, {
  Method,
  AxiosRequestConfig,
  ParamsSerializerOptions,
  AxiosError,
} from 'axios';
import Qs from 'qs';
import { BE_URI } from '../config';

// @todo Replace this definition when this issue will be fixed https://github.com/axios/axios/issues/5126
export enum HttpStatusCode {
  Continue = 100,
  SwitchingProtocols = 101,
  Processing = 102,
  EarlyHints = 103,
  Ok = 200,
  Created = 201,
  Accepted = 202,
  NonAuthoritativeInformation = 203,
  NoContent = 204,
  ResetContent = 205,
  PartialContent = 206,
  MultiStatus = 207,
  AlreadyReported = 208,
  ImUsed = 226,
  MultipleChoices = 300,
  MovedPermanently = 301,
  Found = 302,
  SeeOther = 303,
  NotModified = 304,
  UseProxy = 305,
  Unused = 306,
  TemporaryRedirect = 307,
  PermanentRedirect = 308,
  BadRequest = 400,
  Unauthorized = 401,
  PaymentRequired = 402,
  Forbidden = 403,
  NotFound = 404,
  MethodNotAllowed = 405,
  NotAcceptable = 406,
  ProxyAuthenticationRequired = 407,
  RequestTimeout = 408,
  Conflict = 409,
  Gone = 410,
  LengthRequired = 411,
  PreconditionFailed = 412,
  PayloadTooLarge = 413,
  UriTooLong = 414,
  UnsupportedMediaType = 415,
  RangeNotSatisfiable = 416,
  ExpectationFailed = 417,
  ImATeapot = 418,
  MisdirectedRequest = 421,
  UnprocessableEntity = 422,
  Locked = 423,
  FailedDependency = 424,
  TooEarly = 425,
  UpgradeRequired = 426,
  PreconditionRequired = 428,
  TooManyRequests = 429,
  RequestHeaderFieldsTooLarge = 431,
  UnavailableForLegalReasons = 451,
  InternalServerError = 500,
  NotImplemented = 501,
  BadGateway = 502,
  ServiceUnavailable = 503,
  GatewayTimeout = 504,
  HttpVersionNotSupported = 505,
  VariantAlsoNegotiates = 506,
  InsufficientStorage = 507,
  LoopDetected = 508,
  NotExtended = 510,
  NetworkAuthenticationRequired = 511,
}

export interface UseApiHook<T = unknown> {
  data?: T;
  loading: boolean;
  loaded: boolean;
  error?: string;
  errorCode?: HttpStatusCode;
  reload: () => Promise<void>;
}

export const paramsSerializer = (params: Record<string, string>): string =>
  Qs.stringify(params, { arrayFormat: 'brackets' });

export const hookContext = createContext<Record<string, unknown>>({});

/**
 const {
  data,
  loading,
  loaded,
  error,
  reload
 } = useApi<Dids>(
  'GET',
  'api/dids/${address}',
  address !== undefined
 );
 */
export const useApi = <T>(
  method: Method,
  url: string,
  acceptance: boolean,
  params?: Record<string, string | undefined>,
  body?: unknown,
  headers?: Record<string, string>,
  withCredentials = false,
): UseApiHook<T> => {
  const ctx = useContext(hookContext);
  const [error, setError] = useState<string | undefined>();
  const [errorCode, setErrorCode] = useState<HttpStatusCode | undefined>();
  const [loading, setLoading] = useState<boolean>(false);
  const [loaded, setLoaded] = useState<boolean>(false);
  const key = useMemo(() => `${method}:${url}`, [method, url]);
  const data = useMemo(() => ctx[key] as T | undefined, [ctx[key]]);

  const load = useCallback(
    async (noContext = false) => {
      if (!acceptance) {
        return;
      }
      if (data && !noContext) {
        setLoading(false);
        setLoaded(true);
        return;
      }
      try {
        const request: AxiosRequestConfig = {
          method,
          url: `${BE_URI}/${url}`,
          params,
          paramsSerializer: {
            serialize: paramsSerializer,
          },
          data: body,
          headers,
          withCredentials,
        };
        setError(undefined);
        setErrorCode(undefined);
        setLoading(true);
        setLoaded(false);
        const { data } = await axios<T>(request);
        ctx[key] = data;
        setLoading(false);
        setLoaded(true);
      } catch (error) {
        setError((error as AxiosError).message || `Unknown ${key} API call error`);
        setErrorCode(
          (error as AxiosError).response?.status ?? HttpStatusCode.InternalServerError,
        );
        setLoading(false);
        setLoaded(true);
      }
    },
    [acceptance, method, url],
  );

  const reload = useCallback(() => load(true), [load]);

  useEffect(() => {
    if (!acceptance) {
      delete ctx[key];
    } else {
      load();
    }
  }, [key, acceptance]);

  return { data, loading, loaded, error, errorCode, reload };
};
