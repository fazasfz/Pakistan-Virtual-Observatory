import React, { useState, useEffect } from 'react';
import SectionWrapper from '../../../components/common/SectionWrapper/SectionWrapper';
import HUDLabel from '../../../components/common/HUDLabel/HUDLabel';
import { useScrollReveal } from '../../../hooks/useScrollReveal';
import { getLocalCoordinates, getLiveTime } from '../../../utils/formatCoordinates';
import { ORG_ATTRIBUTION } from '../../../utils/constants';
import { useScroll, useTransform, motion } from 'framer-motion';
import styles from './HeroSection.module.css';

const HeroSection = () => {
  const [time, setTime] = useState(getLiveTime());
  const heroRef = React.useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const gradientPosition = useTransform(scrollYProgress, [0, 1], ['100%', '0%']);
  const revealRef = useScrollReveal();

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(getLiveTime());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div ref={revealRef}>
      <div ref={heroRef}>
        <SectionWrapper id="hero" className={styles.heroSection}>
        <div className={styles.hudTopLeft}>
          <HUDLabel text={getLocalCoordinates()} />
          <HUDLabel text={time} />
        </div>
        
        <div className={styles.centerContent}>
          <div className={styles.titleWrapper}>
            <motion.h1 
              className={styles.title}
              style={{ '--gradient-position': gradientPosition }}
              data-text={"VIRTUAL\nASTRONOMY OBSERVATORY"}
            >
              {"VIRTUAL\nASTRONOMY OBSERVATORY"}
            </motion.h1>
          </div>
          <p className={styles.mission}>
            A centralized, real-time public access point to the cosmos.
          </p>
          <div className={styles.orgAttribution}>
            {ORG_ATTRIBUTION.map((line) => (
              <p key={line} className={styles.orgLine}>{line}</p>
            ))}
          </div>
        </div>
        </SectionWrapper>
      </div>
    </div>
  );
};

export default HeroSection;
