// Release-specific filenames bypass an already-installed cache-first worker.
// Keep level/art URLs stable so adding a sample never changes prior pictures.
export const catalogUrl='content/v3/catalog-56.json';
export const offlineManifestUrl='offline-manifest-v3-56.json';
export const levelUrl=(id:number)=>`content/v3/levels/${String(id).padStart(3,'0')}.json`;
