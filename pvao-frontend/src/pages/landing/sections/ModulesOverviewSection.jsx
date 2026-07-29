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
          <HUDLabel text="SEC.02 // SYSTEM MODULES" />
          <h2 className={styles.heading}>OPERATIONAL SECTORS</h2>
        </div>

        <Row gutter={[24, 24]} className={styles.grid}>
          {modulesData.map((mod) => (
            <Col xs={24} md={12} key={mod.id} className={styles.col}>
              <ModuleCard 
                number={mod.number}
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
