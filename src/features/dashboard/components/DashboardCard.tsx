import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { colors } from '../../../core/theme/colors';
import { typography } from '../../../core/theme/typography';
import { spacing } from '../../../core/theme/spacing';
import type { Module } from '../../../core/types/models';

interface DashboardCardProps {
  module: Module;
  onPress: () => void;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({ module, onPress }) => {
  const progressAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    const validProgress = Number.isNaN(module.progressPercent) ? 0 : (module.progressPercent || 0);
    Animated.timing(progressAnim, {
      toValue: validProgress,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [module.progressPercent, progressAnim]);

  const widthInterpolated = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
    extrapolate: 'clamp'
  });

  return (
    <View style={styles.continueCard}>
      {/* Decorative Background Elements */}
      <View style={styles.decorativeCircle1} />
      <View style={styles.decorativeCircle2} />

      <View style={styles.content}>
        <Text style={styles.cardLabel}>In Progress</Text>
        <Text style={styles.courseTitle}>{module.title}</Text>
        <Text style={styles.lessonText}>{module.durationString} • Module</Text>
        <View style={styles.progressBarBg}>
          <Animated.View style={[styles.progressBarFill, { width: widthInterpolated }]} />
        </View>
      </View>

      <TouchableOpacity style={styles.resumeButton} onPress={onPress}>
        <Text style={styles.resumeButtonText}>▶ Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  continueCard: { 
    borderRadius: 16, 
    marginBottom: spacing.l + 10, 
    elevation: 4, 
    shadowColor: '#2563EB', 
    shadowOpacity: 0.3, 
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    position: 'relative',
    minHeight: 180,
    backgroundColor: '#2563EB', // Premium Blue
    overflow: 'visible'
  },
  decorativeCircle1: { position: 'absolute', top: -50, right: -50, width: 150, height: 150, borderRadius: 75, backgroundColor: 'rgba(255,255,255,0.1)' },
  decorativeCircle2: { position: 'absolute', bottom: -20, left: -40, width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(255,255,255,0.05)' },
  content: { padding: spacing.m },
  cardLabel: { ...typography.caption, color: colors.white, backgroundColor: 'rgba(255,255,255,0.2)', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, marginBottom: spacing.s },
  courseTitle: { ...typography.h2, color: colors.white, marginBottom: 4 },
  lessonText: { ...typography.body, color: 'rgba(255,255,255,0.8)', marginBottom: spacing.m },
  progressBarBg: { height: 6, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 3, marginBottom: spacing.s },
  progressBarFill: { height: 6, backgroundColor: colors.white, borderRadius: 3 },
  resumeButton: { 
    position: 'absolute', 
    bottom: -15, 
    right: spacing.m, 
    backgroundColor: colors.white, 
    paddingVertical: 10, 
    paddingHorizontal: 20, 
    borderRadius: 20, 
    elevation: 5,
    shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 4, shadowOffset: { width: 0, height: 2 }
  },
  resumeButtonText: { ...typography.bodyMedium, color: '#1D4ED8', fontWeight: '800' },
});
