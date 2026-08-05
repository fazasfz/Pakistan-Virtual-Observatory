import React from 'react';
import { Layout } from 'antd';
import { ORG_ATTRIBUTION } from '../../../utils/constants';
import styles from './Footer.module.css';

const { Footer: AntFooter } = Layout;

const Footer = () => {
  return (
    <AntFooter className={styles.footer}>
      <div className={styles.content}>
        <div className={styles.branding}>
          <span className={styles.title}>VIRTUAL ASTRONOMY OBSERVATORY</span>
          <span className={styles.subtitle}>{ORG_ATTRIBUTION.join(' · ')}</span>
        </div>
      </div>
    </AntFooter>
  );
};

export default Footer;
