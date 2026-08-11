// pvao-frontend/src/pages/landing/data/modules.data.js
import imgSkyPortal from '../../../assets/images/modules/sky-portal.jpg';
import imgAstronomicalProbe from '../../../assets/images/modules/astronomical-probe-tracker.jpg';
import imgSolarObservatory from '../../../assets/images/modules/solar-observatory.jpg';
import imgEarth from '../../../assets/images/modules/earth.jpg';
import imgDeepSky from '../../../assets/images/modules/deep-sky.jpg';
import imgExora from '../../../assets/images/modules/exora-bg.jpg';
import imgSolarSystem from '../../../assets/images/modules/solar-system.jpg';
import imgObservationPlanner from '../../../assets/images/modules/observation-planner.jpg';
import imgLunar from '../../../assets/images/modules/lunar-bg.jpg';

export const modulesData = [
  { 
    id: 'sky-portal', 
    number: 'MOD.01', 
    name: 'Sky Portal', 
    path: '/sky-portal',
    description: 'Monitor orbital telemetry and observe local atmospheric conditions in real-time.',
    bgImage: imgSkyPortal
  },
  { 
    id: 'astronomical-probe-tracker', 
    number: 'MOD.02', 
    name: 'Astronomical Probe Tracker', 
    path: '/astronomical-probe-tracker',
    description: 'Track the positions and orbits of satellites circling the Earth.',
    bgImage: imgAstronomicalProbe
  },
  { 
    id: 'solar-observatory', 
    number: 'MOD.03', 
    name: 'Solar Observatory', 
    path: '/solar-observatory',
    description: 'Solar dynamics and detailed observations of our Sun.',
    bgImage: imgSolarObservatory
  },
  { 
    id: 'earth-view', 
    number: 'MOD.04', 
    name: 'Earth View', 
    path: '/earth-view',
    description: 'High-resolution real-time views of Earth from space.',
    bgImage: imgEarth
  },
  { 
    id: 'deep-sky-explorer', 
    number: 'MOD.05', 
    name: 'Deep Sky Explorer', 
    path: '/deep-sky-explorer',
    description: 'Access deep-sky surveys and galactic spectroscopy archives.',
    bgImage: imgDeepSky
  },
  { 
    id: 'exora', 
    category: 'DEEP COSMOS & EXOPLANET', 
    name: 'Exora', 
    path: '/exora',
    description: 'Explore visually stunning, scientifically accurate renderings of known exoplanets based on transit data.',
    bgImage: imgExora,
    externalUrl: 'https://exora-placeholder-url.com',
    sourceTag: 'NASA Data Explorer • Digital Observatory'
  },
  { 
    id: 'solar-system-simulator', 
    number: 'MOD.07', 
    name: 'Solar System Simulator', 
    path: '/solar-system-simulator',
    description: 'Simulate planetary alignments and near-earth object tracking.',
    bgImage: imgSolarSystem,
    externalUrl: 'https://dynamix209.github.io/solar-system-orbital-simulator/',
    sourceTag: 'Community Orbital Simulator • Open Source'
  },
  { 
    id: 'observation-planner', 
    number: 'MOD.08', 
    name: 'Observation Planner', 
    path: '/observation-planner',
    description: 'Plan and schedule your astronomical observations.',
    bgImage: imgObservationPlanner,
    externalUrl: 'https://observation-planner-placeholder-url.com',
    sourceTag: 'Global Telescope Network • Scheduling System'
  },
  {
    id: 'lunar-observatory',
    number: 'MOD.09',
    name: 'Lunar Observatory',
    path: '/lunar-observatory',
    description: 'Live moon data and interactive 3D lunar surface map.',
    bgImage: imgLunar,
    sourceTag: 'NASA Goddard SVS • USGS Gazetteer'
  }
];
