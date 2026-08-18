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
import ncgsaLogo from '../../../assets/images/ncgsa-logo.png';
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
    { key: 'exora', label: <NavLink to={PATHS.EXORA}>Exora</NavLink> },
    { key: 'deepSky', label: <NavLink to={PATHS.DEEP_SKY_EXPLORER}>Deep Sky Explorer</NavLink> },
    { key: 'sky', label: <NavLink to={PATHS.ZENITH}>Zenith</NavLink> },
    { key: 'probes', label: <NavLink to={PATHS.ASTRONOMICAL_PROBE_TRACKER}>Astronomical Probes</NavLink> },
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
          <img src={ncgsaLogo} alt="NCGSA logo" className={styles.logoImage} />
        </NavLink>
      </div>

      <div className={styles.rightGroup}>
        {!showMobileMenu && (
          <>
            <NavLink to={PATHS.SOLAR_SYSTEM_SIMULATOR} className={getNavClass}>SOLAR SYSTEM SIMULATOR</NavLink>
            <button onClick={openCopilot} className={styles.copilotBadge}>ASTRO-COPILOT</button>
          </>
        )}
      </div>

      <Drawer title="SYSTEM NAV" placement="right" onClose={() => setMobileMenuOpen(false)} open={mobileMenuOpen} className={styles.mobileDrawer}>
        <div className={styles.mobileModuleList}>
          <NavLink to={PATHS.LANDING} className={getMobileNavClass} onClick={() => setMobileMenuOpen(false)} end>HOME</NavLink>
          <NavLink to={PATHS.SOLAR_SYSTEM_SIMULATOR} className={getMobileNavClass} onClick={() => setMobileMenuOpen(false)}>SOLAR SYSTEM SIMULATOR</NavLink>
          <div className={styles.mobileModuleLink}>MODULES</div>
          <div className={styles.mobileSubMenu}>
             {moduleItems.map(item => (
                <div key={item.key} className={styles.mobileSubMenuItem} onClick={() => setMobileMenuOpen(false)}>{item.label}</div>
             ))}
          </div>
          <button className={`${styles.copilotBadge} ${styles.mobileCopilotBadge}`} onClick={() => { setMobileMenuOpen(false); openCopilot(); }}>ASTRO-COPILOT</button>
        </div>
      </Drawer>
    </Header>
  );
};

export default Navbar;
