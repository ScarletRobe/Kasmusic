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

  const getIcon = () =>
    isLiked ? (
      <>
        <FavoriteRoundedIcon color="primary" />
        <span style={{ marginLeft: '5px' }}>{likesCount}</span>
      </>
    ) : (
      <>
        <FavoriteBorderRoundedIcon />
        <span style={{ marginLeft: '5px' }}>{likesCount}</span>
      </>
    );

  switch (variant) {
    case 'button':
      return (
        <Button variant="outlined" onClick={clickHandler}>
          {getIcon()}
        </Button>
      );
    case 'iconButton':
      return <IconButton onClick={clickHandler}>{getIcon()}</IconButton>;
    default:
      return null;
  }
};

export default LikeBtn;
