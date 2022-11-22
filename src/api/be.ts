import axios from 'axios';
import { BE_URI } from '../config';

export const getOwnOrgIds = async (address: string): Promise<string[]> => {
  try {
    const { data } = await axios.get<string[]>(`${BE_URI}/api/owner/${address}`);
    if (data.length === 0) {
      throw new Error(`Account ${address} doe not own any ORGiDs`);
    }
    return data;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    throw new Error(`Unable to get the list of ORGiDs owned by ${address}`);
  }
};
