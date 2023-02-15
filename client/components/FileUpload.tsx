import { AcceptableFiles } from '@/types/track';
import { Grid } from '@mui/material';
import React, { Dispatch, SetStateAction, useRef } from 'react';

type FileUploadProps = {
  setFile: Dispatch<SetStateAction<File | null>>;
  accept: AcceptableFiles;
  children: JSX.Element;
};

const FileUpload: React.FC<FileUploadProps> = ({
  setFile,
  accept,
  children,
}) => {
  const ref =
    useRef<HTMLInputElement>() as React.MutableRefObject<HTMLInputElement>;

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) {
      return;
    }
    setFile(e.target.files[0]);
  };

  return (
    <Grid
      container
      justifyContent="center"
      onClick={() => ref.current.click()}
      style={{ display: 'grid', placeItems: 'center' }}
    >
      <input
        type="file"
        accept={accept}
        style={{ display: 'none' }}
        ref={ref}
        onChange={onChange}
      />
      {children}
    </Grid>
  );
};

export default FileUpload;
