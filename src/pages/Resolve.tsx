import { useParams } from 'react-router-dom';
import { Typography } from '@mui/material';

export const Resolve = () => {
  const { did } = useParams();

  return (
    <>
      <Typography>{did}</Typography>
    </>
  );
};
