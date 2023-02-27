import React from 'react';

import { FormControl, Input, InputAdornment } from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { useSearchTrackQuery } from '@/services/tracksService';
import { useDebounce } from '@/hooks/useDebounce';
import { useInput } from '@/hooks/useInput';
import { Track } from '@/types/track';

type SearchbarProps = {
  setTracks: React.Dispatch<React.SetStateAction<Track[] | null>>;
};

const Searchbar = ({ setTracks }: SearchbarProps) => {
  const searchbar = useInput('');
  const debouncedQuery = useDebounce(searchbar.value, 500);
  const { data } = useSearchTrackQuery(debouncedQuery);
  if (data && debouncedQuery !== null) {
    setTracks(data);
  }

  return (
    <FormControl
      variant="standard"
      sx={{ display: 'flex', justifyContent: 'center' }}
    >
      <Input
        {...searchbar}
        id="input-with-icon-adornment"
        placeholder="Поиск"
        startAdornment={
          <InputAdornment position="start">
            <SearchRoundedIcon />
          </InputAdornment>
        }
      />
    </FormControl>
  );
};

export default Searchbar;
