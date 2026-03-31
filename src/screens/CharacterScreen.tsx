import React, { useMemo, useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { CharacterScreenProps, Character } from '../types';
import { removeBackground, hasRemoveBgConfig } from '../services/removeBgApi';
import { useSession } from '../session/sessionStore';
import { Button, Screen, SegmentedControl, TopBar } from '../ui/components';
import { theme } from '../ui/theme';

// 内置角色数据（使用占位图）
const BUILTIN_CHARACTERS: Character[] = [
  { id: '1', name: '宫水三叶', source: 'builtin', uri: 'https://via.placeholder.com/300x400/667eea/ffffff?text=三叶' },
  { id: '2', name: '立花泷', source: 'builtin', uri: 'https://via.placeholder.com/300x400/764ba2/ffffff?text=泷' },
  { id: '3', name: '铃芽', source: 'builtin', uri: 'https://via.placeholder.com/300x400/f093fb/ffffff?text=铃芽' },
  { id: '4', name: '草太', source: 'builtin', uri: 'https://via.placeholder.com/300x400/4facfe/ffffff?text=草太' },
];

export default function CharacterScreen({ navigation }: CharacterScreenProps) {
  const { state, dispatch } = useSession();
  const backgroundImage = state.backgroundImageUri;
  const [activeTab, setActiveTab] = useState<'popular' | 'uploaded' | 'cutout'>('popular');
  const [uploadedCharacters, setUploadedCharacters] = useState<Character[]>([]);
  const [cutoutCharacters, setCutoutCharacters] = useState<Character[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (backgroundImage) return;
    navigation.replace('Camera');
  }, [backgroundImage, navigation]);

  const visibleCharacters = useMemo<Character[]>(() => {
    if (activeTab === 'popular') return BUILTIN_CHARACTERS;
    if (activeTab === 'uploaded') return uploadedCharacters;
    return cutoutCharacters;
  }, [activeTab, uploadedCharacters, cutoutCharacters]);

  useEffect(() => {
    if (!selectedCharacter) return;
    const existsInTab = visibleCharacters.some(item => item.id === selectedCharacter.id);
    if (!existsInTab) setSelectedCharacter(null);
  }, [visibleCharacters, selectedCharacter]);

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
      setUploadedCharacters(prev => [newCharacter, ...prev]);
      setActiveTab('uploaded');
    }
  }, []);

  const cutoutCharacter = useCallback(async () => {
    if (!hasRemoveBgConfig()) {
      Alert.alert('提示', '未配置抠图 API，将使用原图继续（不影响后续合成/保存）。');
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
          source: 'cutout',
          uri: cutoutResult.uri || result.assets[0].uri,
        };
        setCutoutCharacters(prev => [newCharacter, ...prev]);
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

    dispatch({ type: 'setCharacterImage', uri: selectedCharacter.uri });
    navigation.navigate('Result');
  }, [dispatch, navigation, selectedCharacter]);

  const renderCharacterItem = useCallback(({ item }: { item: Character }) => {
    const selected = selectedCharacter?.id === item.id;
    return (
      <View style={[styles.characterItem, selected && styles.selectedItem]}>
        <Image source={{ uri: item.uri }} style={styles.characterImage} />
        <View style={styles.characterMeta}>
          <Text style={styles.characterName} numberOfLines={1}>
            {item.name}
          </Text>
        </View>
        <View style={styles.selectOverlay}>
          <Button
            label={selected ? '已选择' : '选择'}
            onPress={() => setSelectedCharacter(item)}
            variant={selected ? 'primary' : 'secondary'}
          />
        </View>
      </View>
    );
  }, [selectedCharacter]);

  return (
    <Screen>
      <TopBar title="选择角色" left={{ label: '返回', onPress: () => navigation.goBack() }} />

      <View style={styles.previewContainer}>
        {!!backgroundImage && <Image source={{ uri: backgroundImage }} style={styles.previewImage} />}
      </View>

      <View style={styles.content}>
        <SegmentedControl
          value={activeTab}
          options={[
            { value: 'popular', label: '热门' },
            { value: 'uploaded', label: '上传' },
            { value: 'cutout', label: '抠图' },
          ]}
          onChange={setActiveTab}
        />

        <View style={styles.toolbar}>
          {activeTab === 'uploaded' && (
            <Button label="从相册上传" onPress={uploadCharacter} variant="secondary" />
          )}
          {activeTab === 'cutout' && (
            <Button label="选择图片并抠图" onPress={cutoutCharacter} variant="secondary" />
          )}
        </View>

        {isProcessing ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.tint} />
            <Text style={styles.loadingText}>处理中…</Text>
          </View>
        ) : visibleCharacters.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>这里还没有内容</Text>
            <Text style={styles.emptyDesc}>
              {activeTab === 'uploaded'
                ? '从相册上传一张角色图。'
                : activeTab === 'cutout'
                  ? '选择一张图片并抠图，抠完会出现在这里。'
                  : '稍后我们会补充更多内置角色素材。'}
            </Text>
          </View>
        ) : (
          <FlatList
            data={visibleCharacters}
            renderItem={renderCharacterItem}
            keyExtractor={item => item.id}
            numColumns={2}
            columnWrapperStyle={styles.column}
            contentContainerStyle={styles.gridContainer}
          />
        )}
      </View>

      <View style={styles.bottom}>
        <Button label="下一步：合成" onPress={confirmSelection} disabled={!selectedCharacter} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  previewContainer: {
    height: 160,
    marginHorizontal: theme.space.lg,
    marginTop: theme.space.sm,
    borderRadius: theme.radius.lg,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.border,
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.space.lg,
    paddingTop: theme.space.md,
  },
  toolbar: {
    marginTop: theme.space.md,
    marginBottom: theme.space.sm,
  },
  gridContainer: {
    paddingVertical: theme.space.md,
    paddingBottom: theme.space.xl,
    gap: theme.space.md,
  },
  column: {
    gap: theme.space.md,
  },
  characterItem: {
    flex: 1,
    borderRadius: theme.radius.lg,
    overflow: 'hidden',
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    minHeight: 240,
  },
  selectedItem: {
    borderColor: theme.colors.tint,
  },
  characterImage: {
    width: '100%',
    height: 170,
    backgroundColor: theme.colors.tintSoft,
  },
  characterMeta: {
    padding: theme.space.md,
  },
  characterName: {
    color: theme.colors.text,
    fontSize: theme.textSize.md,
    fontWeight: '700',
  },
  selectOverlay: {
    paddingHorizontal: theme.space.md,
    paddingBottom: theme.space.md,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: theme.colors.textSecondary,
    fontSize: theme.textSize.sm,
    marginTop: theme.space.sm,
  },
  bottom: {
    paddingHorizontal: theme.space.lg,
    paddingBottom: theme.space.lg,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.space.xl,
  },
  emptyTitle: {
    fontSize: theme.textSize.lg,
    fontWeight: '800',
    color: theme.colors.text,
  },
  emptyDesc: {
    marginTop: theme.space.sm,
    fontSize: theme.textSize.sm,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
});
