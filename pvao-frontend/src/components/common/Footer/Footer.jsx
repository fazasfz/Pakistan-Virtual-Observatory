/**
 * Global footer component displaying copyright, links, and observatory metadata.
 */
import React from 'react';
import { Layout } from 'antd';
import { NavLink } from 'react-router-dom';

import { PATHS } from '../../../routes/routePaths';
import { ORG_ATTRIBUTION } from '../../../utils/constants';
import { useAstroCopilotContext } from '../../../context/AstroCopilotContext';
import ncgsaLogo from '../../../assets/images/ncgsa-logo.png';
import styles from './Footer.module.css';

const { Footer: AntFooter } = Layout;

const Footer = () => {
  const { openCopilot } = useAstroCopilotContext();

  return (
    <AntFooter className={styles.footer}>
      <div className={styles.content}>
        
        <div className={styles.leftColumn}>
          <img src={ncgsaLogo} alt="NCGSA logo" className={styles.footerLogo} />
          <h3 className={styles.title}>VIRTUAL ASTRONOMY OBSERVATORY</h3>
          <p className={styles.mission}>
            A centralized platform aggregating live telemetry and observational data from global space agencies.
          </p>
          <div style={{ marginTop: 'var(--space-8)' }}>
            <a href="https://ncgsa.org.pk/" target="_blank" rel="noopener noreferrer" className={styles.footerLink}>Visit NCGSA Website →</a>
          </div>
        </div>

        <div className={styles.linksSection}>
          <div className={styles.linkColumn}>
            <span className={styles.columnHeader}>Site</span>
            <NavLink to={PATHS.LANDING} className={styles.footerLink}>Home</NavLink>
            <NavLink to={PATHS.CREDITS} className={styles.footerLink}>Credits</NavLink>
            <button onClick={openCopilot} className={styles.footerButton}>Astro-Copilot</button>
          </div>

          <div className={styles.linkColumn}>
            <span className={styles.columnHeader}>Modules</span>
            <NavLink to={PATHS.SOLAR_OBSERVATORY} className={styles.footerLink}>Solar Observatory</NavLink>
            <NavLink to={PATHS.LUNAR_OBSERVATORY} className={styles.footerLink}>Lunar Observatory</NavLink>
            <NavLink to={PATHS.ZENITH} className={styles.footerLink}>Zenith</NavLink>
            <NavLink to={PATHS.DEEP_SKY_EXPLORER} className={styles.footerLink}>Deep Sky Explorer</NavLink>
            <NavLink to={PATHS.EXORA} className={styles.footerLink}>Exora</NavLink>
            <NavLink to={PATHS.ASTRONOMICAL_PROBE_TRACKER} className={styles.footerLink}>Astronomical Probes</NavLink>
          </div>

          <div className={styles.linkColumn}>
            <span className={styles.columnHeader}>Console</span>
            <NavLink to={PATHS.SOLAR_SYSTEM_SIMULATOR} className={styles.footerLink}>Solar System Simulator</NavLink>
            <NavLink to={PATHS.OBSERVATION_PLANNER} className={styles.footerLink}>Observation Planner</NavLink>
          </div>
          
          <div className={styles.linkColumn}>
            <span className={styles.columnHeader}>Connect</span>
            {/* Note: Update these href links with the final NCGSA social URLs when available */}
            <a href="https://www.linkedin.com/company/ncgsa/" target="_blank" rel="noopener noreferrer" className={styles.footerLink}>LinkedIn</a>
            <a href="https://www.facebook.com/ncgsa.ist" target="_blank" rel="noopener noreferrer" className={styles.footerLink}>Facebook</a>
            <a href="https://www.instagram.com/ncgsa.ist/" target="_blank" rel="noopener noreferrer" className={styles.footerLink}>Instagram</a>
            <a href="https://www.youtube.com/@ncgsaist" target="_blank" rel="noopener noreferrer" className={styles.footerLink}>YouTube</a>
          </div>
        </div>

      </div>

      <div className={styles.bottomStrip}>
        {ORG_ATTRIBUTION.map((org, index) => (
          <span key={index}>{org}</span>
        ))}
      </div>
    </AntFooter>
  );
};

export default Footer;
