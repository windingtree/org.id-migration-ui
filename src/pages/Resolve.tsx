import { Button, Stack, TextField } from '@mui/joy';
import { useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Message } from '../components/Message';
import { Report } from '../components/Report';
import { useOrgIdReport } from '../hooks/useOrgIdReport';

export const Resolve = () => {
  const { did } = useParams();
  const [prevDid, setPrevDid] = useState<string | undefined>();
  const [newDid, setDid] = useState<string>(did ?? '');
  const navigate = useNavigate();
  const { report, loading, loaded, error, reload } = useOrgIdReport(
    newDid,
    newDid === prevDid,
  );

  const onSubmit = useCallback(() => {
    if (newDid === prevDid) {
      return reload();
    }
    setPrevDid(newDid);
    navigate(`/resolve/${newDid}`);
  }, [prevDid, newDid]);

  return (
    <>
      <Stack spacing={1} mb={1}>
        <TextField
          defaultValue={newDid}
          onChange={(e) => setDid(e.currentTarget.value)}
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
