import React from 'react';
import { Layout } from 'antd';
import styles from './Footer.module.css';

const { Footer: AntFooter } = Layout;

const Footer = () => {
  return (
    <AntFooter className={styles.footer}>
      <div className={styles.content}>
        <div className={styles.branding}>
          <span className={styles.title}>PAKISTAN VIRTUAL ASTRONOMY OBSERVATORY</span>
          <span className={styles.subtitle}>EST. 2026 // NCGSA</span>
        </div>
        <div className={styles.systemStatus}>
          <div className={styles.statusDot}></div>
          <span className="hud-text">SYSTEM ONLINE</span>
        </div>
      </div>
    </AntFooter>
  );
};

export default Footer;
