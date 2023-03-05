import React, { useState } from 'react';

import TrackItem from './TrackItem/TrackItem';

import {
  Grid,
  Box,
  InputLabel,
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';

import { useGetAllTracksQuery } from '@/services/tracksService';
import { SortTypes } from '@/consts';
import { Stack } from '@mui/system';

const TrackList: React.FC = () => {
  const [sort, setSort] = useState<SortTypes>(SortTypes.NEWEST);
  const { data, isLoading, isError } = useGetAllTracksQuery({
    count: '50',
    offset: '0',
  });

  const handleSortChange = (e: SelectChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
    setSort(e.target.value as SortTypes);
  };

  if (isLoading) return <div>Loading</div>;
  if (isError || !data) return <div>Error</div>;

  return (
    <>
      <Box pl={4} pr={4}>
        <Stack direction="row" justifyContent="flex-end">
          <FormControl sx={{ m: 1, minWidth: 300 }}>
            <InputLabel id="demo-simple-select-label">Сортировка</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={sort as any}
              label="Age"
              onChange={handleSortChange}
            >
              <MenuItem value={SortTypes.LEAST_LISTENED}>
                {SortTypes.LEAST_LISTENED}
              </MenuItem>
              <MenuItem value={SortTypes.MOST_LISTENED}>
                {SortTypes.MOST_LISTENED}
              </MenuItem>
              <MenuItem value={SortTypes.NEWEST}>{SortTypes.NEWEST}</MenuItem>
              <MenuItem value={SortTypes.LATEST}>{SortTypes.LATEST}</MenuItem>
            </Select>
          </FormControl>
        </Stack>
        <Grid container direction="column">
          <Box pt={2} pb={2}>
            {data.map((track) => (
              <TrackItem key={track._id} track={track} />
            ))}
          </Box>
        </Grid>
      </Box>
    </>
  );
};

export default TrackList;
