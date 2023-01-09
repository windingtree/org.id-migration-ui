import { ORGJSON } from '@windingtree/org.json-schema/types/org.json';
import { Did } from '../common/types';
import { VALIDATOR_URI } from '../config';
import { useApi, HttpStatusCode } from './useApi';

export interface UseOrgIdReportHook {
  orgId?: string;
  report?: ResolutionResponse;
  loading: boolean;
  loaded: boolean;
  error?: string;
  errorCode?: HttpStatusCode;
  reload: () => Promise<void>;
}

export interface Media {
  logo: string;
}

export interface Address {
  country: string;
  locality: string;
  postalCode: string;
  streetAddress: string;
}

export interface DidDocumentData {
  created: string;
  delegates: [];
  orgId: string;
  orgJsonUri: string;
  owner: string;
  tokenId: string;
  deactivated?: boolean;
}

export interface DidDocumentMetadata {
  data: DidDocumentData;
  created: string;
  updated: string;
}

export interface DidResolutionMetadata {
  contentType: string;
  duration: number;
  resolverVersion: string;
  retrieved: string;
  error?: string;
}

export interface ResolutionResponse {
  '@context': string;
  did: Did;
  didDocument: ORGJSON;
  didDocumentMetadata: DidDocumentMetadata;
  didResolutionMetadata: DidResolutionMetadata;
}

// { "resolutionResponse": { "didDocument": { "@context": ["https://www.w3.org/ns/did/v1", "https://raw.githubusercontent.com/windingtree/org.json-schema/feat/new-orgid/src/context.json"], "id": "did:orgid:5:0x14f0f67ee3c5330166cea60f3703d5d05d0d20f3f23921e96bccaab07c4db3be", "created": "2022-11-15T19:36:30.425+05:30", "verificationMethod": [{ "id": "did:orgid:5:0x14f0f67ee3c5330166cea60f3703d5d05d0d20f3f23921e96bccaab07c4db3be#SimKMS", "controller": "did:orgid:5:0x14f0f67ee3c5330166cea60f3703d5d05d0d20f3f23921e96bccaab07c4db3be", "type": "EcdsaSecp256k1RecoveryMethod2020", "blockchainAccountId": "eip155:5:0xBA1d5C06b9B8db409E20e5058a0af854E46fEE1d" }], "legalEntity": { "legalName": "SImKMS co", "registryCode": "1234", "legalType": "Ltd", "registeredAddress": { "country": "US", "locality": "LOs Angeles", "postalCode": "1234", "streetAddress": "123 street" }, "media": { "logo": "https://cdn.shopify.com/s/files/1/0412/8617/2823/products/SMRITILOGO2020-PNG_800x.png" } }, "updated": "2022-11-15T19:39:56.312+05:30" }, "didResolutionMetadata": { "contentType": "application/did+ld+json", "retrieved": "2022-11-25T09:55:32.530+00:00", "duration": 2473, "resolverVersion": "3.1.2" }, "didDocumentMetadata": { "created": "2022-11-15T19:36:30.425+05:30", "updated": "2022-11-15T19:39:56.312+05:30", "data": { "tokenId": "11", "orgId": "0x14f0f67ee3c5330166cea60f3703d5d05d0d20f3f23921e96bccaab07c4db3be", "owner": "0xBA1d5C06b9B8db409E20e5058a0af854E46fEE1d", "orgJsonUri": "ipfs://bafkreigas7kfz4esoydjlkbhscitzwl7j73gt6fh6byfdkhceqt4edtvke", "delegates": [], "created": "2022-11-15T14:12:00.000Z" } } } }
export interface OrgIdReportResponse {
  resolutionResponse: ResolutionResponse;
}

export const useOrgIdReport = (did?: string, force = false): UseOrgIdReportHook => {
  const { data, loading, loaded, error, errorCode, reload } = useApi<OrgIdReportResponse>(
    VALIDATOR_URI,
    'GET',
    'orgid',
    did !== undefined && did !== '',
    {
      orgid: did,
      ...(force ? { force: true } : {}),
    },
  );
  return {
    report: data?.resolutionResponse || undefined,
    loading,
    loaded,
    error,
    errorCode,
    reload,
  };
};
