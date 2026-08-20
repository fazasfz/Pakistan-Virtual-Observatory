/**
 * Global navigation bar for the PVAO application.
 * Contains routing links, mobile menu controls, and AstroCopilot integration.
 */
import React, { useState } from 'react';
import { Layout, Button, Drawer, Dropdown } from 'antd';
import { NavLink } from 'react-router-dom';

import { PATHS } from '../../../routes/routePaths';
import { useBreakpoint } from '../../../hooks/useBreakpoint';
import { useAstroCopilotContext } from '../../../context/AstroCopilotContext';
import vaoLogo from '../../../assets/images/vao-logo.png';
import styles from './Navbar.module.css';

const { Header } = Layout;

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isMobile, isTablet } = useBreakpoint();
  const showMobileMenu = isMobile || isTablet;
  const { openCopilot } = useAstroCopilotContext();

  const moduleItems = [
    { key: 'solar', label: <NavLink to={PATHS.SOLAR_OBSERVATORY}>Solar Observatory</NavLink> },
    { key: 'lunar', label: <NavLink to={PATHS.LUNAR_OBSERVATORY}>Lunar Observatory</NavLink> },
    { key: 'exora', label: <a href="https://exora-space.vercel.app/" target="_blank" rel="noopener noreferrer">EXORA</a> },
    { key: 'deepSky', label: <NavLink to={PATHS.DEEP_SKY_EXPLORER}>Deep Sky Explorer</NavLink> },
    { key: 'sky', label: <NavLink to={PATHS.ZENITH}>Zenith</NavLink> },
    { key: 'probes', label: <NavLink to={PATHS.ASTRONOMICAL_PROBE_TRACKER}>Astronomical Probes</NavLink> },
  ];

  const exploreItems = [
    { key: 'credits', label: <NavLink to={PATHS.CREDITS}>Credits</NavLink> },
    { key: 'dataSources', label: <NavLink to={PATHS.DATA_SOURCES}>Data Sources</NavLink> },
    { key: 'glossary', label: <NavLink to={PATHS.GLOSSARY}>Glossary</NavLink> },
  ];

  const toolsItems = [
    { key: 'simulator', label: <a href="https://dynamix209.github.io/solar-system-orbital-simulator/" target="_blank" rel="noopener noreferrer">Solar System Simulator</a> },
    { key: 'copilot', label: <div onClick={openCopilot} style={{ cursor: 'pointer' }}>Astro-Copilot</div> },
  ];

  const getNavClass = ({ isActive }) => isActive ? `${styles.navBtn} ${styles.activeNavBtn}` : styles.navBtn;
  const getMobileNavClass = ({ isActive }) => isActive ? `${styles.mobileModuleLink} ${styles.activeMobileLink}` : styles.mobileModuleLink;

  return (
    <Header className={styles.navbar}>
      <div className={styles.leftGroup}>
        {!showMobileMenu ? (
          <>
            <NavLink to={PATHS.LANDING} className={getNavClass} end>HOME</NavLink>
            <Dropdown menu={{ items: moduleItems }} trigger={['hover']} rootClassName={styles.navDropdown}>
              <span className={`${styles.navBtn} ${styles.dropdownTrigger}`}>MODULES</span>
            </Dropdown>
          </>
        ) : (
          <Button type="text" className={styles.mobileTrigger} onClick={() => setMobileMenuOpen(true)}>
            <span style={{ color: 'var(--starlight)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>[ MENU ]</span>
          </Button>
        )}
      </div>

      <div className={styles.centerLogo}>
        <NavLink to={PATHS.LANDING} className={styles.brandLink}>
          <img src={vaoLogo} alt="VAO logo" className={styles.logoImage} />
        </NavLink>
      </div>

      <div className={styles.rightGroup}>
        {!showMobileMenu && (
          <>
            <Dropdown menu={{ items: exploreItems }} trigger={['hover']} rootClassName={styles.navDropdown}>
              <span className={`${styles.navBtn} ${styles.dropdownTrigger}`}>EXPLORE</span>
            </Dropdown>
            <Dropdown menu={{ items: toolsItems }} trigger={['hover']} rootClassName={styles.navDropdown}>
              <span className={`${styles.navBtn} ${styles.dropdownTrigger}`}>TOOLS</span>
            </Dropdown>
          </>
        )}
      </div>

      <Drawer title="SYSTEM NAV" placement="right" onClose={() => setMobileMenuOpen(false)} open={mobileMenuOpen} className={styles.mobileDrawer}>
        <div className={styles.mobileModuleList}>
          <NavLink to={PATHS.LANDING} className={getMobileNavClass} onClick={() => setMobileMenuOpen(false)} end>HOME</NavLink>
          
          <div className={styles.mobileModuleLink}>EXPLORE</div>
          <div className={styles.mobileSubMenu}>
             {exploreItems.map(item => (
                <div key={item.key} className={styles.mobileSubMenuItem} onClick={() => setMobileMenuOpen(false)}>{item.label}</div>
             ))}
          </div>

          <div className={styles.mobileModuleLink}>MODULES</div>
          <div className={styles.mobileSubMenu}>
             {moduleItems.map(item => (
                <div key={item.key} className={styles.mobileSubMenuItem} onClick={() => setMobileMenuOpen(false)}>{item.label}</div>
             ))}
          </div>

          <div className={styles.mobileModuleLink}>TOOLS</div>
          <div className={styles.mobileSubMenu}>
             {toolsItems.map(item => (
                <div key={item.key} className={styles.mobileSubMenuItem} onClick={() => setMobileMenuOpen(false)}>{item.label}</div>
             ))}
          </div>
        </div>
      </Drawer>
    </Header>
  );
};

export default Navbar;
