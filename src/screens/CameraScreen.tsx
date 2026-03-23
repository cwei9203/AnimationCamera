import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { StatusBar } from 'expo-status-bar';
import Slider from '@react-native-community/slider';
import { CameraScreenProps } from '../types';

export default function CameraScreen({ navigation }: CameraScreenProps) {
  // 所有 Hooks 必须在组件顶部统一调用，不能有条件分支
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('back');
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [opacity, setOpacity] = useState(0.5);
  const [isProcessing, setIsProcessing] = useState(false);

  const cameraRef = useRef<CameraView>(null);

  // 所有 callback hooks
  const pickReferenceImage = useCallback(async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [3, 4],
      quality: 1,
    });

    if (!result.canceled) {
      setReferenceImage(result.assets[0].uri);
    }
  }, []);

  const takePicture = useCallback(async () => {
    if (!cameraRef.current) return;

    setIsProcessing(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 1,
        skipProcessing: false,
      });

      if (photo) {
        navigation.navigate('Character', { backgroundImage: photo.uri });
      }
    } catch (error) {
      Alert.alert('拍照失败', '请重试');
    } finally {
      setIsProcessing(false);
    }
  }, [navigation]);

  const toggleCameraFacing = useCallback(() => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }, []);

  // 权限检查放到所有 hooks 之后
  if (!permission?.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>需要相机权限才能使用</Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>授予权限</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Camera View */}
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={facing}
        mode="picture"
      >
        {/* Reference Image Overlay */}
        {referenceImage && (
          <View style={styles.overlayContainer}>
            <Image
              source={{ uri: referenceImage }}
              style={[styles.overlayImage, { opacity }]}
              resizeMode="contain"
            />
          </View>
        )}
      </CameraView>

      {/* Top Controls */}
      <View style={styles.topControls}>
        <TouchableOpacity style={styles.iconButton} onPress={toggleCameraFacing}>
          <Text style={styles.iconText}>🔄</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.referenceButton} onPress={pickReferenceImage}>
          <Text style={styles.referenceButtonText}>
            {referenceImage ? '更换参考图' : '添加参考图'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Opacity Control with Real Slider */}
      {referenceImage && (
        <View style={styles.opacityControl}>
          <View style={styles.opacityHeader}>
            <Text style={styles.opacityLabel}>参考图透明度</Text>
            <Text style={styles.opacityValue}>{Math.round(opacity * 100)}%</Text>
          </View>
          <Slider
            style={styles.slider}
            value={opacity}
            onValueChange={setOpacity}
            minimumValue={0}
            maximumValue={1}
            step={0.01}
            minimumTrackTintColor="#667eea"
            maximumTrackTintColor="rgba(255,255,255,0.3)"
            thumbTintColor="#fff"
          />
        </View>
      )}

      {/* Bottom Controls */}
      <View style={styles.bottomControls}>
        <TouchableOpacity
          style={styles.captureButton}
          onPress={takePicture}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <ActivityIndicator color="#fff" size="large" />
          ) : (
            <View style={styles.captureButtonInner} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
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
  topControls: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 20,
  },
  referenceButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 20,
  },
  referenceButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  opacityControl: {
    position: 'absolute',
    bottom: 140,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 16,
    padding: 16,
  },
  opacityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  opacityLabel: {
    color: '#fff',
    fontSize: 14,
  },
  opacityValue: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  bottomControls: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  captureButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#fff',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    padding: 20,
  },
  permissionText: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  permissionButton: {
    backgroundColor: '#667eea',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  permissionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
