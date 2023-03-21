import React from 'react';

import { Comment } from '@/types/track';

import { Card } from '@mui/material';

import styles from './comment.module.css';

type CommentProps = {
  comment: Comment;
};

const Comment = ({ comment }: CommentProps) => {
  return (
    <Card className={styles.commentCard}>
      <div className={styles.commentAuthor}>{comment.username}</div>
      <div className={styles.commentBody}>{comment.text}</div>
    </Card>
  );
};

export default Comment;
