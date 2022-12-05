import { Button, Stack, TextField } from '@mui/joy';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Message } from '../components/Message';
import { Report } from '../components/Report';
import { useOrgIdReport } from '../hooks/useOrgIdReport';

export const Resolve = () => {
  const [newDid, setDid] = useState<string>();
  const { did } = useParams();
  const navigate = useNavigate();
  const { report, loading, loaded, error } = useOrgIdReport(did);

  const onSubmit = () => {
    navigate(`/resolve/${newDid}`);
  };

  return (
    <>
      <Stack spacing={1} mb={1}>
        <TextField
          defaultValue={did ?? ''}
          onChange={(e) => setDid(e.currentTarget.value)}
          id="outlined-basic"
          label="DID"
          variant="outlined"
        />
        <Button loading={loading} onClick={onSubmit}>
          Resolve
        </Button>
      </Stack>

      <Message show={!!error && loaded && !report} type="error">
        {error}
      </Message>

      <Message type="error" show={report?.didDocument === null}>
        {report?.didResolutionMetadata.error ?? ''}
      </Message>

      {loaded && !error && <Report report={report} />}
    </>
  );
};
