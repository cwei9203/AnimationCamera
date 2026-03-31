import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { theme } from '../theme';

type Props = {
  title: string;
  left?: { label: string; onPress: () => void };
  right?: { label: string; onPress: () => void };
};

export function TopBar({ title, left, right }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.side}>
        {left ? (
          <Pressable onPress={left.onPress} style={styles.sideButton}>
            <Text style={styles.sideText}>{left.label}</Text>
          </Pressable>
        ) : (
          <View style={styles.sideSpacer} />
        )}
      </View>

      <Text numberOfLines={1} style={styles.title}>
        {title}
      </Text>

      <View style={styles.side}>
        {right ? (
          <Pressable onPress={right.onPress} style={styles.sideButton}>
            <Text style={styles.sideText}>{right.label}</Text>
          </Pressable>
        ) : (
          <View style={styles.sideSpacer} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 52,
    paddingHorizontal: theme.space.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  side: {
    width: 88,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  sideSpacer: {
    height: 32,
    width: 88,
  },
  sideButton: {
    height: 32,
    paddingHorizontal: theme.space.sm,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.tintSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sideText: {
    color: theme.colors.tint,
    fontSize: theme.textSize.sm,
    fontWeight: '600',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    color: theme.colors.text,
    fontSize: theme.textSize.lg,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});

