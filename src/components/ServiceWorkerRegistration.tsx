'use client';

import { useEffect } from 'react';

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          console.log('[FK] Service worker registered:', reg.scope);
        })
        .catch((err) => {
          console.warn('[FK] Service worker registration failed:', err);
        });
    }
  }, []);

  return null;
}
