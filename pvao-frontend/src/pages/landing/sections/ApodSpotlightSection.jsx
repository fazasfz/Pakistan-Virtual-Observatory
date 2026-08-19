import React, { useState, useEffect } from 'react';
import { Row, Col } from 'antd';
import { fetchAPOD } from '../../../api/nasaApi';
import SectionWrapper from '../../../components/common/SectionWrapper/SectionWrapper';
import HUDLabel from '../../../components/common/HUDLabel/HUDLabel';
import styles from './ApodSpotlightSection.module.css';

const FALLBACK_APOD = 'https://images-assets.nasa.gov/image/PIA12348/PIA12348~orig.jpg';

const ApodSpotlightSection = () => {
  const [apodData, setApodData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let mounted = true;
    fetchAPOD()
      .then(data => {
        if (mounted) {
          setApodData(data);
          setLoading(false);
        }
      })
      .catch(err => {
        console.error('APOD fetch failed on landing:', err);
        if (mounted) {
          setError(true);
          setLoading(false);
        }
      });
    return () => { mounted = false; };
  }, []);

  const apodUrl = error ? FALLBACK_APOD : (apodData?.hdurl || apodData?.url || FALLBACK_APOD);
  const apodTitle = apodData?.title || "The Pillars of Creation (M16)";
  
  // Create a truncated description if needed, or use full
  let descriptionSnippet = apodData?.explanation || "A daily glimpse into the cosmos provided by NASA.";
  if (descriptionSnippet.length > 250) {
    descriptionSnippet = descriptionSnippet.substring(0, 250) + '...';
  }

  return (
    <SectionWrapper id="apod-spotlight" className={styles.apodSection} overlay={false}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.heading}>ASTRONOMY PICTURE OF THE DAY</h2>
          <HUDLabel text="LIVE FEED // NASA APOD" />
        </div>

        <div className={styles.cinematicContainer}>
          <div className={styles.imageWrapper}>
            <img 
              src={apodUrl} 
              alt={apodTitle} 
              className={styles.apodImage}
              onError={(e) => { e.target.src = FALLBACK_APOD; }} 
            />
            <div className={styles.imageOverlay}></div>
          </div>
          
          <div className={styles.glassPanel}>
            <h3 className={styles.apodTitle}>{apodTitle}</h3>
            {apodData?.date && <p className={styles.apodDate}>{apodData.date}</p>}
            <p className={styles.apodDesc}>{descriptionSnippet}</p>
            {apodData?.copyright && <p className={styles.apodCopyright}>© {apodData.copyright}</p>}
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
};

export default ApodSpotlightSection;
