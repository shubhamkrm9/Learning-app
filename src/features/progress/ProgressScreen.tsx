import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { colors } from '../../core/theme/colors';
import { typography } from '../../core/theme/typography';
import { spacing } from '../../core/theme/spacing';
import { ProgressRepository } from '../../core/mocks/mockProgress';
import type { UserProgress } from '../../core/types/models';

export const ProgressScreen = () => {
  const [progress, setProgress] = useState<UserProgress | null>(null);

  useEffect(() => {
    ProgressRepository.getUserProgress().then(setProgress);
  }, []);

  if (!progress) return null;

  // Mock data for weekly chart
  const weeklyData = [
    { day: 'Mon', hours: 1.5 },
    { day: 'Tue', hours: 2.0 },
    { day: 'Wed', hours: 0.5 },
    { day: 'Thu', hours: 3.0 },
    { day: 'Fri', hours: 1.0 },
    { day: 'Sat', hours: 0 },
    { day: 'Sun', hours: 0.5 },
  ];
  const maxHours = Math.max(...weeklyData.map(d => d.hours));

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Analytics</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Overview Card */}
        <View style={styles.overviewCard}>
          <Text style={styles.overviewTitle}>Learning Journey</Text>
          <View style={styles.progressRow}>
            <Text style={styles.progressPercent}>{progress.overallProgressPercent}%</Text>
            <Text style={styles.progressLabel}>Overall Completed</Text>
          </View>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${progress.overallProgressPercent}%` }]} />
          </View>

          <View style={styles.hoursRow}>
            <Text style={styles.hoursEmoji}>⏱</Text>
            <Text style={styles.hoursText}>{progress.learningHoursThisWeek} hours learned this week</Text>
          </View>
        </View>

        {/* Weekly Chart */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Weekly Activity</Text>
          <View style={styles.chartContainer}>
            {weeklyData.map(d => {
              const heightPercent = maxHours > 0 ? (d.hours / maxHours) * 100 : 0;
              return (
                <View key={d.day} style={styles.barColumn}>
                  <Text style={styles.barLabelTop}>{d.hours > 0 ? d.hours : ''}</Text>
                  <View style={styles.barBg}>
                    <View style={[styles.barFill, { height: `${heightPercent}%` }]} />
                  </View>
                  <Text style={styles.barLabelBottom}>{d.day}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Skill Growth */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Skill Growth</Text>
          {Object.entries(progress.skillGrowth).map(([skill, value]) => (
            <View key={skill} style={styles.skillRow}>
              <View style={styles.skillHeader}>
                <Text style={styles.skillName}>{skill}</Text>
                <Text style={styles.skillValue}>{value}%</Text>
              </View>
              <View style={styles.skillBarBg}>
                <View style={[styles.skillBarFill, { width: `${value}%` }]} />
              </View>
            </View>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { padding: spacing.m, backgroundColor: colors.white, elevation: 2 },
  headerTitle: { ...typography.h1, color: colors.textMain },
  
  content: { padding: spacing.m, paddingBottom: spacing.xxxl },

  overviewCard: { backgroundColor: colors.primary, borderRadius: 16, padding: spacing.xl, marginBottom: spacing.l, elevation: 3 },
  overviewTitle: { ...typography.bodyMedium, color: colors.white, opacity: 0.9, marginBottom: spacing.m },
  progressRow: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: spacing.s },
  progressPercent: { fontSize: 40, fontWeight: '800', color: colors.white, marginRight: spacing.s },
  progressLabel: { ...typography.body, color: colors.white, opacity: 0.9, paddingBottom: 6 },
  progressBarBg: { height: 8, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 4, marginBottom: spacing.l },
  progressBarFill: { height: 8, backgroundColor: colors.white, borderRadius: 4 },
  hoursRow: { flexDirection: 'row', alignItems: 'center' },
  hoursEmoji: { fontSize: 20, marginRight: spacing.s },
  hoursText: { ...typography.bodyMedium, color: colors.white },

  section: { backgroundColor: colors.white, borderRadius: 12, padding: spacing.m, marginBottom: spacing.l, elevation: 1 },
  sectionTitle: { ...typography.h3, color: colors.textMain, marginBottom: spacing.l },

  chartContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 160 },
  barColumn: { alignItems: 'center', width: 30 },
  barLabelTop: { ...typography.caption, color: colors.textMuted, marginBottom: 4, height: 16 },
  barBg: { height: 100, width: 24, backgroundColor: colors.border, borderRadius: 12, justifyContent: 'flex-end', overflow: 'hidden' },
  barFill: { width: '100%', backgroundColor: colors.primary, borderRadius: 12 },
  barLabelBottom: { ...typography.caption, color: colors.textMain, marginTop: spacing.s },

  skillRow: { marginBottom: spacing.m },
  skillHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  skillName: { ...typography.bodyMedium, color: colors.textMain },
  skillValue: { ...typography.caption, color: colors.primary, fontWeight: '700' },
  skillBarBg: { height: 6, backgroundColor: colors.border, borderRadius: 3 },
  skillBarFill: { height: 6, backgroundColor: colors.primary, borderRadius: 3 },
});
