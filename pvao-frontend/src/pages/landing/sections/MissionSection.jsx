import React from 'react';
import { Row, Col } from 'antd';
import SectionWrapper from '../../../components/common/SectionWrapper/SectionWrapper';
import HUDLabel from '../../../components/common/HUDLabel/HUDLabel';
import { useScrollReveal } from '../../../hooks/useScrollReveal';
import styles from './MissionSection.module.css';

import imgMission from '../../../assets/images/mission-section.jpg';

const MissionSection = () => {
  const revealRef = useScrollReveal();

  return (
    <div ref={revealRef}>
      <SectionWrapper id="mission" className={styles.missionSection} overlay={false}>
        <Row className={styles.row}>
          <Col xs={24} md={12} className={styles.textCol}>
            <HUDLabel text="SEC.01 // MISSION LOG" className={styles.label} />
            <h2 className={styles.heading}>NAVIGATE THE COSMOS</h2>
            <p className={styles.bodyText}>
              The Virtual Astronomy Observatory serves as an open gateway to astronomical data. 
              By aggregating authentic telemetry and imagery from global space agencies and observatories, 
              we empower students, researchers, and enthusiasts to explore the universe from their screens.
            </p>
            <p className={styles.bodyText}>
              No simulations. No mock data. Just real scientific instruments brought to the public domain.
            </p>
          </Col>
          <Col xs={24} md={12} className={styles.imageCol}>
            <div className={styles.imageFrame}>
              <div className={styles.crosshair}></div>
              <img 
                src={imgMission} 
                alt="Deep Space Observatory" 
                className={styles.missionImage} 
              />
            </div>
          </Col>
        </Row>
      </SectionWrapper>
    </div>
  );
};

export default MissionSection;
