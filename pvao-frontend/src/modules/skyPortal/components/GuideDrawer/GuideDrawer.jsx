import React from 'react';
import { Drawer } from 'antd';
import { guideContent } from './guideContent';
import styles from './GuideDrawer.module.css';

const GuideDrawer = ({ isOpen, onClose }) => {
  return (
    <Drawer
      title="Engine Guide"
      placement="right"
      onClose={onClose}
      open={isOpen}
      width={400}
      styles={{
        header: {
          background: 'var(--bg-obsidian, #1a1a1a)',
          borderBottom: '1px solid var(--accent-gold, #cda434)'
        },
        body: {
          background: 'var(--bg-obsidian, #1a1a1a)'
        }
      }}
    >
      <div className={styles.drawerContent}>
        {guideContent.map((item, index) => (
          <div key={index} className={styles.guideItem}>
            <div className={styles.guideLabel}>{item.label}</div>
            <p className={styles.guideDesc}>{item.description}</p>
          </div>
        ))}
      </div>
    </Drawer>
  );
};

export default GuideDrawer;
