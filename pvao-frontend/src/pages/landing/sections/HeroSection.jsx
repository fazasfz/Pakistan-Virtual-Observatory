import React, { useState, useEffect } from 'react';
import SectionWrapper from '../../../components/common/SectionWrapper/SectionWrapper';
import HUDLabel from '../../../components/common/HUDLabel/HUDLabel';
import ScrollIndicator from '../../../components/common/ScrollIndicator/ScrollIndicator';
import { useScrollReveal } from '../../../hooks/useScrollReveal';
import { getLocalCoordinates, getLiveTime } from '../../../utils/formatCoordinates';
import { ORG_ATTRIBUTION } from '../../../utils/constants';
import styles from './HeroSection.module.css';

const HeroSection = () => {
  const [time, setTime] = useState(getLiveTime());
  const revealRef = useScrollReveal();

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(getLiveTime());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div ref={revealRef}>
      <SectionWrapper id="hero" className={styles.heroSection}>
        <div className={styles.hudTopLeft}>
          <HUDLabel text={getLocalCoordinates()} />
          <HUDLabel text={time} />
        </div>
        
        <div className={styles.centerContent}>
          <h1 className={styles.title}>
            VIRTUAL<br />ASTRONOMY OBSERVATORY
          </h1>
          <p className={styles.mission}>
            A centralized, real-time public access point to the cosmos.
          </p>
          <div className={styles.orgAttribution}>
            {ORG_ATTRIBUTION.map((line) => (
              <p key={line} className={styles.orgLine}>[ {line} ]</p>
            ))}
          </div>
          <div className={styles.scrollWrapper}>
            <ScrollIndicator />
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
};

export default HeroSection;
