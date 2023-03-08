import React from 'react';

import styles from './loader.module.css';

const Loader = () => {
  return (
    <div className={styles.loader}>
      <span className={styles.stroke}></span>
      <span className={styles.stroke}></span>
      <span className={styles.stroke}></span>
      <span className={styles.stroke}></span>
      <span className={styles.stroke}></span>
      <span className={styles.stroke}></span>
      <span className={styles.stroke}></span>
    </div>
  );
};

export default Loader;
