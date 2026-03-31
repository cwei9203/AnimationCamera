import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { StatusBar } from 'expo-status-bar';
import Slider from '@react-native-community/slider';
import { CameraScreenProps } from '../types';
import { useSession } from '../session/sessionStore';
import { Button, Card, Screen, TopBar } from '../ui/components';
import { theme } from '../ui/theme';

export default function CameraScreen({ navigation }: CameraScreenProps) {
  // 所有 Hooks 必须在组件顶部统一调用，不能有条件分支
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('back');
  const [isProcessing, setIsProcessing] = useState(false);

  const cameraRef = useRef<CameraView>(null);
  const { state, dispatch } = useSession();

  // 所有 callback hooks
  const pickReferenceImage = useCallback(async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [3, 4],
      quality: 1,
    });

    if (!result.canceled) {
      dispatch({ type: 'setReferenceImage', uri: result.assets[0].uri });
    }
  }, [dispatch]);

  const takePicture = useCallback(async () => {
    if (!cameraRef.current) return;

    setIsProcessing(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 1,
        skipProcessing: false,
      });

      if (photo) {
        dispatch({ type: 'setBackgroundImage', uri: photo.uri });
        navigation.navigate('Character');
      }
    } catch (error) {
      Alert.alert('拍照失败', '请重试');
    } finally {
      setIsProcessing(false);
    }
  }, [dispatch, navigation]);

  const toggleCameraFacing = useCallback(() => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }, []);

  const toggleGrid = useCallback(() => {
    dispatch({ type: 'toggleGrid' });
  }, [dispatch]);

  // 权限检查放到所有 hooks 之后
  if (!permission?.granted) {
    return (
      <Screen>
        <TopBar title="次元穿梭" />
        <View style={styles.permissionWrap}>
          <Card>
            <Text style={styles.permissionTitle}>需要相机权限</Text>
            <Text style={styles.permissionDesc}>用于拍摄背景照片与实时取景预览。</Text>
            <View style={styles.permissionActions}>
              <Button label="授予权限" onPress={requestPermission} />
            </View>
          </Card>
        </View>
      </Screen>
    );
  }

  return (
    <Screen safe={false}>
      <StatusBar style="dark" />

      <CameraView ref={cameraRef} style={styles.camera} facing={facing} mode="picture">
        {!!state.referenceImageUri && (
          <View style={styles.overlayContainer}>
            <Image
              source={{ uri: state.referenceImageUri }}
              style={[styles.overlayImage, { opacity: state.referenceOpacity }]}
              resizeMode="contain"
            />
          </View>
        )}

        {state.showGrid && (
          <View pointerEvents="none" style={styles.grid}>
            <View style={[styles.gridRow, { top: '33.333%' }]} />
            <View style={[styles.gridRow, { top: '66.666%' }]} />
            <View style={styles.gridColWrap}>
              <View style={styles.gridCol} />
              <View style={styles.gridCol} />
              <View style={styles.gridColNoBorder} />
            </View>
          </View>
        )}
      </CameraView>

      <View style={styles.topBarWrap}>
        <TopBar
          title="取景"
          left={{ label: '翻转', onPress: toggleCameraFacing }}
          right={{ label: state.showGrid ? '网格开' : '网格关', onPress: toggleGrid }}
        />
      </View>

      <View style={styles.bottomPanel}>
        <Card>
          <View style={styles.row}>
            <View style={styles.flex}>
              <Text style={styles.hintTitle}>参考图</Text>
              <Text style={styles.hintDesc}>用于对齐场景角度，拍完会进入选角。</Text>
            </View>
            <Button
              label={state.referenceImageUri ? '更换' : '添加'}
              onPress={pickReferenceImage}
              variant="secondary"
            />
          </View>

          {!!state.referenceImageUri && (
            <View style={styles.sliderSection}>
              <View style={styles.sliderHeader}>
                <Text style={styles.sliderLabel}>透明度</Text>
                <Text style={styles.sliderValue}>{Math.round(state.referenceOpacity * 100)}%</Text>
              </View>
              <Slider
                style={styles.slider}
                value={state.referenceOpacity}
                onValueChange={value => dispatch({ type: 'setReferenceOpacity', opacity: value })}
                minimumValue={0}
                maximumValue={1}
                step={0.01}
                minimumTrackTintColor={theme.colors.tint}
                maximumTrackTintColor={theme.colors.border}
                thumbTintColor={theme.colors.tint}
              />
            </View>
          )}

          <View style={styles.captureRow}>
            <Button
              label={isProcessing ? '处理中…' : '拍照'}
              onPress={takePicture}
              disabled={isProcessing}
            />
          </View>
        </Card>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  camera: {
    flex: 1,
  },
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayImage: {
    width: '100%',
    height: '100%',
  },
  topBarWrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  bottomPanel: {
    position: 'absolute',
    left: theme.space.lg,
    right: theme.space.lg,
    bottom: theme.space.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.md,
  },
  flex: {
    flex: 1,
  },
  hintTitle: {
    fontSize: theme.textSize.md,
    fontWeight: '700',
    color: theme.colors.text,
  },
  hintDesc: {
    marginTop: 2,
    fontSize: theme.textSize.sm,
    color: theme.colors.textSecondary,
  },
  sliderSection: {
    marginTop: theme.space.md,
  },
  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.space.sm,
  },
  sliderLabel: {
    color: theme.colors.textSecondary,
    fontSize: theme.textSize.sm,
    fontWeight: '600',
  },
  sliderValue: {
    color: theme.colors.text,
    fontSize: theme.textSize.sm,
    fontWeight: '700',
  },
  slider: {
    width: '100%',
    height: 36,
  },
  captureRow: {
    marginTop: theme.space.lg,
  },
  grid: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
  },
  gridRow: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.30)',
  },
  gridColWrap: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
  },
  gridCol: {
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: 'rgba(255,255,255,0.30)',
  },
  gridColNoBorder: {
    flex: 1,
  },
  permissionWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.space.xl,
  },
  permissionTitle: {
    fontSize: theme.textSize.lg,
    fontWeight: '800',
    color: theme.colors.text,
    letterSpacing: 0.2,
  },
  permissionDesc: {
    marginTop: theme.space.sm,
    fontSize: theme.textSize.sm,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  permissionActions: {
    marginTop: theme.space.lg,
  },
});
