import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
  Dimensions,
  Share,
} from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, runOnJS } from 'react-native-reanimated';
import { ResultScreenProps } from '../types';
import { captureRef } from '../utils/captureView';
import { useSession } from '../session/sessionStore';
import { Button, Card, Screen, TopBar } from '../ui/components';
import { theme } from '../ui/theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// 角色默认尺寸
const DEFAULT_WIDTH = 150;
const DEFAULT_HEIGHT = 200;

export default function ResultScreen({ navigation }: ResultScreenProps) {
  const { state, dispatch } = useSession();
  const backgroundImage = state.backgroundImageUri;
  const characterImage = state.characterImageUri;
  const [isSaving, setIsSaving] = useState(false);
  useEffect(() => {
    if (!backgroundImage) {
      navigation.replace('Camera');
      return;
    }
    if (!characterImage) {
      navigation.replace('Character');
    }
  }, [backgroundImage, characterImage, navigation]);


  // 用于截图的 ref
  const compositeViewRef = useRef<View>(null);

  // 用 shared values 以获得顺滑手势体验
  const tx = useSharedValue(state.characterTransform.x || (SCREEN_WIDTH / 2 - DEFAULT_WIDTH / 2));
  const ty = useSharedValue(state.characterTransform.y || (SCREEN_HEIGHT / 2 - DEFAULT_HEIGHT / 2));
  const scale = useSharedValue(state.characterTransform.scale || 1);
  const rotation = useSharedValue(state.characterTransform.rotation || 0);

  const baseTx = useSharedValue(tx.value);
  const baseTy = useSharedValue(ty.value);
  const baseScale = useSharedValue(scale.value);
  const baseRotation = useSharedValue(rotation.value);

  const persistTransform = useCallback(() => {
    dispatch({
      type: 'setCharacterTransform',
      transform: {
        x: tx.value,
        y: ty.value,
        scale: scale.value,
        rotation: rotation.value,
      },
    });
  }, [dispatch, rotation, scale, tx, ty]);

  const pan = Gesture.Pan()
    .onBegin(() => {
      baseTx.value = tx.value;
      baseTy.value = ty.value;
    })
    .onChange(e => {
      tx.value = baseTx.value + e.translationX;
      ty.value = baseTy.value + e.translationY;
    })
    .onFinalize(() => {
      runOnJS(persistTransform)();
    });

  const pinch = Gesture.Pinch()
    .onBegin(() => {
      baseScale.value = scale.value;
    })
    .onUpdate(e => {
      scale.value = Math.max(0.3, Math.min(3, baseScale.value * e.scale));
    })
    .onFinalize(() => {
      runOnJS(persistTransform)();
    });

  const rotate = Gesture.Rotation()
    .onBegin(() => {
      baseRotation.value = rotation.value;
    })
    .onUpdate(e => {
      rotation.value = baseRotation.value + e.rotation;
    })
    .onFinalize(() => {
      runOnJS(persistTransform)();
    });

  const transformGesture = Gesture.Simultaneous(pan, pinch, rotate);

  const characterStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: tx.value },
        { translateY: ty.value },
        { rotateZ: `${rotation.value}rad` },
        { scale: scale.value },
      ],
    };
  });

  const resetTransform = useCallback(() => {
    const x = SCREEN_WIDTH / 2 - DEFAULT_WIDTH / 2;
    const y = SCREEN_HEIGHT / 2 - DEFAULT_HEIGHT / 2;
    tx.value = x;
    ty.value = y;
    scale.value = 1;
    rotation.value = 0;
    dispatch({ type: 'resetCharacterTransform' });
  }, [dispatch, rotation, scale, tx, ty]);

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
    dispatch({ type: 'resetSession' });
    navigation.navigate('Camera');
  }, [dispatch, navigation]);

  return (
    <GestureHandlerRootView style={styles.root}>
      <Screen>
        <TopBar title="合成" left={{ label: '返回', onPress: () => navigation.goBack() }} right={{ label: '重置', onPress: resetTransform }} />

        <View style={styles.previewWrap}>
          <View ref={compositeViewRef} style={styles.compositeView}>
            {!!backgroundImage && <Image source={{ uri: backgroundImage }} style={styles.backgroundImage} />}

            <GestureDetector gesture={transformGesture}>
              <Animated.View style={[styles.characterContainer, characterStyle]}>
                <Image source={{ uri: characterImage || '' }} style={styles.characterImage} resizeMode="contain" />
              </Animated.View>
            </GestureDetector>
          </View>

          <View style={styles.hint}>
            <Text style={styles.hintText}>拖拽移动 · 双指缩放 · 旋转</Text>
          </View>
        </View>

        <View style={styles.bottom}>
          <Card>
            <View style={styles.actionRow}>
              <Button label="分享" onPress={shareImage} variant="secondary" disabled={isSaving} />
              <Button label={isSaving ? '保存中…' : '保存到相册'} onPress={saveToAlbum} disabled={isSaving} />
            </View>
            <View style={styles.secondaryRow}>
              <Button label="重新拍摄" onPress={retake} variant="ghost" />
            </View>
          </Card>
        </View>
      </Screen>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  previewWrap: {
    flex: 1,
    position: 'relative',
    marginHorizontal: theme.space.lg,
    marginTop: theme.space.sm,
    borderRadius: theme.radius.lg,
    overflow: 'hidden',
    backgroundColor: theme.colors.border,
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
    left: 0,
    top: 0,
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT,
    backgroundColor: 'transparent',
  },
  characterImage: {
    width: '100%',
    height: '100%',
  },
  hint: {
    position: 'absolute',
    left: theme.space.md,
    top: theme.space.md,
    backgroundColor: 'rgba(255,255,255,0.90)',
    borderRadius: theme.radius.pill,
    paddingHorizontal: theme.space.md,
    paddingVertical: theme.space.sm,
  },
  hintText: {
    color: theme.colors.text,
    fontSize: theme.textSize.sm,
    fontWeight: '700',
  },
  bottom: {
    paddingHorizontal: theme.space.lg,
    paddingVertical: theme.space.lg,
  },
  actionRow: {
    flexDirection: 'row',
    gap: theme.space.md,
  },
  secondaryRow: {
    marginTop: theme.space.sm,
  },
});
