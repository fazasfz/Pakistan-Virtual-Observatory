import React, { useState, useEffect } from 'react';
import { Layout, Button, Drawer } from 'antd';
import { NavLink } from 'react-router-dom';
import { Telescope, Menu as MenuIcon } from 'lucide-react';
import { PATHS } from '../../../routes/routePaths';
import { useBreakpoint } from '../../../hooks/useBreakpoint';
import { useAstroCopilotContext } from '../../../context/AstroCopilotContext';
import styles from './Navbar.module.css';

const { Header } = Layout;

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isMobile } = useBreakpoint();
  const { openCopilot } = useAstroCopilotContext();

  return (
    <Header className={styles.navbar}>
      <div className={styles.brand}>
        <NavLink to={PATHS.LANDING} style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'inherit', textDecoration: 'none' }}>
          <Telescope size={20} className={styles.icon} />
          <span className={styles.title}>VAO</span>
        </NavLink>
      </div>
      
      {/* Desktop Menu */}
      {!isMobile && (
      <div className={styles.desktopMenu}>
        <NavLink 
          to={PATHS.LANDING} 
          className={({ isActive }) => isActive ? `${styles.navBtn} ${styles.activeNavBtn}` : styles.navBtn}
          end
        >
          HOME
        </NavLink>
      </div>
      )}

      <div className={styles.actions}>
        {!isMobile && (
          <div className={styles.systemStatus}>
            <NavLink 
              to="/credits" 
              className={({ isActive }) => isActive ? `${styles.navBtn} ${styles.activeNavBtn}` : styles.navBtn}
              style={{ marginRight: '16px' }}
            >
              CREDITS
            </NavLink>
            <button
              onClick={openCopilot}
              className={styles.navBtn}
              style={{ marginRight: '16px', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            >
              ASTRO-COPILOT
            </button>
            <div className={styles.statusIndicator}>
              <span className={styles.pulseDot}></span>
              <span className={styles.statusLabel}>SYSTEM ONLINE</span>
            </div>
          </div>
        )}

        {/* Mobile Menu Trigger */}
        {isMobile && (
        <Button 
          type="text" 
          className={styles.mobileTrigger}
          onClick={() => setMobileMenuOpen(true)}
          icon={<MenuIcon size={24} color="var(--starlight)" />}
        />
        )}
      </div>

      <Drawer
        title="SYSTEM NAV"
        placement="right"
        onClose={() => setMobileMenuOpen(false)}
        open={mobileMenuOpen}
        className={styles.mobileDrawer}
        width={280}
      >
        <div className={styles.mobileModuleList}>
          <NavLink 
            to={PATHS.LANDING} 
            className={({ isActive }) => isActive ? `${styles.mobileModuleLink} ${styles.activeMobileLink}` : styles.mobileModuleLink}
            onClick={() => setMobileMenuOpen(false)}
            end
          >
            <span className={styles.modNumber}>SYS.00</span> HOME
          </NavLink>
          <NavLink 
            to="/credits" 
            className={({ isActive }) => isActive ? `${styles.mobileModuleLink} ${styles.activeMobileLink}` : styles.mobileModuleLink}
            onClick={() => setMobileMenuOpen(false)}
          >
            <span className={styles.modNumber}>SYS.01</span> CREDITS
          </NavLink>
          <button 
            className={styles.mobileModuleLink}
            style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
            onClick={() => {
              setMobileMenuOpen(false);
              openCopilot();
            }}
          >
            <span className={styles.modNumber}>SYS.02</span> ASTRO-COPILOT
          </button>
          <div className={styles.mobileStatusWrapper}>
            <div className={styles.statusIndicator}>
              <span className={styles.pulseDot}></span>
              <span className={styles.statusLabel}>SYSTEM ONLINE</span>
            </div>
          </div>
        </div>
      </Drawer>
    </Header>
  );
};

export default Navbar;
