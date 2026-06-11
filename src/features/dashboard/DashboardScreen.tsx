import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { colors } from '../../core/theme/colors';
import { typography } from '../../core/theme/typography';
import { spacing } from '../../core/theme/spacing';
import { ModuleRepository } from './moduleApi';
import type { UserProgress, Module, LearningActivity } from '../../core/types/models';
import { DashboardCard } from './components/DashboardCard';

import { useAppSelector, useAppDispatch } from '../../core/store';
import { selectStreak, selectLearningHours, selectActivities } from '../progress/progressSlice';
import { selectModules } from '../modules/moduleSlice';

export const DashboardScreen = ({ navigation }: any) => {
  const dispatch = useAppDispatch();
  const modules = useAppSelector(selectModules);
  const streakDays = useAppSelector(selectStreak);
  const activities = useAppSelector(selectActivities);
  
  useEffect(() => {
    if (modules.length === 0) {
      ModuleRepository.getModules().then(data => dispatch({ type: 'module/setModules', payload: data }));
    }
  }, [modules.length, dispatch]);

  const pastResults = useAppSelector(state => state.assessment.pastResults);
  const moduleProgress = useAppSelector(state => state.progress.moduleProgress);
  
  const resultsArr = Object.values(pastResults);
  const testsPassed = resultsArr.filter(r => r.isPass).length;
  const avgScore = resultsArr.length > 0 ? Math.round(resultsArr.reduce((acc, r) => acc + r.scorePercent, 0) / resultsArr.length) : 0;
  
  const totalLessonsInAllModules = modules.reduce((acc, m) => acc + m.totalLessons, 0);
  const totalCompletedLessons = Object.values(moduleProgress).reduce((acc, mp) => acc + mp.completedLessons, 0);
  const overallProgressPercent = totalLessonsInAllModules > 0 ? Math.round((totalCompletedLessons / totalLessonsInAllModules) * 100) : 0;

  let continueModule = modules.find(m => m.status === 'IN_PROGRESS' || m.id === 'm1'); 
  if (continueModule) {
    const mp = moduleProgress[continueModule.id];
    continueModule = { ...continueModule, progressPercent: mp ? mp.lessonCompletionPercentage : continueModule.progressPercent };
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>👋 Good Morning, Mourya</Text>
          <Text style={styles.subGreeting}>Keep learning. You're {overallProgressPercent}% through!</Text>
        </View>
        <View style={styles.avatarPlaceholder}><Text>👤</Text></View>
      </View>

      {/* Continue Learning */}
      {continueModule && (
        <DashboardCard 
          module={continueModule} 
          onPress={() => navigation.navigate('ModuleDetail', { id: continueModule.id })} 
        />
      )}

      {/* Streak Widget */}
      <View style={styles.streakCard}>
        <Text style={styles.streakEmoji}>🔥</Text>
        <Text style={styles.streakTitle}>{streakDays} Day Streak!</Text>
        <Text style={styles.streakSub}>You're on fire. Keep it up!</Text>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statIcon}>📚</Text>
          <Text style={styles.statLabel}>MODULES</Text>
          <Text style={styles.statValue}>2</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statIcon}>📝</Text>
          <Text style={styles.statLabel}>TESTS</Text>
          <Text style={styles.statValue}>{testsPassed}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statIcon}>⭐</Text>
          <Text style={styles.statLabel}>AVG SCORE</Text>
          <Text style={styles.statValue}>{avgScore}%</Text>
        </View>
      </View>

      {/* Recommended Next */}
      <Text style={styles.sectionTitle}>Recommended Next</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.carousel}>
        {modules.filter(m => m.id !== 'm1').map(m => (
          <TouchableOpacity key={m.id} style={styles.recCard} onPress={() => navigation.navigate('ModuleDetail', { id: m.id })}>
            <Image source={{ uri: m.thumbnailUrl }} style={styles.recImage} />
            <View style={styles.recContent}>
              <Text style={styles.recTitle}>{m.title}</Text>
              <Text style={styles.recDuration}>⏱ {m.durationString}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Recent Activity */}
      <Text style={styles.sectionTitle}>Recent Activity</Text>
      <View style={styles.activityBox}>
        {activities.map((act, index) => (
          <View key={act.id} style={styles.activityItem}>
            <View style={styles.activityDot} />
            <View style={styles.activityContent}>
              <Text style={styles.activityDate}>{act.date}</Text>
              <Text style={styles.activityText}>{act.title}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.m, paddingBottom: spacing.xxxl },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.l },
  greeting: { ...typography.h2, color: colors.textMain },
  subGreeting: { ...typography.body, color: colors.textMuted },
  avatarPlaceholder: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.border, justifyContent: 'center', alignItems: 'center' },
  
  continueCard: { backgroundColor: colors.white, borderRadius: 16, padding: spacing.m, marginBottom: spacing.l, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8 },
  cardLabel: { ...typography.caption, color: colors.primary, backgroundColor: colors.primaryLight, alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, marginBottom: spacing.s },
  courseTitle: { ...typography.h2, color: colors.textMain, marginBottom: 4 },
  lessonText: { ...typography.body, color: colors.textMuted, marginBottom: spacing.m },
  progressBarBg: { height: 6, backgroundColor: colors.border, borderRadius: 3, marginBottom: spacing.m },
  progressBarFill: { height: 6, backgroundColor: colors.primary, borderRadius: 3 },
  resumeButton: { backgroundColor: colors.primary, padding: spacing.m, borderRadius: 8, alignItems: 'center' },
  resumeButtonText: { ...typography.bodyMedium, color: colors.white },

  streakCard: { backgroundColor: colors.warningLight, borderRadius: 16, padding: spacing.m, alignItems: 'center', marginBottom: spacing.l },
  streakEmoji: { fontSize: 32 },
  streakTitle: { ...typography.h2, color: colors.warning, marginTop: 4 },
  streakSub: { ...typography.body, color: colors.warning },

  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.l },
  statBox: { flex: 1, backgroundColor: colors.white, padding: spacing.m, borderRadius: 12, alignItems: 'center', marginHorizontal: 4, elevation: 1 },
  statIcon: { fontSize: 24, marginBottom: 4 },
  statLabel: { ...typography.caption, color: colors.textMuted, marginBottom: 4 },
  statValue: { ...typography.h2, color: colors.textMain },

  sectionTitle: { ...typography.h3, color: colors.textMain, marginBottom: spacing.m },
  carousel: { marginBottom: spacing.l, overflow: 'visible' },
  recCard: { width: 220, backgroundColor: colors.white, borderRadius: 12, marginRight: spacing.m, overflow: 'hidden', elevation: 2 },
  recImage: { width: '100%', height: 100, backgroundColor: colors.border },
  recContent: { padding: spacing.m },
  recTitle: { ...typography.bodyMedium, color: colors.textMain, marginBottom: 4 },
  recDuration: { ...typography.caption, color: colors.textMuted },

  activityBox: { backgroundColor: colors.white, borderRadius: 12, padding: spacing.m, elevation: 1 },
  activityItem: { flexDirection: 'row', marginBottom: spacing.m },
  activityDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: colors.primary, marginTop: 4, marginRight: spacing.s },
  activityContent: { flex: 1 },
  activityDate: { ...typography.caption, color: colors.textMuted },
  activityText: { ...typography.body, color: colors.textMain, marginTop: 2 }
});
