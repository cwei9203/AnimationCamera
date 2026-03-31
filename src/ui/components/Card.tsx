import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import { theme } from '../theme';

type Props = ViewProps & {
  children: React.ReactNode;
};

export function Card({ children, style, ...rest }: Props) {
  return (
    <View style={[styles.container, style]} {...rest}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.space.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadow.card,
  },
});

