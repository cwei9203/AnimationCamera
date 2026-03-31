import { File, Paths } from 'expo-file-system';

// 腾讯云智能识图配置
const TENCENT_SECRET_ID = process.env.TENCENT_SECRET_ID || '';
const TENCENT_SECRET_KEY = process.env.TENCENT_SECRET_KEY || '';

// remove.bg 配置
const REMOVE_BG_API_KEY = process.env.REMOVE_BG_API_KEY || '';

export interface RemoveBgResult {
  success: boolean;
  uri?: string;
  error?: string;
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  // RN/Expo 环境通常提供 btoa；如果缺失，这里会抛出，调用方会得到错误提示
  if (typeof btoa !== 'function') {
    throw new Error('运行环境不支持 btoa，无法转换抠图结果');
  }

  const bytes = new Uint8Array(buffer);
  const chunkSize = 0x8000;
  let binary = '';

  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode(...chunk);
  }

  return btoa(binary);
}

async function savePngToCache(base64: string): Promise<string> {
  const cacheDir = Paths.cache;
  const file = new File(cacheDir, `removebg-${Date.now()}.png`);

  // 覆盖写入，避免文件名冲突时抛错
  file.create({ intermediates: true, overwrite: true });
  file.write(base64, { encoding: 'base64' });
  return file.uri;
}

/**
 * 使用 remove.bg API 抠图
 * 免费额度：50次/月
 */
export async function removeBgWithRemoveBg(imageUri: string): Promise<RemoveBgResult> {
  try {
    if (!REMOVE_BG_API_KEY) {
      // 如果没有 API key，使用模拟模式
      console.warn('Remove.bg API key not set, using mock mode');
      return { success: true, uri: imageUri };
    }

    // 转换 URI 为 blob
    const response = await fetch(imageUri);
    const blob = await response.blob();

    const formData = new FormData();
    formData.append('image_file', blob, 'image.jpg');
    formData.append('size', 'auto');

    const apiResponse = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': REMOVE_BG_API_KEY,
      },
      body: formData,
    });

    if (!apiResponse.ok) {
      const error = await apiResponse.text();
      throw new Error(error);
    }

    // 获取结果图片并落盘为本地文件（避免 URL.createObjectURL 在 RN 中不可用）
    const resultBuffer = await apiResponse.arrayBuffer();
    const base64 = arrayBufferToBase64(resultBuffer);
    const resultUri = await savePngToCache(base64);

    return { success: true, uri: resultUri };
  } catch (error) {
    console.error('Remove.bg API error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '抠图失败',
    };
  }
}

/**
 * 使用腾讯云智能识图抠图
 * 免费额度：1000次/月
 */
export async function removeBgWithTencent(imageUri: string): Promise<RemoveBgResult> {
  try {
    // 腾讯云 API 需要签名，这里简化处理
    // 实际使用时需要实现签名逻辑
    console.warn('Tencent Cloud API not fully implemented, using mock mode');
    return { success: true, uri: imageUri };
  } catch (error) {
    console.error('Tencent Cloud API error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '抠图失败',
    };
  }
}

/**
 * 抠图主函数，自动选择可用的服务
 */
export async function removeBackground(imageUri: string): Promise<RemoveBgResult> {
  // 优先使用 remove.bg
  if (REMOVE_BG_API_KEY) {
    return removeBgWithRemoveBg(imageUri);
  }

  // 备选腾讯云
  if (TENCENT_SECRET_ID && TENCENT_SECRET_KEY) {
    return removeBgWithTencent(imageUri);
  }

  // 没有配置 API key，返回原图
  console.warn('No background removal API configured, returning original image');
  return { success: true, uri: imageUri };
}

/**
 * 检查是否有配置抠图 API
 */
export function hasRemoveBgConfig(): boolean {
  return !!(REMOVE_BG_API_KEY || (TENCENT_SECRET_ID && TENCENT_SECRET_KEY));
}
