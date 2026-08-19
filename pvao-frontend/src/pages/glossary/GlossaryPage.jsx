/**
 * Glossary page for the Virtual Astronomical Observatory.
 * Defines domain-specific terms used throughout the various modules.
 */
import React, { useState } from 'react';
import SectionWrapper from '../../components/common/SectionWrapper/SectionWrapper';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import styles from './GlossaryPage.module.css';

const glossaryData = [
  {
    category: "Lunar Observatory",
    terms: [
      { name: "Mare (Maria)", desc: "a large, dark, basaltic plain formed by ancient volcanic eruptions; Latin for \"sea,\" though there's no water." },
      { name: "Rima/Rimae", desc: "a long, narrow channel or crack in the lunar surface, resembling a fissure or ancient lava tube." },
      { name: "Statio", desc: "a \"landing site\" designation, used for historically significant locations such as crewed Apollo landing points." },
      { name: "Oceanus", desc: "Latin for \"ocean\"; used for the single largest mare-type feature on the Moon (Oceanus Procellarum)." },
      { name: "Mons/Montes", desc: "a mountain or mountain range." },
      { name: "Vallis", desc: "a valley, typically formed by ancient lava flow or impact processes." },
      { name: "Rupes", desc: "a scarp or cliff-like escarpment, often formed by fault lines." },
      { name: "Satellite Feature", desc: "a smaller named feature (usually a minor crater) located near and associated with a larger, primary named feature." },
      { name: "Copernican", desc: "the most recent lunar geologic period, characterized by craters with visible bright ray systems." },
      { name: "Eratosthenian", desc: "craters from this period have lost their bright rays but remain sharply defined." },
      { name: "Imbrian", desc: "period following the massive Imbrium impact basin formation; includes most visible mare basalt flows." },
      { name: "Nectarian", desc: "an earlier heavy bombardment period, named after the Nectaris basin." },
      { name: "Pre-Nectarian", desc: "the earliest geologic period, predating the Nectaris impact, includes the Moon's oldest surviving terrain." }
    ]
  },
  {
    category: "Solar Observatory",
    terms: [
      { name: "SDO AIA 171 Å", desc: "Extreme ultraviolet imagery showing the Sun's quiet corona and coronal loops." },
      { name: "SDO AIA 304 Å", desc: "Imagery of the chromosphere and transition region, showing cooler plasma and prominences." },
      { name: "SDO HMI Magnetogram", desc: "A map of the Sun's surface magnetic field polarity, used to track sunspots and active regions." },
      { name: "SOHO LASCO C3", desc: "A coronagraph image showing the Sun's outer corona by blocking the bright solar disk." },
      { name: "Solar Wind Speed", desc: "the velocity of charged particles streaming from the Sun's corona." },
      { name: "Proton Density", desc: "the concentration of protons in the solar wind at a given point." },
      { name: "X-ray Flux", desc: "the intensity of X-rays emitted by the Sun, used to classify solar flares." },
      { name: "Sunspot", desc: "a temporarily cooler, darker region on the Sun's surface caused by intense magnetic activity." },
      { name: "Active Region", desc: "an area of the Sun with concentrated magnetic fields, often producing sunspots and flares." },
      { name: "G-type main-sequence star (G2V)", desc: "the Sun's stellar classification; a \"yellow dwarf\" star fusing hydrogen into helium." },
      { name: "Coronal Heating Paradox", desc: "the unsolved puzzle of why the Sun's corona is far hotter than its visible surface." },
      { name: "Hale Cycle", desc: "the ~22-year solar magnetic cycle, during which the Sun's magnetic poles flip." },
      { name: "Magnetosphere", desc: "the region around a planet dominated by its magnetic field, shielding it from solar wind." }
    ]
  },
  {
    category: "Deep Sky Explorer",
    terms: [
      { name: "Nebula", desc: "a cloud of gas and dust in space, often a site of star formation." },
      { name: "Star Cluster", desc: "a group of stars gravitationally bound together, formed from the same molecular cloud." },
      { name: "Galaxy", desc: "a massive system of stars, gas, dust, and dark matter bound by gravity." },
      { name: "Redshift", desc: "the stretching of light to longer wavelengths as an object moves away, used to measure cosmic distance/velocity." },
      { name: "RA (Right Ascension) / Dec (Declination)", desc: "celestial coordinates, the sky's equivalent of longitude and latitude." }
    ]
  },
  {
    category: "Zenith (Sky Portal)",
    terms: [
      { name: "Constellation Lines", desc: "illustrative lines connecting stars to outline recognized constellation patterns." },
      { name: "Equatorial Grid", desc: "a coordinate overlay based on RA/Dec, used for celestial navigation." },
      { name: "Deep-Sky Object (DSO)", desc: "any astronomical object beyond our solar system, excluding individual stars (e.g. nebulae, galaxies, clusters)." }
    ]
  },
  {
    category: "Earth View / Light Pollution",
    terms: [
      { name: "Bortle Scale", desc: "a 9-level scale (Class 1–9) measuring night sky darkness/light pollution, from pristine dark skies to inner-city brightness." }
    ]
  },
  {
    category: "Astronomical Probe Tracker",
    terms: [
      { name: "Parker Solar Probe", desc: "a NASA spacecraft studying the Sun's outer corona at extremely close range." },
      { name: "Lunar Reconnaissance Orbiter (LRO)", desc: "a NASA orbiter mapping the Moon's surface in high resolution." },
      { name: "Mars Reconnaissance Orbiter (MRO)", desc: "a NASA orbiter studying Mars' climate, surface, and subsurface." },
      { name: "Hubble Space Telescope", desc: "a NASA/ESA space telescope observing in visible, UV, and near-infrared light." },
      { name: "Chandra X-ray Observatory", desc: "a NASA space telescope detecting X-ray emissions from high-energy cosmic phenomena." },
      { name: "TESS Observatory", desc: "a NASA satellite that searches for exoplanets by monitoring stars for periodic dimming." },
      { name: "Artemis I / Artemis II", desc: "NASA missions in the Artemis program aimed at returning humans to the Moon." },
      { name: "Solar Orbiter", desc: "an ESA/NASA spacecraft studying the Sun and inner heliosphere." },
      { name: "Aura Satellite", desc: "a NASA satellite monitoring Earth's atmosphere and ozone layer." },
      { name: "2001 Mars Odyssey", desc: "a NASA orbiter studying Mars' surface composition and searching for water ice." }
    ]
  }
];

const GlossaryPage = () => {
  const revealRef = useScrollReveal();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredData = glossaryData.map(categoryGroup => ({
    ...categoryGroup,
    terms: categoryGroup.terms.filter(term => 
      term.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      term.desc.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(categoryGroup => categoryGroup.terms.length > 0);

  return (
    <div ref={revealRef}>
      <SectionWrapper id="glossary" className={styles.glossarySection} overlay={false}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h2 className={styles.heading}>GLOSSARY</h2>
          </div>
          
          <div className={styles.searchContainer}>
            <input 
              type="text" 
              className={styles.searchInput} 
              placeholder="Search for terms or definitions..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className={styles.contentArea}>
            {filteredData.length > 0 ? (
              filteredData.map((categoryGroup, index) => (
                <div key={index} className={styles.categoryBlock}>
                  <h3 className={styles.categoryTitle}>{categoryGroup.category}</h3>
                  <div className={styles.strip}>
                    {categoryGroup.terms.map((term, idx) => (
                      <div key={idx} className={styles.termItem}>
                        <span className={styles.termName}>{term.name}</span>
                        <span className={styles.termDesc}>{term.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className={styles.noResults}>
                No terms found matching "{searchQuery}"
              </div>
            )}
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
};

export default GlossaryPage;
