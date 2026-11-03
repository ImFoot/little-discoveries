// New URLs deliberately bypass the original service worker's cached catalog
// and content, including during the first update before it relinquishes control.
export const catalogUrl='content/v2/catalog.json';
export const offlineManifestUrl='offline-manifest-v2.json';
export const levelUrl=(id:number)=>`content/v2/levels/${String(id).padStart(3,'0')}.json`;
