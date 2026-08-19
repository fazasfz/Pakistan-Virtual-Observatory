/**
 * Static data store defining the available modules, their routes, and metadata.
 */
// pvao-frontend/src/pages/landing/data/modules.data.js
import imgZenith from '../../../assets/images/modules/sky-portal.jpg';
import imgAstronomicalProbe from '../../../assets/images/modules/astronomical-probe-tracker.jpg';
import imgSolarObservatory from '../../../assets/images/modules/solar-observatory.jpg';
import imgDeepSky from '../../../assets/images/modules/deep-sky.jpg';
import imgExora from '../../../assets/images/modules/exora-bg.jpg';
import imgLunar from '../../../assets/images/modules/lunar-bg.jpg';

export const modulesData = [
  { 
    id: 'solar-observatory', 
    name: 'Solar Observatory', 
    number: 'SEC.01',
    readout: 'WIND: 420.5 km/s', /* TODO: Wire up to live solar wind API */
    path: '/solar-observatory',
    description: 'Monitor near real-time telemetry from the Solar Dynamics Observatory (SDO).',
    bgImage: imgSolarObservatory
  },
  {
    id: 'lunar-observatory',
    name: 'Lunar Observatory',
    number: 'SEC.02',
    readout: 'PHASE: 98% WAXING', /* TODO: Wire up to live moon phase calculation */
    path: '/lunar-observatory',
    description: 'Explore the lunar surface using high-resolution orbital data and topological maps.',
    bgImage: imgLunar,
    sourceTag: 'NASA Goddard SVS • USGS Gazetteer'
  },
  { 
    id: 'exora', 
    name: 'Exora', 
    number: 'SEC.03',
    readout: 'EXOPLANETS: 5,602', /* TODO: Wire up to NASA Exoplanet Archive */
    path: '/exora',
    description: 'Discover scientifically-grounded atmospheric and topological models of known exoplanets.',
    bgImage: imgExora,
    externalUrl: 'https://exora-placeholder-url.com',
    sourceTag: 'NASA Data Explorer • Digital Observatory'
  },
  { 
    id: 'deep-sky-explorer', 
    name: 'Deep Sky Explorer', 
    number: 'SEC.04',
    readout: 'TARGETS: 24,101', /* TODO: Wire up to deep sky catalog count */
    path: '/deep-sky-explorer',
    description: 'Examine distant nebulae and galactic structures using deep-sky survey data.',
    bgImage: imgDeepSky
  },
  { 
    id: 'zenith', 
    name: 'Zenith', 
    number: 'SEC.05',
    readout: 'VISIBLE: 1,402 OBJS', /* TODO: Wire up to active Stellarium object count */
    path: '/zenith',
    description: 'Navigate the night sky from any global coordinate in real-time.',
    bgImage: imgZenith
  },
  { 
    id: 'astronomical-probe-tracker', 
    name: 'Astronomical Probes', 
    number: 'SEC.06',
    readout: 'ACTIVE: 34 PROBES', /* TODO: Wire up to JPL Horizons data */
    path: '/astronomical-probe-tracker',
    description: 'Track the active telemetry and heliocentric trajectories of deep space probes.',
    bgImage: imgAstronomicalProbe
  }
];
