import React from 'react';

import styles from './loader.module.css';

enum LoaderSize {
  Small = 'Small',
  Default = 'Default',
}

type LoaderProps = {
  color?: string;
  size?: keyof typeof LoaderSize;
};

const Loader = ({
  size = LoaderSize.Default,
  color = '#673ab7',
}: LoaderProps) => {
  let className;
  switch (size) {
    case LoaderSize.Small:
      className = styles.loaderSmall;
      break;
    default:
      break;
  }

  return (
    <div className={`${styles.loader} ${className}`}>
      <span style={{ background: color }} className={styles.stroke}></span>
      <span style={{ background: color }} className={styles.stroke}></span>
      <span style={{ background: color }} className={styles.stroke}></span>
      <span style={{ background: color }} className={styles.stroke}></span>
      <span style={{ background: color }} className={styles.stroke}></span>
      <span style={{ background: color }} className={styles.stroke}></span>
      <span style={{ background: color }} className={styles.stroke}></span>
    </div>
  );
};

export default Loader;
