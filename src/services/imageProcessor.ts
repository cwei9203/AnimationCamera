import * as ImageManipulator from 'expo-image-manipulator';
import { Platform } from 'react-native';

export interface CompositeOptions {
  backgroundUri: string;
  characterUri: string;
  characterPosition?: {
    x: number;
    y: number;
  };
  characterSize?: {
    width: number;
    height: number;
  };
}

/**
 * 合成背景图和角色图
 */
export async function compositeImages(options: CompositeOptions): Promise<string> {
  const { backgroundUri, characterUri, characterPosition, characterSize } = options;

  try {
    // 1. 获取背景图尺寸
    const background = await ImageManipulator.manipulateAsync(
      backgroundUri,
      [],
      { format: ImageManipulator.SaveFormat.PNG }
    );

    // 2. 准备角色图（缩放）
    const manipulations: ImageManipulator.Action[] = [];

    if (characterSize) {
      manipulations.push({
        resize: {
          width: Math.round(characterSize.width),
          height: Math.round(characterSize.height),
        },
      });
    }

    const resizedCharacter = await ImageManipulator.manipulateAsync(
      characterUri,
      manipulations,
      { format: ImageManipulator.SaveFormat.PNG }
    );

    // 3. 合成图片
    // 注意：expo-image-manipulator 不直接支持 overlay
    // 我们需要使用其他方式，比如在 React Native 中使用 View 叠加然后截图
    // 或者使用 canvas（web）/原生模块

    // 目前返回处理后的角色图 URI
    // 真正的合成需要在 ResultScreen 中使用 View 叠加来实现
    return resizedCharacter.uri;
  } catch (error) {
    console.error('Image composition failed:', error);
    throw new Error('图片合成失败');
  }
}

/**
 * 调整图片尺寸
 */
export async function resizeImage(
  uri: string,
  width: number,
  height: number
): Promise<string> {
  const result = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width, height } }],
    { format: ImageManipulator.SaveFormat.PNG }
  );
  return result.uri;
}

/**
 * 压缩图片
 */
export async function compressImage(
  uri: string,
  quality: number = 0.8
): Promise<string> {
  const result = await ImageManipulator.manipulateAsync(
    uri,
    [],
    { format: ImageManipulator.SaveFormat.JPEG, compress: quality }
  );
  return result.uri;
}
