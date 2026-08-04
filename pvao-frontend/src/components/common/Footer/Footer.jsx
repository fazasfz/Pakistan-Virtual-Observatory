import React from 'react';
import { Layout } from 'antd';
import { NavLink } from 'react-router-dom';
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
        <div className={styles.links}>
          <NavLink to="/credits" className={styles.footerLink}>[ CREDITS ]</NavLink>
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
