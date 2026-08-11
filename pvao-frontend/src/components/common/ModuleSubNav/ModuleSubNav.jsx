import React from 'react';
import { NavLink } from 'react-router-dom';
import { Telescope, Star, Satellite, Sun, Globe, Orbit, Compass, Calendar, Moon } from 'lucide-react';
import { modulesData } from '../../../pages/landing/data/modules.data';
import styles from './ModuleSubNav.module.css';

const iconMap = {
  'sky-portal': Star,
  'astronomical-probe-tracker': Satellite,
  'solar-observatory': Sun,
  'earth-view': Globe,
  'deep-sky-explorer': Telescope,
  'exora': Compass,
  'solar-system-simulator': Orbit,
  'observation-planner': Calendar,
  'lunar-observatory': Moon,
};

export default function ModuleSubNav() {
  return (
    <nav className={styles.subNav}>
      {modulesData.map((m) => {
        const Icon = iconMap[m.id] || Star;
        return (
          <NavLink 
            key={m.id} 
            to={m.path} 
            className={({ isActive }) => isActive ? `${styles.item} ${styles.activeItem}` : styles.item}
          >
            <Icon size={14} className={styles.icon} />
            <span className={styles.number}>{m.number}</span>
            <span className={styles.name}>{m.name}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}
