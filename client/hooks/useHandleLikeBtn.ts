import { AuthorizationStatus, PageRoutes } from '@/consts';
import {
  useAddLikeMutation,
  useRemoveLikeMutation,
} from '@/services/tracksService';
import {
  removeLikeFromState,
  addLikeToState,
} from '@/store/authSlice/authSlice';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { useTypedSelector } from './useTypedSelector';
import { useState } from 'react';

export const useHandleLikeBtn = (
  trackId: string,
): [boolean, (e: React.MouseEvent) => void] => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [addLike] = useAddLikeMutation();
  const [removeLike] = useRemoveLikeMutation();

  const isAuth = useTypedSelector((state) => state.auth.authorizationStatus);
  const likedTracks = useTypedSelector((state) => state.auth.user?.likedTracks);

  const isLiked = likedTracks ? likedTracks.includes(trackId) : false;

  const clickHandler = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isAuth !== AuthorizationStatus.Auth) {
      router.push(PageRoutes.Authorization);
      return;
    }
    if (isLiked) {
      removeLike(trackId);
      dispatch(removeLikeFromState(trackId));
    } else {
      addLike(trackId);
      dispatch(addLikeToState(trackId));
    }
  };

  return [isLiked, clickHandler];
};
