import React, { forwardRef } from 'react';
import styles from './SectionWrapper.module.css';

const SectionWrapper = forwardRef(({ 
  children, 
  id, 
  className = '', 
  bgImage, 
  overlay = true 
}, ref) => {
  return (
    <section 
      id={id} 
      ref={ref}
      className={`${styles.section} ${className}`}
      style={{
        ...(bgImage ? { backgroundImage: `url(${bgImage})` } : {})
      }}
    >
      {overlay && <div className={styles.overlay}></div>}
      <div className={styles.content}>
        {children}
      </div>
      {/* Corner brackets simulating viewfinder */}
      <div className={`${styles.bracket} ${styles.tl}`}></div>
      <div className={`${styles.bracket} ${styles.tr}`}></div>
      <div className={`${styles.bracket} ${styles.bl}`}></div>
      <div className={`${styles.bracket} ${styles.br}`}></div>
    </section>
  );
});

SectionWrapper.displayName = 'SectionWrapper';
export default SectionWrapper;
