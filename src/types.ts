import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Camera: undefined;
  Character: undefined;
  Result: undefined;
};

export type CameraScreenProps = NativeStackScreenProps<RootStackParamList, 'Camera'>;
export type CharacterScreenProps = NativeStackScreenProps<RootStackParamList, 'Character'>;
export type ResultScreenProps = NativeStackScreenProps<RootStackParamList, 'Result'>;

export interface Character {
  id: string;
  name: string;
  source: 'builtin' | 'uploaded' | 'cutout';
  uri: string;
}

export interface SeichiLocation {
  id: string;
  animeName: string;
  sceneName: string;
  locationName: string;
  referenceImage: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}
