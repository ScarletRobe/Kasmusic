import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';

import { setSearchQuery } from '@/store/appSlice/appSlice';

import { useDebounce } from '@/hooks/useDebounce';
import { useTypedSelector } from '@/hooks/useTypedSelector';

import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { FormControl, Input, InputAdornment } from '@mui/material';
import { PageRoutes } from '@/consts';

const Searchbar = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const query = useTypedSelector((state) => state.app.searchQuery);
  const debouncedQuery = useDebounce(query, 600);

  useEffect(() => {
    if (!debouncedQuery) {
      return;
    }
    router.push(`${PageRoutes.Search}/${debouncedQuery}`);
  }, [debouncedQuery]);

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!query) {
      return;
    }
    dispatch(setSearchQuery(query));
    router.push(`${PageRoutes.Search}/${query}`);
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
          fullWidth
          value={query}
          onChange={(e) => {
            dispatch(setSearchQuery(e.target.value));
          }}
          id="input-with-icon-adornment"
          placeholder="Поиск"
          startAdornment={
            <InputAdornment position="start">
              <SearchRoundedIcon />
            </InputAdornment>
          }
        />
      </form>
    </FormControl>
  );
};

export default Searchbar;
