export type OverlayTransform = {
  x: number;
  y: number;
  scale: number;
  rotation: number; // radians
};

export type ExportCrop = 'original' | 'square' | 'portrait-3-4';

export type ExportSettings = {
  scale: 1 | 2;
  crop: ExportCrop;
};

export type SessionState = {
  // Camera
  referenceImageUri: string | null;
  referenceOpacity: number; // 0..1
  showGrid: boolean;

  // Captured background
  backgroundImageUri: string | null;

  // Character
  characterImageUri: string | null;

  // Composite editing
  characterTransform: OverlayTransform;

  // Export
  exportSettings: ExportSettings;
};

export type SessionAction =
  | { type: 'setReferenceImage'; uri: string | null }
  | { type: 'setReferenceOpacity'; opacity: number }
  | { type: 'toggleGrid' }
  | { type: 'setBackgroundImage'; uri: string | null }
  | { type: 'setCharacterImage'; uri: string | null }
  | { type: 'setCharacterTransform'; transform: OverlayTransform }
  | { type: 'setExportSettings'; settings: ExportSettings }
  | { type: 'resetSession' }
  | { type: 'resetCharacterTransform' };

export const defaultCharacterTransform: OverlayTransform = {
  x: 0,
  y: 0,
  scale: 1,
  rotation: 0,
};

export const defaultSessionState: SessionState = {
  referenceImageUri: null,
  referenceOpacity: 0.5,
  showGrid: true,
  backgroundImageUri: null,
  characterImageUri: null,
  characterTransform: defaultCharacterTransform,
  exportSettings: {
    scale: 1,
    crop: 'original',
  },
};

