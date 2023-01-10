import { Button, Stack, TextField } from '@mui/joy';
import { useState, useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DidResolutionResponse } from '@windingtree/org.id-resolver';
import { Message } from '../components/Message';
import { Report } from '../components/Report';
import { VALIDATOR_URI } from '../config';
import { useApi } from '../hooks/useApi';

export interface OrgIdReportResponse {
  resolutionResponse: DidResolutionResponse;
}

export const Resolve = () => {
  const { did } = useParams();
  const [prevDid, setPrevDid] = useState<string | undefined>();
  const [newDid, setDid] = useState<string>(did ?? '');
  const navigate = useNavigate();
  const requestProps = useMemo(
    () => ({
      orgid: newDid,
      ...(newDid === prevDid ? { force: true } : {}),
    }),
    [newDid, prevDid],
  );

  const {
    data: report,
    loading,
    loaded,
    error,
    reload,
  } = useApi<OrgIdReportResponse>(
    VALIDATOR_URI,
    'GET',
    'orgid',
    newDid !== undefined && newDid !== '',
    requestProps,
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

      <Message type="error" show={report?.resolutionResponse.didDocument === null}>
        {report?.resolutionResponse.didResolutionMetadata.error ?? ''}
      </Message>

      {loaded && !error && <Report report={report?.resolutionResponse} />}
    </>
  );
};
