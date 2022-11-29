import { RegisterOptions } from 'react-hook-form';
import { ORGJSON } from '@windingtree/org.json-schema/types/org.json';
import { createVerificationMethodWithBlockchainAccountId } from '@windingtree/org.json-utils';
import { NFTMetadata } from '@windingtree/org.json-schema/types/nft';
import { DateTime } from 'luxon';
import * as regex from '../utils/regex';

export type ProfileOptionType =
  | 'string'
  | 'number'
  | 'image'
  | 'array'
  | 'group'
  | 'object';

export interface ProfileOption {
  name: string;
  path: string;
  label: string;
  placeholder?: string;
  type: ProfileOptionType;
  required?: boolean;
  group?: ProfileOption[];
  groupLayout?: 'row' | 'column';
  arrayItem?: string;
  validation?: RegisterOptions;
}

export interface Identifier {
  type: string;
  value: string;
}

export interface RegisteredAddress {
  country: string;
  subdivision: string;
  locality: string;
  postalCode: string;
  streetAddress: string;
  premise: string;
}

export interface Contact {
  function: string;
  name: string;
  phone: string;
  email: string;
}

export interface ProfileFormValues {
  legalName: string;
  registryCode: string;
  identifier: Identifier[];
  legalType: string;
  registeredAddress: RegisteredAddress;
  contacts: Contact[];
  logo: string;
}

export interface ProfileUnitFormValues {
  name: string;
  description: string;
  type: string[];
  address: RegisteredAddress;
  contacts: Contact[];
  logo: string;
}

export const addressGroupConfig: ProfileOption[] = [
  {
    name: 'country',
    path: 'country',
    label: 'Country code',
    placeholder: 'IT',
    type: 'string',
    required: true,
    validation: {
      required: 'Country name is required',
      pattern: regex.country,
    },
  },
  {
    name: 'subdivision',
    path: 'subdivision',
    label: 'Subdivision',
    placeholder: '71',
    type: 'string',
    required: true,
    validation: {
      required: 'Subdivision is required',
    },
  },
  {
    name: 'locality',
    path: 'locality',
    label: 'Locality',
    placeholder: 'Ferrara',
    type: 'string',
    required: true,
    validation: {
      required: 'Locality is required',
    },
  },
  {
    name: 'postalCode',
    path: 'postalCode',
    label: 'Postal code',
    placeholder: '44121',
    type: 'string',
    required: true,
    validation: {
      required: 'Postal code is required',
    },
  },
  {
    name: 'streetAddress',
    path: 'streetAddress',
    label: 'Street address',
    placeholder: 'via Porta s. Pietro 16',
    type: 'string',
    required: true,
    validation: {
      required: 'Street address is required',
    },
  },
  {
    name: 'premise',
    path: 'premise',
    label: 'Premise',
    placeholder: 'interno 10',
    type: 'string',
  },
];

export const contactGroupConfig: ProfileOption[] = [
  {
    name: 'function',
    path: 'function',
    label: 'Function',
    placeholder: 'Customer service',
    type: 'string',
    required: true,
    validation: {
      required: 'Contact function is required',
    },
  },
  {
    name: 'name',
    path: 'name',
    label: 'Name',
    placeholder: 'John Smith',
    type: 'string',
    required: true,
    validation: {
      required: 'Contact name is required',
    },
  },
  {
    name: 'phone',
    path: 'phone',
    label: 'Phone',
    placeholder: '+1234567890',
    type: 'string',
    validation: {
      pattern: regex.phone,
    },
  },
  {
    name: 'email',
    path: 'email',
    label: 'Email',
    placeholder: 'email@spam.com',
    type: 'string',
    required: true,
    validation: {
      required: 'Contact email number is required',
      pattern: regex.email,
    },
  },
];

