// src/test/setupTests.ts
import '@testing-library/jest-dom';

// Polyfills for node environment
if (typeof globalThis.TextEncoder === 'undefined') {
  const util = require('util');
  globalThis.TextEncoder = util.TextEncoder;
  globalThis.TextDecoder = util.TextDecoder;
}

// Mock WebSocket
(globalThis as any).WebSocket = class WebSocket {
  constructor() {}
  send() {}
  close() {}
  addEventListener() {}
  removeEventListener() {}
};

// Mock window.location by removing the existing one completely
delete (window as any).location;
(window as any).location = {
  href: 'http://localhost:3000',
  assign: jest.fn(),
  replace: jest.fn(),
  reload: jest.fn(),
  pathname: '/',
  search: '',
  hash: '',
  hostname: 'localhost',
  port: '3000',
  protocol: 'http:',
  host: 'localhost:3000',
  origin: 'http://localhost:3000'
};