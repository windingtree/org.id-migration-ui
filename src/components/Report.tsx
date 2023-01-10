/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AspectRatio,
  Card,
  CardContent,
  Divider,
  Link,
  Stack,
  Typography,
} from '@mui/joy';
import { ReactElement } from 'react';
import { DidResolutionResponse } from '@windingtree/org.id-resolver';
import { getEntityData } from '../utils/orgJson';
import { normalizeIpfsLink } from '../utils/strings';

const TableRow = ({ label, data }: { label: string; data: ReactElement }) => (
  <Stack direction="row" spacing={1} justifyContent="flex-start">
    <Stack direction="row" minWidth="15%" width="15%" justifyContent="space-between">
      <Typography fontWeight="bold">{label}</Typography>
      <Divider orientation="vertical" />
    </Stack>
    <Stack overflow="hidden">{data}</Stack>
  </Stack>
);

const DataRow = ({ label, data }: { label: string; data: string | number }) => (
  <Stack direction="row" spacing={1} justifyContent="flex-start">
    <Typography fontWeight="bold">{label}</Typography>
    <Typography>{data}</Typography>
  </Stack>
);

export const Report = ({ report }: { report: DidResolutionResponse | undefined }) => {
  if (!report || !report.didDocumentMetadata || !report.didDocument) {
    return null;
  }
  const profileData = getEntityData(report.didDocument);
  const orgType = report.didDocument.legalEntity ? 'Legal Entity' : 'Organizational Unit';
  const ipfsLink = normalizeIpfsLink(report.didDocumentMetadata?.data?.orgJsonUri);

  return (
    <>
      <Card>
        <CardContent>
          {profileData && (
            <Stack direction="row">
              <AspectRatio sx={{ width: 300, borderRadius: 'md', overflow: 'auto' }}>
                <img src={profileData.logo} />
              </AspectRatio>
              {report.didDocument.legalEntity?.legalType && (
                <Stack>
                  <Typography>
                    {profileData.type}. {profileData.name}
                  </Typography>
                  <Typography>{profileData.streetAddress}</Typography>
                  <Typography>
                    {profileData.postalCode}, {profileData.locality},{' '}
                    {profileData.country}
                  </Typography>
                </Stack>
              )}
            </Stack>
          )}
          <TableRow label="DID" data={<Typography>{report.did}</Typography>} />
          <TableRow
            label="Owner"
            data={<Typography>{report.didDocumentMetadata?.data?.owner}</Typography>}
          />
          <TableRow
            label="Token id"
            data={<Typography>{report.didDocumentMetadata?.data?.tokenId}</Typography>}
          />
          <TableRow
            label="Active"
            data={
              (report.didDocumentMetadata?.data as any)?.deactivated === true ? (
                <>YES</>
              ) : (
                <>NO</>
              )
            }
          />
          <TableRow label="Org Type" data={<Typography>{orgType}</Typography>} />
          <TableRow
            label="Link"
            data={
              <Link href={ipfsLink} target="_blank">
                {report.didDocumentMetadata?.data?.orgJsonUri}
              </Link>
            }
          />
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <DataRow label="duration" data={report.didResolutionMetadata.duration} />
          <DataRow
            label="resolver version"
            data={report.didResolutionMetadata.resolverVersion}
          />
          <DataRow label="retrieved" data={report.didResolutionMetadata.retrieved} />
        </CardContent>
      </Card>
    </>
  );
};
