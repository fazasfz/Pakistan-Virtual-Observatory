import React from 'react';
import { NavLink } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import SectionWrapper from '../../../components/common/SectionWrapper/SectionWrapper';
import { useScrollReveal } from '../../../hooks/useScrollReveal';
import { PATHS } from '../../../routes/routePaths';
import styles from './ClosingSection.module.css';

const ClosingSection = () => {
  const revealRef = useScrollReveal();

  return (
    <div ref={revealRef}>
      <SectionWrapper id="closing" className={styles.closingSection}>
        <div className={styles.content}>
          <h2 className={styles.heading}>THE UNIVERSE AWAITS</h2>
          <p className={styles.subheading}>Initiate observation sequence and access the telemetry console.</p>
          <NavLink to={PATHS.SKY_PORTAL} className={styles.ctaButton}>
            START EXPLORING <ArrowRight size={20} />
          </NavLink>
        </div>
      </SectionWrapper>
    </div>
  );
};

export default ClosingSection;
