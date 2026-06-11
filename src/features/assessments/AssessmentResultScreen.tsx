import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { colors } from '../../core/theme/colors';
import { typography } from '../../core/theme/typography';
import { spacing } from '../../core/theme/spacing';
import { AssessmentRepository } from '../../repositories/AssessmentRepository';
import type { AssessmentResult } from '../../core/types/models';
import { useAppDispatch } from '../../core/store';
import { checkModuleCompletion } from '../../services/UnlockService';
import { ModuleRepository } from './moduleApi';

export const AssessmentResultScreen = ({ route, navigation }: any) => {
  const { assessmentId, videoId, moduleId } = route.params;
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    AssessmentRepository.getPastResults().then(results => {
      const found = results.find(r => r.assessmentId === assessmentId);
      if (found) setResult(found);
    });
  }, [assessmentId]);

  if (!result) return null;

  const handleContinue = async () => {
    if (!moduleId) {
      navigation.navigate('MainTabs');
      return;
    }
    
    // Check module completion
    const sections = await ModuleRepository.getModuleSections(moduleId);
    const videoLessonIds = sections.flatMap(sec => sec.lessons.filter(l => l.type === 'video').map(l => l.id));
    
    const isComplete = (dispatch(checkModuleCompletion(moduleId, videoLessonIds.length, videoLessonIds) as any) as unknown) as boolean;
    
    if (isComplete) {
      navigation.replace('ModuleCompletion', { moduleId });
    } else {
      navigation.navigate('MainTabs');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Hero Result */}
        <View style={styles.heroBox}>
          <Text style={styles.heroEmoji}>{result.isPass ? '🎉' : '💪'}</Text>
          <Text style={styles.heroTitle}>{result.isPass ? 'Congratulations!' : 'Keep Practicing!'}</Text>
          <Text style={styles.heroSub}>You scored</Text>
          <Text style={[styles.scoreText, { color: result.isPass ? colors.success : colors.danger }]}>
            {result.scorePercent}%
          </Text>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Correct</Text>
            <Text style={styles.statValue}>{result.correctCount}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Incorrect</Text>
            <Text style={styles.statValue}>{result.incorrectCount}</Text>
          </View>
        </View>

        {/* Topic Breakdown */}
        <View style={styles.breakdownBox}>
          <Text style={styles.sectionTitle}>Topic Breakdown</Text>
          {Object.entries(result.topicBreakdown).map(([topic, score]) => (
            <View key={topic} style={styles.topicRow}>
              <Text style={styles.topicName}>{topic}</Text>
              <Text style={styles.topicScore}>{score}%</Text>
            </View>
          ))}
        </View>

      </ScrollView>

      {/* Footer Actions */}
      <View style={styles.footer}>
        {result.isPass ? (
          <>
            <TouchableOpacity style={styles.secondaryBtn} onPress={handleContinue}>
              <Text style={styles.secondaryBtnText}>Back to Dashboard</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.primaryBtn} onPress={() => navigation.navigate('Certificate', { assessmentId })}>
              <Text style={styles.primaryBtnText}>View Certificate</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity style={styles.secondaryBtn} onPress={() => navigation.navigate('MainTabs')}>
              <Text style={styles.secondaryBtnText}>Back to Dashboard</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.primaryBtn} onPress={() => navigation.replace('Assessment', { assessmentId, videoId, moduleId })}>
              <Text style={styles.primaryBtnText}>Retry Assessment</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.m, paddingBottom: spacing.xxxl },

  heroBox: { alignItems: 'center', backgroundColor: colors.white, padding: spacing.xl, borderRadius: 16, marginBottom: spacing.l, elevation: 2 },
  heroEmoji: { fontSize: 64, marginBottom: spacing.s },
  heroTitle: { ...typography.h1, color: colors.textMain, marginBottom: 4 },
  heroSub: { ...typography.bodyLarge, color: colors.textMuted, marginBottom: spacing.s },
  scoreText: { fontSize: 48, fontWeight: '800' },

  statsGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.l },
  statBox: { flex: 1, backgroundColor: colors.white, padding: spacing.m, borderRadius: 12, alignItems: 'center', marginHorizontal: 4, elevation: 1 },
  statLabel: { ...typography.body, color: colors.textMuted, marginBottom: 4 },
  statValue: { ...typography.h2, color: colors.textMain },

  breakdownBox: { backgroundColor: colors.white, padding: spacing.m, borderRadius: 12, elevation: 1 },
  sectionTitle: { ...typography.h3, color: colors.textMain, marginBottom: spacing.m },
  topicRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.s, borderBottomWidth: 1, borderBottomColor: colors.divider },
  topicName: { ...typography.body, color: colors.textMain },
  topicScore: { ...typography.bodyMedium, color: colors.primary },

  footer: { padding: spacing.m, backgroundColor: colors.white, borderTopWidth: 1, borderTopColor: colors.border },
  primaryBtn: { backgroundColor: colors.primary, padding: spacing.m, borderRadius: 8, alignItems: 'center', marginBottom: spacing.s },
  primaryBtnText: { ...typography.bodyMedium, color: colors.white },
  secondaryBtn: { padding: spacing.m, borderRadius: 8, alignItems: 'center', marginBottom: spacing.s },
  secondaryBtnText: { ...typography.bodyMedium, color: colors.textMain },
});
