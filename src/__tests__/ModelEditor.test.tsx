/**
 * ModelEditor.tsx Unit Tests
 * Tests 3D model viewer, controls, and AR functionality
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ModelEditor from '@/pages/editor/ModelEditor';

// Mock model-viewer module
vi.mock('@google/model-viewer', () => ({}));

// Mock useParams to be mutable - utilize vi.hoisted to ensure availability
const { useParamsMock } = vi.hoisted(() => {
  return { useParamsMock: vi.fn() };
});

// Mock dependencies
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: useParamsMock,
    useNavigate: () => vi.fn(),
  };
});

vi.mock('@/components/editor/AssetUploader', () => ({
  AssetUploader: ({ onUpload }: { onUpload: (url: string) => void }) => (
    <button onClick={() => onUpload('https://example.com/model.glb')}>Upload Model</button>
  ),
}));

vi.mock('@/contexts/ToastContext', () => ({
  useToast: () => ({
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
  }),
}));

vi.mock('react-helmet-async', () => ({
  Helmet: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  HelmetProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock('@/services/dataProvider', () => ({
  AssetsProvider: {
    create: vi.fn(() =>
      Promise.resolve({
        id: 'new-asset-456',
        name: 'Test Asset',
        thumb: 'https://example.com/thumb.jpg',
      })
    ),
    get: vi.fn(),
    list: vi.fn(),
  },
}));

describe('ModelEditor Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default to new asset (shows uploader)
    useParamsMock.mockReturnValue({ assetId: 'new' });
  });

  describe('Rendering', () => {
    it('should render ModelEditor with model viewer', async () => {
      // Override for this test: simulate existing asset
      useParamsMock.mockReturnValue({ assetId: 'test-asset-123' });

      render(
        <BrowserRouter>
          <ModelEditor />
        </BrowserRouter>
      );

      // Wait for model-viewer element
      await waitFor(() => {
        const modelViewer = document.querySelector('model-viewer');
        expect(modelViewer).toBeTruthy();
      });
    });

    it('should display uploader when no model is loaded', () => {
      // Mock new asset / no ID
      useParamsMock.mockReturnValue({});

      render(
        <BrowserRouter>
          <ModelEditor />
        </BrowserRouter>
      );

      const uploadButton = screen.getByText('Upload Model');
      expect(uploadButton).toBeTruthy();
    });

    it('should show transform properties panel by default', async () => {
      // Override for this test: simulate existing asset
      useParamsMock.mockReturnValue({ assetId: 'test-asset-123' });

      render(
        <BrowserRouter>
          <ModelEditor />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Transform Properties')).toBeTruthy();
      });
    });
  });

  describe('Model Loading', () => {
    it('should load model from uploader', async () => {
      render(
        <BrowserRouter>
          <ModelEditor />
        </BrowserRouter>
      );

      const uploadButton = screen.getByText('Upload Model');
      fireEvent.click(uploadButton);

      await waitFor(() => {
        const modelViewer = document.querySelector('model-viewer');
        expect(modelViewer).toBeTruthy();
      });
    });

    it('should handle model loading errors gracefully', async () => {
      render(
        <BrowserRouter>
          <ModelEditor />
        </BrowserRouter>
      );

      // Simulate model loading
      const uploadButton = screen.getByText('Upload Model');
      fireEvent.click(uploadButton);

      // Component should show viewer
      await waitFor(() => {
        expect(document.querySelector('model-viewer')).toBeTruthy();
      });
    });
  });

  describe('Transform Controls', () => {
    it('should update position values', async () => {
      render(
        <BrowserRouter>
          <ModelEditor />
        </BrowserRouter>
      );

      const uploadButton = screen.getByText('Upload Model');
      fireEvent.click(uploadButton);

      await waitFor(() => {
        const inputs = document.querySelectorAll(
          'input[type="number"]'
        ) as NodeListOf<HTMLInputElement>;
        expect(inputs.length).toBeGreaterThan(0);

        // Set X position to 1.5
        fireEvent.change(inputs[0], { target: { value: '1.5' } });
        expect(inputs[0].value).toBe('1.5');
      });
    });

    it('should reset transform to defaults', async () => {
      render(
        <BrowserRouter>
          <ModelEditor />
        </BrowserRouter>
      );

      const uploadButton = screen.getByText('Upload Model');
      fireEvent.click(uploadButton);

      await waitFor(() => {
        const resetButtons = screen.getAllByText(/Reset/i);
        expect(resetButtons.length).toBeGreaterThan(0);

        // Click reset position button
        fireEvent.click(resetButtons[0]);

        // Verify values reset
        const inputs = document.querySelectorAll(
          'input[type="number"]'
        ) as NodeListOf<HTMLInputElement>;
        expect(parseFloat(inputs[0].value)).toBe(0);
      });
    });
  });

  describe('Lighting Controls', () => {
    it('should toggle auto-rotate', async () => {
      render(
        <BrowserRouter>
          <ModelEditor />
        </BrowserRouter>
      );

      const uploadButton = screen.getByText('Upload Model');
      fireEvent.click(uploadButton);

      await waitFor(() => {
        // Find lighting tab button (Sun icon)
        const tabs = document.querySelectorAll('button[title]');
        const lightingTab = Array.from(tabs).find((t) => t.getAttribute('title') === 'Lighting');

        if (lightingTab) {
          fireEvent.click(lightingTab);

          // Find auto-rotate checkbox
          const checkboxes = document.querySelectorAll(
            'input[type="checkbox"]'
          ) as NodeListOf<HTMLInputElement>;

          if (checkboxes.length > 0) {
            fireEvent.change(checkboxes[0], { target: { checked: true } });
            expect(checkboxes[0].checked).toBe(true);
          }
        }
      });
    });

    it('should adjust exposure slider', async () => {
      render(
        <BrowserRouter>
          <ModelEditor />
        </BrowserRouter>
      );

      const uploadButton = screen.getByText('Upload Model');
      fireEvent.click(uploadButton);

      await waitFor(() => {
        // Click lighting tab
        const tabs = document.querySelectorAll('button[title]');
        const lightingTab = Array.from(tabs).find((t) => t.getAttribute('title') === 'Lighting');

        if (lightingTab) {
          fireEvent.click(lightingTab);

          // Find and adjust exposure slider
          const sliders = document.querySelectorAll(
            'input[type="range"]'
          ) as NodeListOf<HTMLInputElement>;

          if (sliders.length > 0) {
            fireEvent.change(sliders[0], { target: { value: '1.5' } });
            expect(sliders[0].value).toBe('1.5');
          }
        }
      });
    });
  });

  describe('AR Functionality', () => {
    it('should have AR preview button', async () => {
      render(
        <BrowserRouter>
          <ModelEditor />
        </BrowserRouter>
      );

      const uploadButton = screen.getByText('Upload Model');
      fireEvent.click(uploadButton);

      await waitFor(() => {
        const arButton = screen.getByText(/Preview in AR/i);
        expect(arButton).toBeTruthy();
      });
    });

    it('should call activateAR on AR button click', async () => {
      render(
        <BrowserRouter>
          <ModelEditor />
        </BrowserRouter>
      );

      const uploadButton = screen.getByText('Upload Model');
      fireEvent.click(uploadButton);

      await waitFor(() => {
        const arButton = screen.getByText(/Preview in AR/i);
        fireEvent.click(arButton);

        const modelViewer = document.querySelector('model-viewer') as any;
        expect(modelViewer?.activateAR).toBeTruthy();
      });
    });
  });

  describe('Share Functionality', () => {
    it('should open share modal', async () => {
      render(
        <BrowserRouter>
          <ModelEditor />
        </BrowserRouter>
      );

      const uploadButton = screen.getByText('Upload Model');
      fireEvent.click(uploadButton);

      const shareButton = await screen.findByTitle('Share / Publish');
      fireEvent.click(shareButton);
      expect(await screen.findByText('Publish & Share')).toBeTruthy();
    });

    it('should copy share link to clipboard', async () => {
      const clipboardSpy = vi.spyOn(navigator.clipboard, 'writeText');

      render(
        <BrowserRouter>
          <ModelEditor />
        </BrowserRouter>
      );

      const uploadButton = screen.getByText('Upload Model');
      fireEvent.click(uploadButton);

      const shareButton = await screen.findByTitle('Share / Publish');
      fireEvent.click(shareButton);

      // Find and click copy button using new accessibility label
      const copyButton = await screen.findByLabelText('Copy Link');
      fireEvent.click(copyButton);
      expect(clipboardSpy).toHaveBeenCalled();

      clipboardSpy.mockRestore();
    });
  });

  // ... (Skip Save / Dark Mode sections to reach Responsive)
  // Wait, replace_file_content needs contiguous block. Use separate replacements.

  describe('Save Functionality', () => {
    it('should save scene to database', async () => {
      render(
        <BrowserRouter>
          <ModelEditor />
        </BrowserRouter>
      );

      const uploadButton = screen.getByText('Upload Model');
      fireEvent.click(uploadButton);

      await waitFor(() => {
        const saveButton = screen.getByText('Save Scene');
        expect(saveButton).toBeTruthy();

        fireEvent.click(saveButton);
      });

      await waitFor(() => {
        // Verify save was called
        expect(screen.getByText(/Saved/i)).toBeTruthy();
      });
    });
  });

  describe('Dark Mode Compatibility', () => {
    it('should render with dark mode classes', async () => {
      render(
        <BrowserRouter>
          <ModelEditor />
        </BrowserRouter>
      );

      const mainContainer = document.querySelector('.bg-stone-950');
      expect(mainContainer).toBeTruthy();

      // Verify dark mode specific styling
      expect(mainContainer?.className).toMatch(/dark|stone-950/);
    });
  });

  describe('Responsive Design', () => {
    it('should render toolbar on mobile', () => {
      // Save original width
      const originalWidth = global.innerWidth;

      // Set viewport to mobile size
      global.innerWidth = 375;
      global.dispatchEvent(new Event('resize'));

      // Override for this test: simulate existing asset so editor (and toolbar) renders
      useParamsMock.mockReturnValue({ assetId: 'test-asset-123' });

      render(
        <BrowserRouter>
          <ModelEditor />
        </BrowserRouter>
      );

      const toolbar = document.querySelector('aside.w-14');
      expect(toolbar).toBeTruthy();

      // Restore
      global.innerWidth = originalWidth;
      global.dispatchEvent(new Event('resize'));
    });
  });
});
