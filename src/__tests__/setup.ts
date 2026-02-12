/**
 * Vitest Setup File
 * Configured globals and test environment setup
 */

import { afterEach, beforeEach, vi } from 'vitest';
import React from 'react';

// Mock window.matchMedia for dark mode tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
global.localStorage = localStorageMock as any;

// Mock model-viewer element (only define if not already defined)
if (!customElements.get('model-viewer')) {
  customElements.define(
    'model-viewer',
    class extends HTMLElement {
      src: string | null = null;
      'camera-controls': boolean = false;
      'auto-rotate': boolean = false;
      'shadow-intensity': string = '1';
      exposure: string = '1';
      ar: boolean = false;

      activateAR(): Promise<void> {
        return Promise.resolve();
      }

      connectedCallback() {
        // Mock model viewer initialization
      }
    }
  );
}

// Reset all mocks after each test
afterEach(() => {
  vi.clearAllMocks();
  localStorageMock.getItem.mockClear();
  localStorageMock.setItem.mockClear();
  localStorageMock.removeItem.mockClear();
  localStorageMock.clear.mockClear();
});
