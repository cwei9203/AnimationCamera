import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { theme } from '../theme';

export type SegmentedOption<T extends string> = {
  value: T;
  label: string;
};

type Props<T extends string> = {
  value: T;
  options: SegmentedOption<T>[];
  onChange: (next: T) => void;
};

export function SegmentedControl<T extends string>({ value, options, onChange }: Props<T>) {
  return (
    <View style={styles.container}>
      {options.map(option => {
        const active = option.value === value;
        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            style={[styles.item, active && styles.itemActive]}
          >
            <Text style={[styles.text, active && styles.textActive]}>{option.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.pill,
    padding: 4,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  item: {
    flex: 1,
    height: 36,
    borderRadius: theme.radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemActive: {
    backgroundColor: theme.colors.tintSoft,
  },
  text: {
    fontSize: theme.textSize.sm,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  textActive: {
    color: theme.colors.tint,
  },
});

