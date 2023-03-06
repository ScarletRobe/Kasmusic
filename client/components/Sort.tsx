import React from 'react';
import { SortTypes } from '@/consts';
import { useDispatch } from 'react-redux';
import { setCurrentSort } from '@/store/appSlice/appSlice';
import { useTypedSelector } from '@/hooks/useTypedSelector';
import {
  SelectChangeEvent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';

const Sort = () => {
  const dispatch = useDispatch();
  const currentSort = useTypedSelector((state) => state.app.currentSort);
  const handleSortChange = (e: SelectChangeEvent<HTMLInputElement>) => {
    dispatch(setCurrentSort(e.target.value as SortTypes));
  };

  return (
    <FormControl variant="standard" sx={{ m: 1, minWidth: 300 }}>
      <InputLabel id="tracksSort">Сортировка</InputLabel>
      <Select
        labelId="tracksSort"
        id="sort"
        value={currentSort as any}
        label="Sort"
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
  );
};

export default Sort;
