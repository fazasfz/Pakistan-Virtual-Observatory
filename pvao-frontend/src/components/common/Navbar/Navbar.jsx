import React, { useState } from 'react';
import { Layout, Button, Dropdown, Drawer } from 'antd';
import { NavLink } from 'react-router-dom';
import { Telescope, Menu as MenuIcon } from 'lucide-react';
import { modulesData } from '../../../pages/landing/data/modules.data';
import { PATHS } from '../../../routes/routePaths';
import { GITHUB_REPO_URL } from '../../../utils/constants';
import { useBreakpoint } from '../../../hooks/useBreakpoint';
import styles from './Navbar.module.css';

const { Header } = Layout;

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isMobile } = useBreakpoint();

  const moduleMenuItems = modulesData.map((mod) => ({
    key: mod.id,
    label: (
      <NavLink to={mod.path} className={styles.dropdownLink}>
        <span className={styles.modNumber}>{mod.number}</span> {mod.name}
      </NavLink>
    ),
  }));

  const topNavItems = [
    { label: 'HOME', path: PATHS.LANDING },
    { label: 'MODULES', dropdownItems: moduleMenuItems }
  ];

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
        {topNavItems.map(item => 
          item.dropdownItems ? (
            <Dropdown key={item.label} menu={{ items: item.dropdownItems }} placement="bottom" overlayClassName={styles.moduleDropdown}>
              <Button type="text" className={styles.navBtn}>{item.label}</Button>
            </Dropdown>
          ) : (
            <NavLink 
              key={item.label} 
              to={item.path} 
              className={({ isActive }) => isActive ? `${styles.navBtn} ${styles.activeNavBtn}` : styles.navBtn}
              end
            >
              {item.label}
            </NavLink>
          )
        )}
      </div>
      )}

      <div className={styles.actions}>
        <Button 
          type="primary" 
          size="small" 
          className={styles.connectBtn}
          href={GITHUB_REPO_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          SOURCE CODE
        </Button>
        
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
        title="SYSTEM MODULES"
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
          {modulesData.map((mod) => (
            <NavLink 
              key={mod.id} 
              to={mod.path} 
              className={({ isActive }) => isActive ? `${styles.mobileModuleLink} ${styles.activeMobileLink}` : styles.mobileModuleLink}
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className={styles.modNumber}>{mod.number}</span> {mod.name}
            </NavLink>
          ))}
        </div>
      </Drawer>
    </Header>
  );
};

export default Navbar;
