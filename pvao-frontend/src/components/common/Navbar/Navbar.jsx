import React from 'react';
import { Layout, Menu, Button } from 'antd';
import { NavLink } from 'react-router-dom';
import { Telescope } from 'lucide-react';
import styles from './Navbar.module.css';

const { Header } = Layout;

const Navbar = () => {
  const items = [
    { key: 'home', label: <NavLink to="/">HOME</NavLink> },
    { key: 'earth', label: <NavLink to="/earth-atmosphere">EARTH & ATMOSPHERE</NavLink> },
    { key: 'helios', label: <NavLink to="/helios-planets">HELIOS</NavLink> },
    { key: 'cosmos', label: <NavLink to="/deep-cosmos-exoplanet">DEEP COSMOS</NavLink> },
    { key: 'core', label: <NavLink to="/intelligent-core">INTELLIGENCE CORE</NavLink> },
  ];

  return (
    <Header className={styles.navbar}>
      <div className={styles.brand}>
        <Telescope size={20} className={styles.icon} />
        <span className={styles.title}>PVAO</span>
      </div>
      <Menu
        mode="horizontal"
        items={items}
        className={styles.menu}
        selectable={false}
      />
      <div className={styles.actions}>
        <Button type="primary" size="small" className={styles.connectBtn}>
          SYSTEM LINK
        </Button>
      </div>
    </Header>
  );
};

export default Navbar;
