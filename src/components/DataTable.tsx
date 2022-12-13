import { Grid } from '@mui/material';
import { ReactElement } from 'react';

export interface TableProps {
  headers: string[];
  data: Record<string, ReactElement>[];
}

export const DataTable = ({ headers, data }: TableProps) => {
  return (
    <Grid
      container
      borderRight="0.1rem solid #000"
      borderTop="0.1rem solid #000"
      borderLeft="0.1rem solid #000"
    >
      {headers.map((header, i) => (
        <Grid
          item
          key={i}
          xs={i === 0 ? 6 : 3}
          md={i === 0 ? 7 : true}
          p={1}
          textAlign={i === 0 ? 'start' : 'center'}
          borderBottom="0.1rem solid #000"
          borderRight={i === 0 ? '0.1rem solid #000' : ''}
          justifyContent={'center'}
        >
          {header}
        </Grid>
      ))}
      {data.map((row) =>
        Object.keys(row).map((key, j) => (
          <Grid
            p={1}
            item
            key={key}
            xs={j === 0 ? 6 : 3}
            md={j === 0 ? 7 : true}
            textAlign={j === 0 ? 'start' : 'center'}
            overflow="hidden"
            borderRight={j === 0 ? '0.1rem solid #000' : ''}
            borderBottom="0.1rem solid #000"
          >
            {row[key]}
          </Grid>
        )),
      )}
    </Grid>
  );
};
