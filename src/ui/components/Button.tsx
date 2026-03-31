import React from 'react';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { theme } from '../theme';

type Variant = 'primary' | 'secondary' | 'ghost';

type Props = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: Variant;
  leftIcon?: React.ReactNode;
  style?: ViewStyle;
};

export function Button({
  label,
  onPress,
  disabled,
  variant = 'primary',
  leftIcon,
  style,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        variant === 'primary' && styles.primary,
        variant === 'secondary' && styles.secondary,
        variant === 'ghost' && styles.ghost,
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      <View style={styles.row}>
        {!!leftIcon && <View style={styles.icon}>{leftIcon}</View>}
        <Text
          style={[
            styles.label,
            variant === 'primary' && styles.labelPrimary,
            variant !== 'primary' && styles.labelSecondary,
            disabled && styles.labelDisabled,
          ]}
        >
          {label}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 48,
    paddingHorizontal: theme.space.lg,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.sm,
  },
  icon: {
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: theme.colors.tint,
    borderColor: theme.colors.tint,
  },
  secondary: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  pressed: {
    opacity: 0.9,
  },
  disabled: {
    opacity: 0.45,
  },
  label: {
    fontSize: theme.textSize.md,
    fontWeight: '600',
    letterSpacing: 0.1,
  },
  labelPrimary: {
    color: '#fff',
  },
  labelSecondary: {
    color: theme.colors.text,
  },
  labelDisabled: {
    color: theme.colors.textSecondary,
  },
});

