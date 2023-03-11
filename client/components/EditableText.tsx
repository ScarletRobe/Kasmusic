import React, { useState } from 'react';

import { useInput } from '@/hooks/useInput';

import { IconButton, Stack, TextField } from '@mui/material';
import EditRoundedIcon from '@mui/icons-material/EditRounded';

type EditableTextProps = {
  text: string;
  fieldName: string;
  action: any;
};

const EditableText = ({ text, fieldName, action }: EditableTextProps) => {
  const [isEdit, setIsEdit] = useState(false);
  const [content, setContent] = useState(text);
  const textControl = useInput(text);

  const submitHandler = () => {
    if (isEdit && textControl.value !== text) {
      setContent(textControl.value);
      action({ field: fieldName, newValue: textControl.value });
    }
    setIsEdit((state) => !state);
  };

  return (
    <Stack direction="row" alignItems="center" gap={1}>
      {isEdit ? (
        <TextField
          // sx={{ 'MuiInputBase-input': {fontSize: '2em', fontWeight: 'bold'}}}
          {...textControl}
          onKeyDown={(e) => {
            if (e.code === 'Enter') {
              submitHandler();
            }
            if (e.code === 'Escape') {
              setIsEdit((state) => !state);
            }
          }}
        />
      ) : (
        <h1 style={{ margin: '0' }}>{content}</h1>
      )}
      <IconButton onClick={submitHandler}>
        <EditRoundedIcon htmlColor={isEdit ? 'black' : 'gray'} />
      </IconButton>
    </Stack>
  );
};

export default EditableText;
