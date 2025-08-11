// src/services/api/devices.ts
import { http } from '../http';
import type { Device } from '../../types/api';
export const listDevices = async (): Promise<Device[]> => (await http.get('/devices')).data;
