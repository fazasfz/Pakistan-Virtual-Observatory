/**
 * Reusable layout wrapper for main page sections.
 * Supports background images, videos, and dark overlays.
 */
import React, { forwardRef } from 'react';
import styles from './SectionWrapper.module.css';

const SectionWrapper = forwardRef(({ 
  children, 
  id, 
  className = '', 
  bgImage, 
  bgVideo,
  overlayClassName = '',
  overlay = true 
}, ref) => {
  return (
    <section 
      id={id} 
      ref={ref}
      className={`${styles.section} ${className}`}
      style={{
        ...(bgImage && !bgVideo ? { backgroundImage: `url(${bgImage})` } : {})
      }}
    >
      {bgVideo && (
        <video 
          className={styles.bgVideo} 
          autoPlay 
          loop 
          muted 
          playsInline
        >
          <source src={bgVideo} type="video/mp4" />
        </video>
      )}
      {overlay && <div className={`${styles.overlay} ${overlayClassName}`}></div>}
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