export const legalEntityConfig: ProfileOption[] = [
  {
    name: 'legalName',
    path: 'legalEntity.legalName',
    label: 'Legal name',
    placeholder: 'Acme Corp.',
    type: 'string',
    required: true,
    validation: {
      required: 'Legal name is required',
      minLength: 2,
      maxLength: 100,
    },
  },
  {
    name: 'legalType',
    path: 'legalEntity.legalType',
    label: 'Legal type',
    placeholder: 'GmBH',
    type: 'string',
    required: true,
    validation: {
      required: 'Legal type is required',
      minLength: 2,
      maxLength: 100,
    },
  },
  {
    name: 'registryCode',
    path: 'legalEntity.registryCode',
    label: 'Registry code',
    placeholder: 'US12345567',
    type: 'string',
    required: true,
    validation: {
      required: 'Registry code is required',
      minLength: 2,
      maxLength: 100,
    },
  },
  {
    name: 'identifier',
    path: 'legalEntity.identifiers',
    label: 'Identifiers',
    type: 'group',
    groupLayout: 'row',
    group: [
      {
        name: 'type',
        path: 'type',
        label: 'Type',
        placeholder: 'IATA',
        type: 'string',
        required: true,
        validation: {
          required: 'Identifier type is required',
          minLength: 2,
          maxLength: 100,
        },
      },
      {
        name: 'value',
        path: 'value',
        label: 'Identifier',
        placeholder: '987654321',
        type: 'string',
        required: true,
        validation: {
          required: 'Identifier value is required',
          minLength: 2,
          maxLength: 100,
        },
      },
    ],
  },
  {
    name: 'registeredAddress',
    path: 'legalEntity.registeredAddress',
    label: 'Registered address',
    type: 'object',
    groupLayout: 'column',
    group: addressGroupConfig,
  },
  {
    name: 'contacts',
    path: 'legalEntity.contacts',
    label: 'Contacts',
    type: 'group',
    groupLayout: 'column',
    group: contactGroupConfig,
  },
  {
    name: 'logo',
    path: 'legalEntity.media.logo',
    label: 'Logotype',
    placeholder: 'https://imagehosting.test/hotel.jpg',
    type: 'image',
    required: true,
  },
];

export const unitConfig: ProfileOption[] = [
  {
    name: 'name',
    path: 'organizationalUnit.name',
    label: 'Name',
    placeholder: 'Grand Budapest Hotel',
    type: 'string',
    required: true,
    validation: {
      required: 'Unit name is required',
      minLength: 2,
      maxLength: 100,
    },
  },
  {
    name: 'description',
    path: 'organizationalUnit.description',
    label: 'Description',
    placeholder: 'Short description of the unit',
    type: 'string',
    required: true,
    validation: {
      required: 'Unit description is required',
      minLength: 5,
      maxLength: 200,
    },
  },
  {
    name: 'type',
    path: 'organizationalUnit.type',
    label: 'Unit type',
    type: 'array',
    arrayItem: 'string',
    placeholder: 'hotel',
    required: true,
    validation: {
      required: 'Unit type is required',
      minLength: 2,
      maxLength: 100,
    },
  },
  {
    name: 'address',
    path: 'organizationalUnit.address',
    label: 'Address',
    type: 'object',
    groupLayout: 'column',
    group: addressGroupConfig,
  },
  {
    name: 'contacts',
    path: 'legalEntity.contacts',
    label: 'Contacts',
    type: 'group',
    groupLayout: 'column',
    group: contactGroupConfig,
  },
  {
    name: 'logo',
    path: 'legalEntity.media.logo',
    label: 'Logotype',
    placeholder: 'https://imagehosting.test/hotel.jpg',
    type: 'image',
    required: true,
    validation: {
      required: 'Logotype is required',
      pattern: regex.uriHttp,
    },
  },
];

export const defaultAddress = {
  country: '',
  subdivision: '',
  locality: '',
  postalCode: '',
  streetAddress: '',
  premise: '',
};

export const defaultContact = {
  function: '',
  name: '',
  phone: '',
  email: '',
};

export const defaultLegalEntityProfile = () =>
  Object.assign(
    {},
    {
      legalName: '',
      legalType: '',
      registryCode: '',
      identifier: [
        {
          type: '',
          value: '',
        },
      ],
      registeredAddress: defaultAddress,
      contacts: [defaultContact],
      logo: '',
    },
  ) as unknown as ProfileFormValues;

export const defaultUnitProfile = () =>
  Object.assign(
    {},
    {
      name: '',
      description: '',
      type: [''],
      address: defaultAddress,
      contacts: [defaultContact],
      logo: '',
    },
  ) as unknown as ProfileUnitFormValues;

