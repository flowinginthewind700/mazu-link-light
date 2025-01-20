import React from 'react';
import styles from './AGIEntryIcon.module.css';

const AGIEntryIcon: React.FC = () => {
  return (
    <div className={styles.iconContainer}>
      <div className={styles.textTopLeft}>AGI</div>
      <div className={styles.textBottomRight}>Entry</div>
      <div className={styles.arcTopRight}></div>
      <div className={styles.arcBottomLeft}></div>
    </div>
  );
};

export default AGIEntryIcon;