/**
 * Landing page section rendering a grid of ModuleCards for navigation.
 */
import React from 'react';
import { Row, Col } from 'antd';
import SectionWrapper from '../../../components/common/SectionWrapper/SectionWrapper';
import HUDLabel from '../../../components/common/HUDLabel/HUDLabel';
import ModuleCard from '../../../components/common/ModuleCard/ModuleCard';
import { useScrollReveal } from '../../../hooks/useScrollReveal';
import { modulesData } from '../data/modules.data';
import styles from './ModulesOverviewSection.module.css';

const ModulesOverviewSection = () => {
  const revealRef = useScrollReveal();

  return (
    <div ref={revealRef}>
      <SectionWrapper id="modules" className={styles.modulesSection} overlay={false}>
        <div className={styles.header}>
          <h2 className={styles.heading}>NAVIGATE THE COSMOS</h2>
          <p className={styles.subhead}>SIX INSTRUMENTS. ONE SKY.</p>
        </div>

        <Row gutter={[24, 24]} className={styles.grid}>
          {modulesData.map((mod) => (
            <Col xs={24} md={12} key={mod.id} className={styles.col}>
              <ModuleCard 
                name={mod.name}
                description={mod.description}
                linkTo={mod.path}
                bgImage={mod.bgImage}
              />
            </Col>
          ))}
        </Row>
      </SectionWrapper>
    </div>
  );
};

export default ModulesOverviewSection;
