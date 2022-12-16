import { RegisterOptions } from 'react-hook-form';
import { ORGJSON } from '@windingtree/org.json-schema/types/org.json';
import { createVerificationMethodWithBlockchainAccountId } from '@windingtree/org.json-utils';
import { NFTMetadata } from '@windingtree/org.json-schema/types/nft';
import { DateTime } from 'luxon';
import * as regex from '../utils/regex';

export type ProfileOptionType =
  | 'text'
  | 'number'
  | 'image'
  | 'array'
  | 'group'
  | 'object';

export interface ProfileOption {
  hidden?: boolean;
  name: string;
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

export interface Messenger {
  type: string;
  value: string;
}

export interface Contact {
  function: string;
  name?: string;
  phone?: string;
  email?: string;
  website?: string;
  messengers?: Messenger[];
}

export interface ProfileFormValues {
  legalName: string;
  registryCode: string;
  identifier: Identifier[];
  legalType: string;
  registeredAddress: RegisteredAddress;
  contacts: Contact[];
  media: {
    logo?: string;
  };
}

export interface ProfileUnitFormValues {
  name: string;
  description: string;
  type: string[];
  address: RegisteredAddress;
  contacts: Contact[];
  media: {
    logo?: string;
  };
}

export interface EntityData {
  logo: string;
  type: string;
  name: string;
  streetAddress: string;
  postalCode: string;
  locality: string;
  country: string;
}

export type Profile = ORGJSON['legalEntity'] | ORGJSON['organizationalUnit'];

export const trimValidatorConfig = {
  onBlur: ({ target }) => {
    target.value = typeof target.value === 'string' ? target.value.trim() : '';
    return true;
  },
  setValueAs: (value: string) => {
    return typeof value === 'string' ? value.trim() : value;
  },
};

export const minLengthValidatorConfig = (value: number) => ({
  minLength: {
    value,
    message: `Field cannot be shorter than ${value} symbols`,
  },
});

export const maxLengthValidatorConfig = (value: number) => ({
  maxLength: {
    value,
    message: `Field name cannot be larger than ${value} symbols`,
  },
});

export const addressGroupConfig: ProfileOption[] = [
  {
    name: 'country',
    label: 'Country code',
    placeholder: 'Two-letter country code, e.q. IT',
    type: 'text',
    required: true,
    validation: {
      required: 'Country name is required',
      ...trimValidatorConfig,
      pattern: {
        value: regex.country,
        message: 'Invalid country code',
      },
    },
  },
  {
    name: 'subdivision',
    label: 'Subdivision',
    placeholder: 'address subdivision, house number',
    type: 'text',
    required: true,
    validation: {
      required: 'Subdivision is required',
      ...trimValidatorConfig,
    },
  },
  {
    name: 'locality',
    label: 'Locality',
    placeholder: 'city',
    type: 'text',
    required: true,
    validation: {
      required: 'Locality is required',
      ...trimValidatorConfig,
    },
  },
  {
    name: 'postalCode',
    label: 'Postal code',
    placeholder: 'postal code',
    type: 'text',
    required: true,
    validation: {
      required: 'Postal code is required',
      ...trimValidatorConfig,
    },
  },
  {
    name: 'streetAddress',
    label: 'Street address',
    placeholder: 'street address',
    type: 'text',
    required: true,
    validation: {
      required: 'Street address is required',
      ...trimValidatorConfig,
    },
  },
  {
    name: 'premise',
    label: 'Premise',
    placeholder: 'flat number, office',
    type: 'text',
  },
];

export const contactGroupConfig: ProfileOption[] = [
  {
    name: 'function',
    label: 'Function',
    placeholder: 'contact function name',
    type: 'text',
    required: true,
    validation: {
      required: 'Contact function is required',
      ...trimValidatorConfig,
    },
  },
  {
    name: 'name',
    label: 'Name',
    placeholder: 'contact name',
    type: 'text',
    required: true,
    validation: {
      required: 'Contact name is required',
      ...trimValidatorConfig,
    },
  },
  {
    name: 'phone',
    label: 'Phone',
    placeholder: 'full phone number',
    type: 'text',
    validation: {
      pattern: {
        value: regex.phone,
        message: 'Invalid phone number',
      },
      ...trimValidatorConfig,
    },
  },
  {
    name: 'email',
    label: 'Email',
    placeholder: 'email address',
    type: 'text',
    validation: {
      pattern: {
        value: regex.email,
        message: 'Invalid email address',
      },
      ...trimValidatorConfig,
    },
  },
  {
    name: 'website',
    label: 'Website',
    placeholder: 'website URI',
    type: 'text',
    validation: {
      pattern: {
        value: regex.uriHttp,
        message: 'Invalid website URI',
      },
      ...trimValidatorConfig,
    },
  },
  {
    name: 'messengers',
    label: 'Messengers',
    type: 'group',
    groupLayout: 'column',
    group: [
      {
        name: 'type',
        label: 'Type',
        placeholder: 'messenger type: facebook, instagram, etc',
        type: 'text',
        required: true,
        validation: {
          required: 'Messenger type is required',
          ...trimValidatorConfig,
        },
      },
      {
        name: 'value',
        label: 'Value',
        placeholder: 'account Id',
        type: 'text',
        required: true,
        validation: {
          required: 'Messenger account value is required',
          ...trimValidatorConfig,
        },
      },
    ],
  },
];

export const legalEntityConfig: ProfileOption[] = [
  {
    name: 'legalName',
    label: 'Legal name',
    placeholder: 'company name',
    type: 'text',
    required: true,
    validation: {
      required: 'Legal name is required',
      ...trimValidatorConfig,
      ...minLengthValidatorConfig(2),
      ...maxLengthValidatorConfig(100),
    },
  },
  {
    name: 'legalType',
    label: 'Legal type',
    placeholder: 'company type',
    type: 'text',
    required: true,
    validation: {
      required: 'Legal type is required',
      ...trimValidatorConfig,
      ...minLengthValidatorConfig(2),
      ...maxLengthValidatorConfig(100),
    },
  },
  {
    name: 'registryCode',
    label: 'Registry code',
    placeholder: 'company registration code',
    type: 'text',
    required: true,
    validation: {
      required: 'Registry code is required',
      ...trimValidatorConfig,
      ...minLengthValidatorConfig(2),
      ...maxLengthValidatorConfig(100),
    },
  },
  {
    name: 'identifier',
    label: 'Identifiers',
    type: 'group',
    groupLayout: 'row',
    group: [
      {
        name: 'type',
        label: 'Type',
        placeholder: 'identifier type, e.q. IATA',
        type: 'text',
        required: true,
        validation: {
          required: 'Identifier type is required',
          ...trimValidatorConfig,
          ...minLengthValidatorConfig(2),
          ...maxLengthValidatorConfig(100),
        },
      },
      {
        name: 'value',
        label: 'Identifier',
        placeholder: 'identifier value',
        type: 'text',
        required: true,
        validation: {
          required: 'Identifier value is required',
          ...trimValidatorConfig,
          ...minLengthValidatorConfig(2),
          ...maxLengthValidatorConfig(100),
        },
      },
    ],
  },
  {
    name: 'registeredAddress',
    label: 'Registered address',
    type: 'object',
    required: true,
    groupLayout: 'column',
    group: addressGroupConfig,
  },
  {
    name: 'contacts',
    label: 'Contacts',
    type: 'group',
    groupLayout: 'column',
    group: contactGroupConfig,
  },
  {
    hidden: true,
    name: 'media',
    label: 'Media',
    type: 'group',
    group: [
      {
        name: 'logo',
        label: 'Logotype',
        placeholder: 'full image URI',
        type: 'image',
        required: true,
        validation: {
          required: 'Logotype is required',
          ...trimValidatorConfig,
          pattern: {
            value: regex.uriHttp,
            message: 'Invalid logotype URI',
          },
        },
      },
    ],
  },
];

export const unitConfig: ProfileOption[] = [
  {
    name: 'name',
    label: 'Name',
    placeholder: 'unit name',
    type: 'text',
    required: true,
    validation: {
      required: 'Unit name is required',
      ...trimValidatorConfig,
      ...minLengthValidatorConfig(2),
      ...maxLengthValidatorConfig(100),
    },
  },
  {
    name: 'description',
    label: 'Description',
    placeholder: 'short unit description',
    type: 'text',
    required: true,
    validation: {
      required: 'Unit description is required',
      ...trimValidatorConfig,
      ...minLengthValidatorConfig(5),
      ...maxLengthValidatorConfig(200),
    },
  },
  {
    name: 'type',
    label: 'Unit type',
    type: 'array',
    arrayItem: 'text',
    placeholder: 'unit type e.q. hotel, ota, etc',
    validation: {
      required: 'Unit type is required',
      ...trimValidatorConfig,
      ...minLengthValidatorConfig(2),
      ...maxLengthValidatorConfig(100),
    },
  },
  {
    name: 'address',
    label: 'Address',
    type: 'object',
    groupLayout: 'column',
    group: addressGroupConfig,
  },
  {
    name: 'contacts',
    label: 'Contacts',
    type: 'group',
    groupLayout: 'column',
    group: contactGroupConfig,
  },
  {
    hidden: true,
    name: 'media',
    label: 'Media',
    type: 'group',
    group: [
      {
        name: 'logo',
        label: 'Logotype',
        placeholder: 'full image URI',
        type: 'image',
        required: true,
        validation: {
          required: 'Logotype is required',
          ...trimValidatorConfig,
          pattern: {
            value: regex.uriHttp,
            message: 'Invalid logotype URI',
          },
        },
      },
    ],
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
  website: '',
  messengers: [
    {
      type: '',
      value: '',
    },
  ],
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
      media: {
        logo: '',
      },
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
      media: {
        logo: '',
      },
    },
  ) as unknown as ProfileUnitFormValues;

export const normalizeUri = (uri?: string): string => {
  if (uri && uri !== '') {
    return uri.startsWith('https://') ? uri : `https://${uri.replace('http://', '')}`;
  }
  return '';
};

export const getNameFromProfile = (orgJson?: ORGJSON): string =>
  orgJson
    ? orgJson.organizationalUnit
      ? orgJson.organizationalUnit.name
      : orgJson.legalEntity
      ? orgJson.legalEntity.legalName
      : ''
    : '';

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
    for (let i = 0; i < orgJson?.organizationalUnit?.contacts.length ?? 1; i++) {
      template.contacts[i] = {
        function: orgJson?.organizationalUnit?.contacts[i].function || '',
        name: orgJson?.organizationalUnit?.contacts[i].name || '',
        phone: orgJson?.organizationalUnit?.contacts[i].phone || '',
        email: orgJson?.organizationalUnit?.contacts[i].email || '',
        website: normalizeUri(orgJson?.organizationalUnit?.contacts[i]?.website || ''),
        messengers: [],
      };
      const messengers = {
        facebook: orgJson?.organizationalUnit?.contacts[i]?.facebook,
        instagram: orgJson?.organizationalUnit?.contacts[i]?.instagram,
        twitter: orgJson?.organizationalUnit?.contacts[i]?.twitter,
      };
      for (const messenger of Object.keys(messengers)) {
        if (messenger && messengers[messenger]) {
          template.contacts[i].messengers?.push({
            type: messenger,
            value: messengers[messenger],
          });
        }
      }
    }
    template.media.logo = orgJson?.organizationalUnit?.media?.logo || '';
  } else {
    template = defaultLegalEntityProfile();
    template.legalName = orgJson?.legalEntity?.legalName || '';
    template.legalType = orgJson?.legalEntity?.legalType || '';
    template.registryCode = orgJson?.legalEntity?.legalIdentifier || '';
    template.registeredAddress = {
      country: orgJson?.legalEntity?.registeredAddress?.country || '',
      subdivision: orgJson?.legalEntity?.registeredAddress?.subdivision || '',
      locality: orgJson?.legalEntity?.registeredAddress?.locality || '',
      postalCode: orgJson?.legalEntity?.registeredAddress?.postalCode || '',
      streetAddress: orgJson?.legalEntity?.registeredAddress?.streetAddress || '',
      premise: orgJson?.legalEntity?.registeredAddress?.premise || '',
    };
    for (let i = 0; i < orgJson?.legalEntity?.contacts.length ?? 1; i++) {
      template.contacts[i] = {
        function: orgJson?.legalEntity?.contacts[i]?.function || '',
        name: orgJson?.legalEntity?.contacts[i]?.name || '',
        phone: orgJson?.legalEntity?.contacts[i]?.phone || '',
        email: orgJson?.legalEntity?.contacts[i]?.email || '',
        website: normalizeUri(orgJson?.legalEntity?.contacts[i]?.website || ''),
        messengers: [],
      };
      const messengers = {
        facebook: orgJson?.legalEntity?.contacts[i]?.facebook,
        instagram: orgJson?.legalEntity?.contacts[i]?.instagram,
        twitter: orgJson?.legalEntity?.contacts[i]?.twitter,
      };
      for (const messenger of Object.keys(messengers)) {
        if (messenger && messengers[messenger]) {
          template.contacts[i].messengers?.push({
            type: messenger,
            value: messengers[messenger],
          });
        }
      }
    }
    template.media.logo = orgJson?.legalEntity?.media?.logo || '';
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

export const getEntityData = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  orgJson?: Record<string, any>,
): EntityData | undefined => {
  const data: EntityData = {
    logo: '',
    type: '',
    name: '',
    streetAddress: '',
    postalCode: '',
    locality: '',
    country: '',
  };

  if (!orgJson) {
    return undefined;
  }
  const isUnit = !!orgJson.organizationalUnit;
  if (isUnit) {
    data.logo = orgJson?.organizationalUnit?.media?.logo || '';
    data.type = orgJson?.organizationalUnit?.type || '';
    data.name = orgJson?.organizationalUnit?.name || '';
    data.country = orgJson?.organizationalUnit?.address?.country || '';
    data.locality = orgJson?.organizationalUnit?.address?.locality || '';
    data.postalCode = orgJson?.organizationalUnit?.address?.postalCode || '';
    data.streetAddress = orgJson?.organizationalUnit?.address?.streetAddress || '';
  } else {
    data.logo = orgJson?.legalEntity?.media?.logo || '';
    data.name = orgJson?.legalEntity?.legalName || '';
    data.type = orgJson?.legalEntity?.legalType || '';
    data.country = orgJson?.legalEntity?.registeredAddress?.country || '';
    data.locality = orgJson?.legalEntity?.registeredAddress?.locality || '';
    data.postalCode = orgJson?.legalEntity?.registeredAddress?.postalCode || '';
    data.streetAddress = orgJson?.legalEntity?.registeredAddress?.streetAddress || '';
  }
  return data;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const sanitizeObject = <T = any>(profile: any): T => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sanitizeProp = (prop: any) => {
    if (typeof prop === 'string') {
      return prop !== '' ? prop : undefined;
    }
    if (typeof prop === 'boolean') {
      return prop;
    }
    if (Array.isArray(prop)) {
      return prop.map((item) => sanitizeProp(item));
    }
    if (typeof prop === 'object') {
      return Object.entries(prop).reduce(
        (a, v) => ({
          ...a,
          ...((p) => {
            const val = sanitizeProp(p[1]);
            return val ? { [p[0]]: val } : {};
          })(v),
        }),
        {},
      );
    }
    return prop;
  };
  return sanitizeProp(profile) as T;
};
