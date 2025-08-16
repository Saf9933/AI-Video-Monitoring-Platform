// src/data/system/settings.client.ts
import { mockSystemSettingsClient } from './settings.mock';
import { liveSystemSettingsClient } from './settings.live';
import type { SystemSettingsClient } from './settings.types';

export function getSystemSettingsClient(): SystemSettingsClient {
  const dataMode = import.meta.env.VITE_DATA_MODE || 'mock';
  
  switch (dataMode) {
    case 'live':
      return liveSystemSettingsClient;
    case 'mock':
    default:
      return mockSystemSettingsClient;
  }
}

// Re-export types for convenience
export type * from './settings.types';