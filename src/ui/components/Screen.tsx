import React from 'react';
import { SafeAreaView, StyleSheet, View, ViewProps } from 'react-native';
import { theme } from '../theme';

type Props = ViewProps & {
  children: React.ReactNode;
  safe?: boolean;
};

export function Screen({ children, style, safe = true, ...rest }: Props) {
  if (safe) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={[styles.container, style]} {...rest}>
          {children}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={[styles.container, style]} {...rest}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
});

