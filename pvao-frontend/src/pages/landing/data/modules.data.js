// pvao-frontend/src/pages/landing/data/modules.data.js
import imgSkyPortal from '../../../assets/images/modules/sky-portal.jpg';
import imgSatellite from '../../../assets/images/modules/satellite-tracker.jpg';
import imgSolarObservatory from '../../../assets/images/modules/solar-observatory.jpg';
import imgEarth from '../../../assets/images/modules/earth.jpg';
import imgDeepSky from '../../../assets/images/modules/deep-sky.jpg';
import imgExovista from '../../../assets/images/modules/exovista.jpg';
import imgSolarSystem from '../../../assets/images/modules/solar-system.jpg';
import imgObservationPlanner from '../../../assets/images/modules/observation-planner.jpg';

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
    id: 'satellite-tracker', 
    number: 'MOD.02', 
    name: 'Satellite Tracker', 
    path: '/satellite-tracker',
    description: 'Track the positions and orbits of satellites circling the Earth.',
    bgImage: imgSatellite
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
    id: 'exovista', 
    number: 'MOD.06', 
    name: 'ExoVista', 
    path: '/exovista',
    description: 'Explore worlds beyond our solar system',
    bgImage: imgExovista,
    externalUrl: 'https://exovista-placeholder-url.com',
    sourceTag: 'NASA Data Explorer • Digital Observatory'
  },
  { 
    id: 'solar-system-simulator', 
    number: 'MOD.07', 
    name: 'Solar System Simulator', 
    path: '/solar-system-simulator',
    description: 'Simulate planetary alignments and near-earth object tracking.',
    bgImage: imgSolarSystem,
    externalUrl: 'https://solar-system-simulator-placeholder-url.com',
    sourceTag: 'JPL Orbit Simulator • Real-time Physics Engine'
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
    bgImage: imgSkyPortal,
    sourceTag: 'NASA Goddard SVS • USGS Gazetteer'
  }
];
