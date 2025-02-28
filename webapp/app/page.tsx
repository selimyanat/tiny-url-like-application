'use client';

import React, { Suspense } from 'react';
import { URLShortener } from '@/components/url-shortener/ui/URLShortener';

const RootPage = () => {
  return (
    <main
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
      }}
    >
      <Suspense fallback={<p>Loading...</p>}>
        <URLShortener />
      </Suspense>
    </main>
  );
};

export default RootPage;
