/**
 * Landing page section highlighting the integrated data sources (e.g., NASA APOD).
 * Fetches and displays the Astronomy Picture of the Day.
 */
import React, { useEffect, useState } from 'react';
import { Row, Col } from 'antd';
import SectionWrapper from '../../../components/common/SectionWrapper/SectionWrapper';
import HUDLabel from '../../../components/common/HUDLabel/HUDLabel';
import Loader from '../../../components/common/Loader/Loader';
import { useScrollReveal } from '../../../hooks/useScrollReveal';
import { fetchAPOD } from '../../../api/nasaApi';
import styles from './DataSourcesSection.module.css';

const FALLBACK_APOD = 'https://images-assets.nasa.gov/image/PIA12348/PIA12348~orig.jpg';

const DataSourcesSection = () => {
  const revealRef = useScrollReveal();
  const [apodData, setApodData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let mounted = true;
    fetchAPOD()
      .then((data) => {
        if (mounted) {
          setApodData(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error(err);
        if (mounted) {
          setError(true);
          setLoading(false);
        }
      });
    return () => { mounted = false; };
  }, []);

  const sources = [
    { name: 'NASA NeoWs', desc: 'Near Earth Object Web Service' },
    { name: 'STELLARIUM / SKYFIELD', desc: 'Ephemeris & Sky-position Data' },
    { name: 'CELESTRAK', desc: 'Satellite TLE Feeds' },
    { name: 'JWST MAST', desc: 'Mikulski Archive for Space Telescopes' },
  ];

  const apodUrl = error ? FALLBACK_APOD : (apodData?.hdurl || apodData?.url || FALLBACK_APOD);
  const apodTitle = error ? "OFFLINE: SHOWING ARCHIVE" : (apodData?.title || "NASA ASTRONOMY PICTURE OF THE DAY");

  return (
    <div ref={revealRef}>
      <SectionWrapper id="data-sources" className={styles.dataSection} overlay={false}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h2 className={styles.heading}>TELEMETRY SOURCES</h2>
          </div>
          
          <Row gutter={[48, 48]} className={styles.contentRow}>
            <Col xs={24} lg={14} className={styles.apodCol}>
              <div className={styles.apodCard}>
                {loading ? (
                  <div className={styles.skeletonContainer}>
                    <Loader />
                  </div>
                ) : (
                  <>
                    <img 
                      src={apodUrl} 
                      alt={apodTitle} 
                      className={styles.apodImage}
                      onError={(e) => { e.target.src = FALLBACK_APOD; }} 
                    />
                    <div className={styles.apodOverlay}>
                      <HUDLabel text="LIVE FEED // NASA APOD" className={styles.apodBadge} />
                      <h3 className={styles.apodTitle}>{apodTitle}</h3>
                    </div>
                  </>
                )}
              </div>
            </Col>

            <Col xs={24} lg={10} className={styles.listCol}>
              <div className={styles.strip}>
                {sources.map((src, idx) => (
                  <div key={idx} className={styles.sourceItem}>
                    <span className={styles.sourceName}>{src.name}</span>
                    <span className={styles.sourceDesc}>{src.desc}</span>
                  </div>
                ))}
              </div>
            </Col>
          </Row>
        </div>
      </SectionWrapper>
    </div>
  );
};

export default DataSourcesSection;
