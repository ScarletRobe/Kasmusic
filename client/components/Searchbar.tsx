import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';

import { useSearchTrackQuery } from '@/services/tracksService';
import { setSearchQuery } from '@/store/appSlice/appSlice';

import { useDebounce } from '@/hooks/useDebounce';
import { useInput } from '@/hooks/useInput';
import { Track } from '@/types/track';

import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { borderColor } from '@mui/system';
import { FormControl, Input, InputAdornment } from '@mui/material';

const Searchbar = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [query, setQuery] = useState('');
  // const [skip, setSkip] = useState(true);
  // const { data } = useSearchTrackQuery(searchbar.value, { skip });
  // const debouncedQuery = useDebounce(searchbar.value, 500);
  // const { data } = useSearchTrackQuery(debouncedQuery);
  // if (data && debouncedQuery !== null) {
  //   setTracks(data);
  // }

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!query) {
      return;
    }
    dispatch(setSearchQuery(query));
    setQuery('');
    router.push(`/search/${query}`);
  };

  return (
    <FormControl
      variant="standard"
      sx={{
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <form onSubmit={handleSearchSubmit}>
        <Input
          sx={{
            color: 'white',
            '&:before': { borderBottom: '1px solid #b8b8b8' },
            '&:hover:before': { borderBottom: '2px solid #b8b8b8 !important' },
          }}
          color="secondary"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
          }}
          id="input-with-icon-adornment"
          placeholder="Поиск"
          startAdornment={
            <InputAdornment position="start">
              <SearchRoundedIcon htmlColor="white" />
            </InputAdornment>
          }
        />
      </form>
    </FormControl>
  );
};

export default Searchbar;
