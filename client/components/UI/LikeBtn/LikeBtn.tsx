import React from 'react';

import { Button, IconButton } from '@mui/material';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import { useHandleLikeBtn } from '@/hooks/useHandleLikeBtn';

type LikeBtnProps = {
  trackId: string;
  variant: 'button' | 'iconButton';
  likesCount?: number;
};

const LikeBtn = ({ trackId, variant, likesCount }: LikeBtnProps) => {
  const [isLiked, clickHandler] = useHandleLikeBtn(trackId);

  switch (variant) {
    case 'button':
      return (
        <Button variant="outlined" onClick={clickHandler}>
          {isLiked ? (
            <>
              <FavoriteRoundedIcon color="primary" />
              <span style={{ marginLeft: '5px' }}>{likesCount}</span>
            </>
          ) : (
            <>
              <FavoriteBorderRoundedIcon />
              <span style={{ marginLeft: '5px' }}>{likesCount}</span>
            </>
          )}
        </Button>
      );
    case 'iconButton':
      return (
        <IconButton onClick={clickHandler}>
          {isLiked ? (
            <FavoriteRoundedIcon color="primary" />
          ) : (
            <FavoriteBorderRoundedIcon />
          )}
        </IconButton>
      );
    default:
      return null;
  }
};

export default LikeBtn;
