import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  Dimensions,
  Share,
  PanResponder,
  GestureResponderEvent,
  PanResponderGestureState,
} from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ResultScreenProps } from '../types';
import { captureRef } from '../utils/captureView';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// 角色默认尺寸
const DEFAULT_WIDTH = 150;
const DEFAULT_HEIGHT = 200;

interface Position {
  x: number;
  y: number;
}

export default function ResultScreen({ route, navigation }: ResultScreenProps) {
  const { backgroundImage, characterImage } = route.params;
  const [isSaving, setIsSaving] = useState(false);

  // 用于截图的 ref
  const compositeViewRef = useRef<View>(null);

  // 角色位置和缩放
  const [position, setPosition] = useState<Position>({
    x: SCREEN_WIDTH / 2 - DEFAULT_WIDTH / 2,
    y: SCREEN_HEIGHT / 2 - DEFAULT_HEIGHT / 2,
  });
  const [scale, setScale] = useState(1);

  // 拖拽时的临时位置
  const tempPositionRef = useRef<Position>(position);

  // 创建 PanResponder 处理拖拽
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,

      onPanResponderGrant: () => {
        tempPositionRef.current = { ...position };
      },

      onPanResponderMove: (
        _: GestureResponderEvent,
        gestureState: PanResponderGestureState
      ) => {
        const newX = tempPositionRef.current.x + gestureState.dx;
        const newY = tempPositionRef.current.y + gestureState.dy;

        // 边界限制（留出一些余地）
        const maxX = SCREEN_WIDTH - DEFAULT_WIDTH * scale * 0.5;
        const maxY = SCREEN_HEIGHT - DEFAULT_HEIGHT * scale * 0.5;
        const minX = -DEFAULT_WIDTH * scale * 0.5;
        const minY = -DEFAULT_HEIGHT * scale * 0.5;

        setPosition({
          x: Math.max(minX, Math.min(maxX, newX)),
          y: Math.max(minY, Math.min(maxY, newY)),
        });
      },

      onPanResponderRelease: () => {
        tempPositionRef.current = { ...position };
      },
    })
  ).current;

  // 缩放功能
  const zoomIn = useCallback(() => {
    setScale(prev => Math.min(prev + 0.2, 3));
  }, []);

  const zoomOut = useCallback(() => {
    setScale(prev => Math.max(prev - 0.2, 0.3));
  }, []);

  const resetPosition = useCallback(() => {
    setPosition({
      x: SCREEN_WIDTH / 2 - DEFAULT_WIDTH / 2,
      y: SCREEN_HEIGHT / 2 - DEFAULT_HEIGHT / 2,
    });
    setScale(1);
  }, []);

  // 请求相册权限
  const requestPermission = useCallback(async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    return status === 'granted';
  }, []);

  // 保存到相册
  const saveToAlbum = useCallback(async () => {
    if (!compositeViewRef.current) {
      Alert.alert('错误', '无法获取合成视图');
      return;
    }

    const hasPermission = await requestPermission();
    if (!hasPermission) {
      Alert.alert('权限不足', '需要相册权限才能保存图片');
      return;
    }

    setIsSaving(true);
    try {
      const uri = await captureRef(compositeViewRef, {
        format: 'png',
        quality: 1,
      });

      if (uri) {
        await MediaLibrary.saveToLibraryAsync(uri);
        Alert.alert('保存成功', '图片已保存到相册');
      }
    } catch (error) {
      console.error('Save error:', error);
      Alert.alert('保存失败', '请重试');
    } finally {
      setIsSaving(false);
    }
  }, [requestPermission]);

  // 分享图片
  const shareImage = useCallback(async () => {
    if (!compositeViewRef.current) {
      Alert.alert('错误', '无法获取合成视图');
      return;
    }

    try {
      const uri = await captureRef(compositeViewRef, {
        format: 'png',
        quality: 1,
      });

      if (uri) {
        await Share.share({
          url: uri,
          message: '我用"次元穿梭"App 创造了这个次元融合作品！',
        });
      }
    } catch (error) {
      console.error('Share error:', error);
      Alert.alert('分享失败', '请重试');
    }
  }, []);

  const retake = useCallback(() => {
    navigation.navigate('Camera');
  }, [navigation]);

  return (
    <GestureHandlerRootView style={styles.container}>
      {/* 合成预览区域 */}
      <View style={styles.previewContainer}>
        <View ref={compositeViewRef} style={styles.compositeView}>
          {/* 背景图 */}
          <Image source={{ uri: backgroundImage }} style={styles.backgroundImage} />

          {/* 可拖拽的角色图 */}
          <View
            style={[
              styles.characterContainer,
              {
                left: position.x,
                top: position.y,
                width: DEFAULT_WIDTH * scale,
                height: DEFAULT_HEIGHT * scale,
              },
            ]}
            {...panResponder.panHandlers}
          >
            <Image
              source={{ uri: characterImage }}
              style={styles.characterImage}
              resizeMode="contain"
            />
            {/* 拖拽指示器 */}
            <View style={styles.dragIndicator}>
              <Text style={styles.dragIndicatorText}>👆 拖拽</Text>
            </View>
          </View>
        </View>

        {/* 缩放控制按钮 */}
        <View style={styles.zoomControls}>
          <TouchableOpacity style={styles.zoomButton} onPress={zoomIn}>
            <Text style={styles.zoomButtonText}>➕</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.zoomButton} onPress={zoomOut}>
            <Text style={styles.zoomButtonText}>➖</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.resetButton} onPress={resetPosition}>
            <Text style={styles.resetButtonText}>↺ 重置</Text>
          </TouchableOpacity>
        </View>

        {/* 提示文字 */}
        <View style={styles.tipOverlay}>
          <Text style={styles.tipText}>👆 拖拽移动角色位置</Text>
          <Text style={styles.tipText}>➕➖ 按钮调整大小</Text>
          <Text style={styles.scaleText}>当前缩放: {Math.round(scale * 100)}%</Text>
        </View>
      </View>

      {/* 操作按钮 */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.primaryButton]}
          onPress={shareImage}
          disabled={isSaving}
        >
          <Text style={styles.primaryButtonText}>📤 分享作品</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.secondaryButton]}
          onPress={saveToAlbum}
          disabled={isSaving}
        >
          {isSaving ? (
            <ActivityIndicator color="#333" />
          ) : (
            <Text style={styles.secondaryButtonText}>💾 保存到相册</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.secondaryButton]}
          onPress={retake}
        >
          <Text style={styles.secondaryButtonText}>🔄 重新拍摄</Text>
        </TouchableOpacity>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  previewContainer: {
    flex: 1,
    backgroundColor: '#0f0f1a',
    position: 'relative',
  },
  compositeView: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  characterContainer: {
    position: 'absolute',
    backgroundColor: 'transparent',
  },
  characterImage: {
    width: '100%',
    height: '100%',
  },
  dragIndicator: {
    position: 'absolute',
    bottom: -25,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  dragIndicatorText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  zoomControls: {
    position: 'absolute',
    right: 16,
    top: 100,
    gap: 8,
  },
  zoomButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  zoomButtonText: {
    fontSize: 20,
  },
  resetButton: {
    width: 44,
    height: 60,
    borderRadius: 22,
    backgroundColor: 'rgba(102,126,234,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  tipOverlay: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 12,
    padding: 12,
  },
  tipText: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
    marginVertical: 2,
  },
  scaleText: {
    color: '#667eea',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
    fontWeight: '600',
  },
  actionsContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  actionButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButton: {
    backgroundColor: '#667eea',
  },
  secondaryButton: {
    backgroundColor: '#f0f0f0',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
});
