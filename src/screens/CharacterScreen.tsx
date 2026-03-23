import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { CharacterScreenProps, Character } from '../types';
import { removeBackground, hasRemoveBgConfig } from '../services/removeBgApi';

// 内置角色数据（使用占位图）
const BUILTIN_CHARACTERS: Character[] = [
  { id: '1', name: '宫水三叶', source: 'builtin', uri: 'https://via.placeholder.com/300x400/667eea/ffffff?text=三叶' },
  { id: '2', name: '立花泷', source: 'builtin', uri: 'https://via.placeholder.com/300x400/764ba2/ffffff?text=泷' },
  { id: '3', name: '铃芽', source: 'builtin', uri: 'https://via.placeholder.com/300x400/f093fb/ffffff?text=铃芽' },
  { id: '4', name: '草太', source: 'builtin', uri: 'https://via.placeholder.com/300x400/4facfe/ffffff?text=草太' },
];

export default function CharacterScreen({ route, navigation }: CharacterScreenProps) {
  const { backgroundImage } = route.params;
  const [activeTab, setActiveTab] = useState<'popular' | 'uploaded' | 'cutout'>('popular');
  const [characters, setCharacters] = useState<Character[]>(BUILTIN_CHARACTERS);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const uploadCharacter = useCallback(async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [3, 4],
      quality: 1,
    });

    if (!result.canceled) {
      const newCharacter: Character = {
        id: Date.now().toString(),
        name: '自定义角色',
        source: 'uploaded',
        uri: result.assets[0].uri,
      };
      setCharacters(prev => [newCharacter, ...prev]);
      setActiveTab('uploaded');
    }
  }, []);

  const cutoutCharacter = useCallback(async () => {
    // 检查是否有配置抠图 API
    if (!hasRemoveBgConfig()) {
      Alert.alert(
        '配置 needed',
        '请先配置 REMOVE_BG_API_KEY 或腾讯云 API 密钥才能使用抠图功能',
        [
          { text: '知道了', style: 'default' },
        ]
      );
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [3, 4],
      quality: 1,
    });

    if (!result.canceled) {
      setIsProcessing(true);
      try {
        // 调用抠图 API
        const cutoutResult = await removeBackground(result.assets[0].uri);

        if (!cutoutResult.success) {
          Alert.alert('抠图失败', cutoutResult.error || '请重试');
          return;
        }

        const newCharacter: Character = {
          id: Date.now().toString(),
          name: '抠图角色',
          source: 'uploaded',
          uri: cutoutResult.uri || result.assets[0].uri,
        };
        setCharacters(prev => [newCharacter, ...prev]);
        setActiveTab('cutout');
        Alert.alert('抠图完成', '角色已添加到"抠图"分类');
      } catch (error) {
        Alert.alert('抠图失败', error instanceof Error ? error.message : '请重试');
      } finally {
        setIsProcessing(false);
      }
    }
  }, []);

  const confirmSelection = useCallback(() => {
    if (!selectedCharacter) {
      Alert.alert('提示', '请先选择一个角色');
      return;
    }

    navigation.navigate('Result', {
      backgroundImage,
      characterImage: selectedCharacter.uri,
    });
  }, [selectedCharacter, backgroundImage, navigation]);

  const renderCharacterItem = useCallback(({ item }: { item: Character }) => (
    <TouchableOpacity
      style={[
        styles.characterItem,
        selectedCharacter?.id === item.id && styles.selectedItem,
      ]}
      onPress={() => setSelectedCharacter(item)}
    >
      <Image source={{ uri: item.uri }} style={styles.characterImage} />
      <Text style={styles.characterName}>{item.name}</Text>
      {selectedCharacter?.id === item.id && (
        <View style={styles.selectedIndicator}>
          <Text style={styles.checkmark}>✓</Text>
        </View>
      )}
    </TouchableOpacity>
  ), [selectedCharacter]);

  return (
    <View style={styles.container}>
      {/* 背景预览 */}
      <View style={styles.previewContainer}>
        <Image source={{ uri: backgroundImage }} style={styles.previewImage} />
      </View>

      {/* Tab 切换 */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'popular' && styles.activeTab]}
          onPress={() => setActiveTab('popular')}
        >
          <Text style={[styles.tabText, activeTab === 'popular' && styles.activeTabText]}>
            热门
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'uploaded' && styles.activeTab]}
          onPress={() => setActiveTab('uploaded')}
        >
          <Text style={[styles.tabText, activeTab === 'uploaded' && styles.activeTabText]}>
            我的上传
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'cutout' && styles.activeTab]}
          onPress={() => setActiveTab('cutout')}
        >
          <Text style={[styles.tabText, activeTab === 'cutout' && styles.activeTabText]}>
            抠图
          </Text>
        </TouchableOpacity>
      </View>

      {/* 操作按钮 */}
      <View style={styles.actionContainer}>
        {activeTab === 'uploaded' && (
          <TouchableOpacity style={styles.actionButton} onPress={uploadCharacter}>
            <Text style={styles.actionButtonText}>+ 上传角色</Text>
          </TouchableOpacity>
        )}
        {activeTab === 'cutout' && (
          <TouchableOpacity style={styles.actionButton} onPress={cutoutCharacter}>
            <Text style={styles.actionButtonText}>+ 抠图</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* 角色列表 */}
      {isProcessing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#667eea" />
          <Text style={styles.loadingText}>正在处理...</Text>
        </View>
      ) : (
        <FlatList
          data={characters}
          renderItem={renderCharacterItem}
          keyExtractor={item => item.id}
          numColumns={3}
          contentContainerStyle={styles.gridContainer}
        />
      )}

      {/* 确认按钮 */}
      <TouchableOpacity
        style={[styles.confirmButton, !selectedCharacter && styles.confirmButtonDisabled]}
        onPress={confirmSelection}
        disabled={!selectedCharacter}
      >
        <Text style={styles.confirmButtonText}>确认选择</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  previewContainer: {
    height: 200,
    backgroundColor: '#0f0f1a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a3e',
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: '#667eea',
  },
  tabText: {
    color: '#888',
    fontSize: 14,
    fontWeight: '500',
  },
  activeTabText: {
    color: '#fff',
  },
  actionContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  actionButton: {
    backgroundColor: '#2a2a3e',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  actionButtonText: {
    color: '#667eea',
    fontSize: 14,
    fontWeight: '600',
  },
  gridContainer: {
    padding: 12,
  },
  characterItem: {
    flex: 1,
    aspectRatio: 0.75,
    margin: 6,
    backgroundColor: '#2a2a3e',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedItem: {
    borderColor: '#667eea',
  },
  characterImage: {
    width: '100%',
    height: '70%',
    backgroundColor: '#333',
  },
  characterName: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
    paddingVertical: 8,
  },
  selectedIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#667eea',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#888',
    fontSize: 14,
    marginTop: 12,
  },
  confirmButton: {
    backgroundColor: '#667eea',
    marginHorizontal: 16,
    marginVertical: 16,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmButtonDisabled: {
    backgroundColor: '#3a3a4e',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
