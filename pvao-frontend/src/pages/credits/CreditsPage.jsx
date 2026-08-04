import React from 'react';
import { Row, Col } from 'antd';
import SectionWrapper from '../../components/common/SectionWrapper/SectionWrapper';
import HUDLabel from '../../components/common/HUDLabel/HUDLabel';
import { contributors } from './data/contributors.data';
import styles from './CreditsPage.module.css';

const CreditsPage = () => {
  const supervisors = contributors.filter(c => c.role === 'Supervisor');
  const interns = contributors.filter(c => c.role === 'Intern');

  return (
    <SectionWrapper id="credits" className={styles.creditsPage} overlay={false}>
      <div className={styles.header}>
        <HUDLabel text="SYS.00 // ACKNOWLEDGEMENTS" />
        <h1 className={styles.heading}>MISSION CONTRIBUTORS</h1>
        <p className={styles.description}>
          Personnel responsible for the engineering and scientific operations of the VAO system.
        </p>
      </div>

      <div className={styles.content}>
        {supervisors.length > 0 && (
          <div className={styles.roleGroup}>
            <h2 className={styles.roleHeading}>SUPERVISORY BOARD</h2>
            <Row gutter={[24, 24]}>
              {supervisors.map((person, idx) => (
                <Col xs={24} md={12} key={`sup-${idx}`}>
                  <div className={styles.personCard}>
                    <h3 className={styles.name}>{person.name || '[ TBD ]'}</h3>
                    <p className={styles.degree}>{person.degree || '[ DATA PENDING ]'}</p>
                    {person.module && <span className={styles.moduleTag}>{person.module}</span>}
                  </div>
                </Col>
              ))}
            </Row>
          </div>
        )}

        {interns.length > 0 && (
          <div className={styles.roleGroup}>
            <h2 className={styles.roleHeading}>ENGINEERING & RESEARCH INTERNS</h2>
            <Row gutter={[16, 16]}>
              {interns.map((person, idx) => (
                <Col xs={24} sm={12} md={8} key={`int-${idx}`}>
                  <div className={styles.personCard}>
                    <h3 className={styles.name}>{person.name || '[ TBD ]'}</h3>
                    <p className={styles.degree}>{person.degree || '[ DATA PENDING ]'}</p>
                    {person.module && <span className={styles.moduleTag}>{person.module}</span>}
                  </div>
                </Col>
              ))}
            </Row>
          </div>
        )}
      </div>
    </SectionWrapper>
  );
};

export default CreditsPage;
