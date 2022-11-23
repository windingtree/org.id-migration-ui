import axios from 'axios';
import { BE_URI } from '../config';
import { Dids } from '../common/types';

export const getOwnOrgIds = async (address: string): Promise<Dids> => {
  try {
    const { data } = await axios.get<Dids>(`${BE_URI}/api/dids/${address}`);
    if (data.length === 0) {
      throw new Error(`Account ${address} does not own any ORGiDs`);
    }
    return data;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    throw new Error(`Unable to get the list of ORGiDs owned by ${address}`);
  }
};
