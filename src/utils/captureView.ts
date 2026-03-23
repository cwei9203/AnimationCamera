import { captureRef as nativeCaptureRef } from 'react-native-view-shot';

interface CaptureOptions {
  format?: 'png' | 'jpg' | 'webm';
  quality?: number;
  width?: number;
  height?: number;
}

/**
 * 捕获视图截图
 */
export async function captureRef(
  viewRef: React.RefObject<any>,
  options: CaptureOptions = {}
): Promise<string | null> {
  try {
    const uri = await nativeCaptureRef(viewRef, {
      format: options.format || 'png',
      quality: options.quality || 1,
      ...(options.width && { width: options.width }),
      ...(options.height && { height: options.height }),
    });
    return uri;
  } catch (error) {
    console.error('Capture failed:', error);
    return null;
  }
}
