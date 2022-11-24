export type ProfileOptionType = 'string' | 'number' | 'image' | 'group' | 'object';

export interface ProfileOption {
  name: string;
  path: string;
  label: string;
  placeholder?: string;
  type: ProfileOptionType;
  required?: boolean;
  group?: ProfileOption[];
  groupLayout?: 'row' | 'column';
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

export interface ProfileForm {
  legalName: string;
  registryCode: string;
  identifier: Identifier[];
  legalType: string;
  registeredAddress: RegisteredAddress[];
  contacts: Contact[];
  logo: string;
}

export const profileConfig: ProfileOption[] = [
  {
    name: 'legalName',
    path: 'legalEntity.legalName',
    label: 'Legal name',
    placeholder: 'Acme Corp.',
    type: 'string',
    required: true,
  },
  {
    name: 'legalType',
    path: 'legalEntity.legalType',
    label: 'Legal type',
    placeholder: 'GmBH',
    type: 'string',
    required: true,
  },
  {
    name: 'registryCode',
    path: 'legalEntity.registryCode',
    label: 'Registry code',
    placeholder: 'US12345567',
    type: 'string',
    required: true,
  },
  {
    name: 'identifier',
    path: 'legalEntity.identifiers[]',
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
      },
      {
        name: 'value',
        path: 'value',
        label: 'Identifier',
        placeholder: '987654321',
        type: 'string',
        required: true,
      },
    ],
  },
  {
    name: 'registeredAddress',
    path: 'legalEntity.registeredAddress',
    label: 'Registered address',
    type: 'object',
    groupLayout: 'column',
    group: [
      {
        name: 'country',
        path: 'country',
        label: 'Country code',
        placeholder: 'IT',
        type: 'string',
        required: true,
      },
      {
        name: 'subdivision',
        path: 'subdivision',
        label: 'Subdivision',
        placeholder: '71',
        type: 'string',
        required: true,
      },
      {
        name: 'locality',
        path: 'locality',
        label: 'Locality',
        placeholder: 'Ferrara',
        type: 'string',
        required: true,
      },
      {
        name: 'postalCode',
        path: 'postalCode',
        label: 'Postal code',
        placeholder: '44121',
        type: 'string',
        required: true,
      },
      {
        name: 'streetAddress',
        path: 'streetAddress',
        label: 'Street address',
        placeholder: 'via Porta s. Pietro 16',
        type: 'string',
        required: true,
      },
      {
        name: 'premise',
        path: 'premise',
        label: 'Premise',
        placeholder: 'interno 10',
        type: 'string',
      },
    ],
  },
  {
    name: 'contacts',
    path: 'legalEntity.contacts[]',
    label: 'Contacts',
    type: 'group',
    groupLayout: 'column',
    group: [
      {
        name: 'function',
        path: 'function',
        label: 'Function',
        placeholder: 'Customer service',
        type: 'string',
        required: true,
      },
      {
        name: 'name',
        path: 'name',
        label: 'Name',
        placeholder: 'John Smith',
        type: 'string',
        required: true,
      },
      {
        name: 'phone',
        path: 'phone',
        label: 'Phone',
        placeholder: '+1234567890',
        type: 'string',
      },
      {
        name: 'email',
        path: 'email',
        label: 'Email',
        placeholder: 'email@spam.com',
        type: 'string',
        required: true,
      },
    ],
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
