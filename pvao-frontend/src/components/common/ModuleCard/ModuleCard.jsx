import React, { useState } from 'react';
import { Card } from 'antd';
import { NavLink } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import HUDLabel from '../HUDLabel/HUDLabel';
import styles from './ModuleCard.module.css';

const FALLBACK_IMG = 'https://images-assets.nasa.gov/image/PIA12348/PIA12348~orig.jpg'; // Reliable generic NASA fallback

const ModuleCard = ({ number, name, description, linkTo, bgImage }) => {
  const [currentBg, setCurrentBg] = useState(bgImage);

  const handleImageError = () => {
    setCurrentBg(FALLBACK_IMG);
  };

  return (
    <Card 
      className={styles.moduleCard} 
      bordered={false}
      style={{ backgroundImage: `url(${currentBg})` }}
    >
      {/* Hidden img tag just to detect load errors for the background image */}
      <img 
        src={currentBg} 
        style={{ display: 'none' }} 
        onError={handleImageError} 
        alt="" 
      />
      
      <div className={styles.overlay}></div>
      <div className={styles.content}>
        <div className={styles.header}>
          <HUDLabel text={number} />
          <h3 className={styles.title}>{name}</h3>
          <p className={styles.description}>{description}</p>
        </div>

        <div className={styles.footer}>
          <NavLink to={linkTo} className={styles.cta}>
            ENTER MODULE <ArrowRight size={16} />
          </NavLink>
        </div>
      </div>
    </Card>
  );
};

export default ModuleCard;
