const paths:Record<string,string>={
 back:'<path d="m14 6-6 6 6 6"/>',next:'<path d="m9 6 6 6-6 6"/>',
 close:'<path d="m6 6 12 12M6 18 18 6"/>',plus:'<path d="M12 5v14M5 12h14"/>',minus:'<path d="M5 12h14"/>',
 search:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4 4"/>',
 settings:'<path d="M4 7h16M4 17h16"/><circle cx="9" cy="7" r="3" fill="currentColor"/><circle cx="15" cy="17" r="3" fill="currentColor"/>',
 heart:'<path d="M20.7 5.7a5 5 0 0 0-7.1 0L12 7.3l-1.6-1.6a5 5 0 0 0-7.1 7.1L12 21l8.7-8.2a5 5 0 0 0 0-7.1Z"/>',
 check:'<path d="m5 12 4 4L19 6"/>',grid:'<rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><rect x="14" y="14" width="6" height="6" rx="1"/>',
 book:'<path d="M12 5v15M3 4c4-1 6 0 9 2 3-2 5-3 9-2v14c-4-1-6 0-9 2-3-2-5-3-9-2Z"/>',
 leaf:'<path d="M5 19C0 9 8 2 21 3c0 13-8 19-16 16ZM5 19 17 7"/>',
 hint:'<path d="M9 18h6M10 21h4M8 14c-5-5-2-12 4-12s9 7 4 12l-1 2H9Z"/>',
 eye:'<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
 fit:'<path d="M8 3H3v5M16 3h5v5M21 16v5h-5M8 21H3v-5"/>',
 download:'<path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"/>',
 upload:'<path d="M12 16V4m-5 5 5-5 5 5M4 16v5h16v-5"/>',
 sun:'<circle cx="12" cy="12" r="4"/><path d="M12 1v2M12 21v2M1 12h2M21 12h2M4 4l2 2M18 18l2 2M4 20l2-2M18 6l2-2"/>',
 flower:'<path d="M12 20v-7m0 4c-4-4-7-2-7-2s1 5 7 5m0-3c4-4 7-2 7-2s-1 5-7 5"/><path d="M12 4c-4-6-8 0-5 3-6 1-3 7 1 6 2 5 6 5 8 0 4 1 7-5 1-6 3-3-1-9-5-3Z"/>',
 replay:'<path d="M3 10a9 9 0 1 1 1 8M3 3v7h7"/>',
};
export const icon=(name:string,cls='')=>`<svg class="icon ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]??paths.flower}</svg>`;
