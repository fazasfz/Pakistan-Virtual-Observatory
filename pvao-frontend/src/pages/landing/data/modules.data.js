// pvao-frontend/src/pages/landing/data/modules.data.js
export const modulesData = [
  {
    id: '01',
    name: 'EARTH & ATMOSPHERE',
    description: 'Monitor orbital telemetry, track satellites, and observe local atmospheric conditions in real-time.',
    subPages: ['Night Sky Portal', 'Earth View', 'Satellite Tracker'],
    linkTo: '/earth-atmosphere',
    bgImage: 'https://images-assets.nasa.gov/image/PIA18033/PIA18033~orig.jpg' // Real Earth image
  },
  {
    id: '02',
    name: 'HELIOS & PLANETS',
    description: 'Solar dynamics, planetary alignments, and near-earth object tracking across our solar system.',
    subPages: ['Solar System Simulator', 'Solar Observatory'],
    linkTo: '/helios-planets',
    bgImage: 'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e000790/GSFC_20171208_Archive_e000790~orig.jpg' // Real Solar Dynamics Observatory image
  },
  {
    id: '03',
    name: 'DEEP COSMOS',
    description: 'Access deep-sky surveys, exoplanet transit data, and galactic spectroscopy archives.',
    subPages: ['ExoVista', 'Deep Sky Explorer'],
    linkTo: '/deep-cosmos-exoplanet',
    bgImage: 'https://images-assets.nasa.gov/image/carina_nebula/carina_nebula~orig.jpg' // Real JWST/Hubble Carina Nebula image
  },
  {
    id: '04',
    name: 'INTELLIGENT CORE',
    description: 'AI-assisted observatory operations and natural language data querying system.',
    subPages: ['Astro Copilot'],
    linkTo: '/intelligent-core',
    bgImage: 'https://images-assets.nasa.gov/image/PIA23408/PIA23408~orig.jpg' // Real rover/instrument tech image
  }
];
