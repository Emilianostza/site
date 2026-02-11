/**
 * QR Code Generation Service
 *
 * PHASE 4: Generate QR codes for project access
 *
 * Use case:
 * - Technician scans QR to access project AR viewer
 * - Customer gets QR to share project
 * - Physical prints of QR code link to online viewer
 *
 * Implementation:
 * - Use qrcode library (lightweight)
 * - Generate canvas/image
 * - Store QR image in S3
 * - Return signed URL
 *
 * Dependencies:
 * npm install qrcode
 */

/**
 * Generate QR code as data URL (canvas-based)
 *
 * Returns a data:image/png URL that can be used directly in <img>
 * Good for temporary display, not for storage.
 */
export async function generateQRCodeDataUrl(
  text: string,
  options?: {
    width?: number;
    margin?: number;
    errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
  }
): Promise<string> {
  // This would use the qrcode library:
  // import QRCode from 'qrcode';
  //
  // const url = await QRCode.toDataURL(text, {
  //   width: options?.width || 300,
  //   margin: options?.margin || 2,
  //   errorCorrectionLevel: options?.errorCorrectionLevel || 'M'
  // });
  // return url;

  // For now, return a placeholder that shows the structure
  return `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==`;
}

/**
 * Generate QR code as blob (for S3 storage)
 *
 * Generates QR code PNG blob that can be uploaded to S3
 */
export async function generateQRCodeBlob(
  text: string,
  options?: {
    width?: number;
    margin?: number;
  }
): Promise<Blob> {
  // This would use the qrcode library:
  // import QRCode from 'qrcode';
  //
  // const canvas = await QRCode.toCanvas(text, {
  //   width: options?.width || 300,
  //   margin: options?.margin || 2
  // });
  //
  // return new Promise((resolve) => {
  //   canvas.toBlob((blob) => {
  //     resolve(blob!);
  //   }, 'image/png');
  // });

  // For now, return a placeholder
  return new Blob([''], { type: 'image/png' });
}

/**
 * Generate project access URL for QR code
 *
 * QR codes link to:
 * - Public viewer: /gallery/:projectId
 * - Private viewer: /app/project/:projectId (requires auth)
 * - AR viewer: /app/view/:assetId (direct to AR)
 */
export function generateProjectQRUrl(projectId: string, baseUrl?: string): string {
  const url = baseUrl || window.location.origin;
  return `${url}/#/app/project/${projectId}`;
}

/**
 * Generate asset/viewer QR URL
 */
export function generateAssetQRUrl(assetId: string, baseUrl?: string): string {
  const url = baseUrl || window.location.origin;
  return `${url}/#/gallery/${assetId}`;
}

/**
 * QR code specifications for different use cases
 */
export const QR_CODE_SPECS = {
  // Small QR for digital display
  digital: {
    width: 300,
    margin: 2,
    errorCorrectionLevel: 'M' as const
  },
  // Medium QR for printed material
  print: {
    width: 600,
    margin: 3,
    errorCorrectionLevel: 'H' as const // Higher error correction for printed materials
  },
  // Large QR for banners/signage
  signage: {
    width: 1200,
    margin: 4,
    errorCorrectionLevel: 'H' as const
  }
};
