import React from 'react';

import { Comment } from '@/types/track';

import { Avatar, Card, Stack } from '@mui/material';

import styles from './comment.module.css';

type CommentProps = {
  comment: Comment;
};

const Comment = ({ comment }: CommentProps) => {
  return (
    <Card className={styles.commentCard}>
      <Stack direction="row" gap={1}>
        <Avatar
          src={comment.user.avatarLink}
          alt={comment.user.username}
        ></Avatar>
        <div>
          <div className={styles.commentAuthor}>{comment.user.username}</div>
          <div className={styles.commentBody}>{comment.text}</div>
        </div>
      </Stack>
    </Card>
  );
};

export default Comment;
