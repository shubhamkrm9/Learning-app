/**
 * Learning Module SDK - ModuleCompletionScreen
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from '../../shared/components/Button/Button';
import { colors } from '../../core/theme/colors';
import { spacing } from '../../core/theme/spacing';
import { typography } from '../../core/theme/typography';
import type { ModuleCompletionScreenProps } from '../../core/types/navigation';

export const ModuleCompletionScreen: React.FC<ModuleCompletionScreenProps> = ({
  navigation,
}) => {
  const handleReturn = () => {
    navigation.navigate('Dashboard');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.emoji}>🎉</Text>
        <Text style={styles.title}>Module Completed!</Text>
        <Text style={styles.subtitle}>
          You've successfully completed this module. The next module is now unlocked in your dashboard.
        </Text>
      </View>
      <View style={styles.footer}>
        <Button
          title="Return to Dashboard"
          onPress={handleReturn}
          style={styles.button}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emoji: {
    fontSize: 80,
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.headingMedium,
    color: colors.primary,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    padding: spacing.xl,
  },
  button: {
    width: '100%',
  },
});