export const getDefaultProfile = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  orgJson?: Record<string, any>,
): ProfileFormValues | ProfileUnitFormValues | undefined => {
  if (!orgJson) {
    return undefined;
  }

  const isUnit = !!orgJson.organizationalUnit;
  let template: ProfileFormValues | ProfileUnitFormValues;

  if (isUnit) {
    template = defaultUnitProfile();
    template.name = orgJson?.organizationalUnit?.name || '';
    template.description = orgJson?.organizationalUnit?.description || '';
    template.type = orgJson?.organizationalUnit?.type || '';
    template.address = {
      country: orgJson?.organizationalUnit?.address?.country || '',
      subdivision: orgJson?.organizationalUnit?.address?.subdivision || '',
      locality: orgJson?.organizationalUnit?.address?.locality || '',
      postalCode: orgJson?.organizationalUnit?.address?.postalCode || '',
      streetAddress: orgJson?.organizationalUnit?.address?.streetAddress || '',
      premise: orgJson?.organizationalUnit?.address?.premise || '',
    };
    for (let i = 0; i < orgJson?.organizationalUnit?.contacts ?? 1; i++) {
      template.contacts.push({
        function: orgJson?.organizationalUnit?.contacts[i].function || '',
        name: orgJson?.organizationalUnit?.contacts[i].name || '',
        phone: orgJson?.organizationalUnit?.contacts[i].phone || '',
        email: orgJson?.organizationalUnit?.contacts[i].email || '',
      });
    }
    template.logo = orgJson?.organizationalUnit?.media?.logo || '';
  } else {
    template = defaultLegalEntityProfile();
    template.legalName = orgJson?.legalEntity?.legalName || '';
    template.legalType = orgJson?.legalEntity?.legalType || '';
    template.registryCode = orgJson?.legalEntity?.registryCode || '';
    for (let i = 0; i < orgJson?.legalEntity?.contacts ?? 1; i++) {
      template.identifier.push({
        type: orgJson?.legalEntity?.identifier[i].type || '',
        value: orgJson?.legalEntity?.identifier[i].value || '',
      });
    }
    template.registeredAddress = {
      country: orgJson?.legalEntity?.registeredAddress?.country || '',
      subdivision: orgJson?.legalEntity?.registeredAddress?.subdivision || '',
      locality: orgJson?.legalEntity?.registeredAddress?.locality || '',
      postalCode: orgJson?.legalEntity?.registeredAddress?.postalCode || '',
      streetAddress: orgJson?.legalEntity?.registeredAddress?.streetAddress || '',
      premise: orgJson?.legalEntity?.registeredAddress?.premise || '',
    };
    for (let i = 0; i < orgJson?.legalEntity?.contacts ?? 1; i++) {
      template.contacts.push({
        function: orgJson?.legalEntity?.contacts[0].function || '',
        name: orgJson?.legalEntity?.contacts[0].name || '',
        phone: orgJson?.legalEntity?.contacts[0].phone || '',
        email: orgJson?.legalEntity?.contacts[0].email || '',
      });
    }
    template.logo = orgJson?.legalEntity?.media?.logo || '';
  }

  return template;
};

// Build NFT metadata that will be merged with a VC
export const buildNftMetadata = (orgJson: ORGJSON): NFTMetadata => {
  const isLegalEntity = !!orgJson.legalEntity;

  let nftName: string;
  let nftAlterName: string;
  let nftImage: string;

  if (isLegalEntity) {
    nftName = orgJson?.legalEntity?.legalName as string;
    nftAlterName = orgJson?.legalEntity?.alternativeName as string;
    nftImage = orgJson?.legalEntity?.media?.logo as string;
  } else {
    nftName = orgJson?.organizationalUnit?.name as string;
    nftAlterName = orgJson?.organizationalUnit?.description as string;
    nftImage = orgJson?.organizationalUnit?.media?.logo as string;
  }

  return {
    name: nftAlterName || nftName,
    description: nftName,
    image: nftImage,
  };
};

// Builds ORG.jSON
export const buildOrgJson = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any,
  orgId: string,
  chain: string,
  owner: string,
  parentOrganization?: string,
): ORGJSON => {
  const id = `did:orgid:${chain}:${orgId}`;
  const isUnit = data.name !== undefined;
  return {
    '@context': [
      'https://www.w3.org/ns/did/v1',
      'https://raw.githubusercontent.com/windingtree/org.json-schema/feat/new-orgid/src/context.json',
    ],
    id,
    created: DateTime.now().toISO(),
    [isUnit ? 'organizationalUnit' : 'legalEntity']: {
      ...data,
      ...(isUnit && parentOrganization
        ? {
            parentOrganization,
          }
        : {}),
    },
    verificationMethod: [
      createVerificationMethodWithBlockchainAccountId(
        `${id}#key1`,
        id,
        'eip155',
        chain,
        owner,
        'Default verification method',
      ),
    ],
  };
};
