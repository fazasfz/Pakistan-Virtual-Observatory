/**
 * Static curated catalog of well-known deep sky objects (Messier objects).
 * Used as a default dataset before falling back to live MAST/NED queries.
 */
// A small curated catalog of well-known deep sky objects, grouped by type.
// Later this can be replaced/expanded with live MAST/NED queries.

export const objectCatalog = {
  galaxies: [
    { name: 'Andromeda Galaxy', id: 'M31' },
    { name: 'Whirlpool Galaxy', id: 'M51' },
    { name: 'Sombrero Galaxy', id: 'M104' },
    { name: 'Pinwheel Galaxy', id: 'M101' },
  ],
  nebulas: [
    { name: 'Orion Nebula', id: 'M42' },
    { name: 'Ring Nebula', id: 'M57' },
    { name: 'Crab Nebula', id: 'M1' },
    { name: 'Eagle Nebula', id: 'M16' },
  ],
  starClusters: [
    { name: 'Pleiades', id: 'M45' },
    { name: 'Hercules Cluster', id: 'M13' },
    { name: 'Beehive Cluster', id: 'M44' },
    { name: 'Wild Duck Cluster', id: 'M11' },
  ],
};