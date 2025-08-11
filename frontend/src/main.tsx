// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/App';

// Mock Service Worker setup removed for now
// Uncomment when ready to use MSW
// async function enableMocks() {
//   if (import.meta.env.DEV) {
//     const { worker } = await import('./mocks/browser');
//     await worker.start();
//   }
// }
// enableMocks();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
