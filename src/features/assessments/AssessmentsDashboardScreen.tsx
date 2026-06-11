import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { colors } from '../../core/theme/colors';
import { typography } from '../../core/theme/typography';
import { spacing } from '../../core/theme/spacing';
import { AssessmentRepository } from '../../repositories/AssessmentRepository';
import type { Assessment, AssessmentResult } from '../../core/types/models';
import { useAppSelector } from '../../core/store';

export const AssessmentsDashboardScreen = ({ navigation }: any) => {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [results, setResults] = useState<AssessmentResult[]>([]);
  
  const unlockedAssessments = useAppSelector(state => state.progress.unlockedAssessments);

  useEffect(() => {
    AssessmentRepository.getAssessments().then(setAssessments);
    AssessmentRepository.getPastResults().then(setResults);
  }, []);

  const renderAssessment = ({ item }: { item: Assessment }) => {
    const result = results.find(r => r.assessmentId === item.id);
    const isUnlocked = unlockedAssessments.includes(item.videoId) || !!result;

    return (
      <View style={[styles.card, !isUnlocked && styles.cardLocked]}>
        <View style={styles.cardHeader}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.meta}>⏱ {item.durationMinutes} mins   ❓ {item.totalQuestions} Questions</Text>
        </View>

        {!isUnlocked ? (
          <View style={styles.resultBox}>
             <Text style={styles.lockedText}>🔒 Watch video to 80% to unlock</Text>
          </View>
        ) : result ? (
          <View style={styles.resultBox}>
            <Text style={styles.resultText}>
              Score: {result.scorePercent}% - {result.isPass ? 'Passed ✅' : 'Failed ❌'}
            </Text>
            {result.isPass ? (
              <TouchableOpacity 
                style={styles.outlineBtn}
                onPress={() => navigation.navigate('AssessmentResult', { assessmentId: item.id, videoId: item.videoId, moduleId: item.moduleId })}
              >
                <Text style={styles.outlineBtnText}>View Results</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity 
                style={styles.primaryBtn}
                onPress={() => navigation.navigate('Assessment', { assessmentId: item.id, videoId: item.videoId, moduleId: item.moduleId })}
              >
                <Text style={styles.primaryBtnText}>Retry</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <TouchableOpacity 
            style={styles.primaryBtn}
            onPress={() => navigation.navigate('Assessment', { assessmentId: item.id, videoId: item.videoId, moduleId: item.moduleId })}
          >
            <Text style={styles.primaryBtnText}>Start Assessment</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Assessments</Text>
      </View>

      <FlatList 
        data={assessments}
        keyExtractor={item => item.id}
        renderItem={renderAssessment}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.infoBanner}>
            <Text style={styles.infoText}>Complete module assessments to earn verified certificates.</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { padding: spacing.m, backgroundColor: colors.white, elevation: 2 },
  headerTitle: { ...typography.h1, color: colors.textMain },
  
  listContent: { padding: spacing.m, paddingBottom: spacing.xxl },
  infoBanner: { backgroundColor: colors.info + '20', padding: spacing.m, borderRadius: 8, marginBottom: spacing.l },
  infoText: { ...typography.bodyMedium, color: colors.info },

  card: { backgroundColor: colors.white, borderRadius: 12, padding: spacing.m, marginBottom: spacing.m, elevation: 1 },
  cardLocked: { opacity: 0.7 },
  cardHeader: { marginBottom: spacing.m },
  title: { ...typography.h3, color: colors.textMain, marginBottom: spacing.s },
  meta: { ...typography.body, color: colors.textMuted },

  resultBox: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: colors.surface, padding: spacing.m, borderRadius: 8 },
  resultText: { ...typography.bodyMedium, color: colors.textMain, flex: 1 },
  lockedText: { ...typography.bodyMedium, color: colors.textMuted },

  primaryBtn: { backgroundColor: colors.primary, padding: spacing.m, borderRadius: 8, alignItems: 'center' },
  primaryBtnText: { ...typography.bodyMedium, color: colors.white },
  
  outlineBtn: { borderWidth: 1, borderColor: colors.primary, paddingVertical: spacing.s, paddingHorizontal: spacing.m, borderRadius: 8 },
  outlineBtnText: { ...typography.bodyMedium, color: colors.primary }
});
