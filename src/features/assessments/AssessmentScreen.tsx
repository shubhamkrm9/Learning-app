import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { colors } from '../../core/theme/colors';
import { typography } from '../../core/theme/typography';
import { spacing } from '../../core/theme/spacing';
import { AssessmentRepository } from '../../repositories/AssessmentRepository';
import type { Assessment } from '../../core/types/models';
import { useAppDispatch } from '../../core/store';
import { setAssessmentResult } from '../assessments/assessmentSlice';
import { updateModuleAssessmentScore } from '../progress/progressSlice';

export const AssessmentScreen = ({ route, navigation }: any) => {
  const { assessmentId, videoId, moduleId } = route.params;
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const dispatch = useAppDispatch();

  useEffect(() => {
    AssessmentRepository.getAssessmentForVideo(videoId).then(setAssessment);
  }, [videoId]);

  if (!assessment) return null;
  if (assessment.questions.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.emptyText}>No questions available for this assessment.</Text>
        <TouchableOpacity style={styles.primaryBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.primaryBtnText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const currentQuestion = assessment.questions[currentIndex];

  const handleSelectOption = (choiceId: string) => {
    setAnswers({ ...answers, [currentQuestion.id]: choiceId });
  };

  const handleSubmit = async () => {
    try {
      const result = await AssessmentRepository.submitAssessment(videoId, assessmentId, answers);
      dispatch(setAssessmentResult(result));
      dispatch(updateModuleAssessmentScore({ moduleId: moduleId, score: result.scorePercent }));
      navigation.replace('AssessmentResult', { assessmentId, videoId, moduleId });
    } catch (e) {
      Alert.alert('Error', 'Failed to submit assessment');
    }
  };

  const confirmSubmit = () => {
    const answeredCount = Object.keys(answers).length;
    if (answeredCount < assessment.totalQuestions) {
      Alert.alert('Incomplete', `You have only answered ${answeredCount} out of ${assessment.totalQuestions} questions. Submit anyway?`, [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Submit', style: 'destructive', onPress: handleSubmit }
      ]);
    } else {
      handleSubmit();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>✕ Quit</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Question {currentIndex + 1} of {assessment.totalQuestions}</Text>
        <Text style={styles.timer}>10:00</Text> 
      </View>

      {/* Progress */}
      <View style={styles.progressBarBg}>
        <View style={[styles.progressBarFill, { width: `${((currentIndex + 1) / assessment.totalQuestions) * 100}%` }]} />
      </View>

      {/* Question */}
      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>{currentQuestion.text}</Text>
        
        {currentQuestion.choices.map((choice) => {
          const isSelected = answers[currentQuestion.id] === choice.id;
          return (
            <TouchableOpacity 
              key={choice.id} 
              style={[styles.optionCard, isSelected && styles.optionCardActive]}
              onPress={() => handleSelectOption(choice.id)}
            >
              <View style={[styles.radio, isSelected && styles.radioActive]}>
                {isSelected && <View style={styles.radioInner} />}
              </View>
              <Text style={[styles.optionText, isSelected && styles.optionTextActive]}>{choice.text}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Palette Footer */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.navBtn, currentIndex === 0 && styles.navBtnDisabled]}
          disabled={currentIndex === 0}
          onPress={() => setCurrentIndex(currentIndex - 1)}
        >
          <Text style={[styles.navBtnText, currentIndex === 0 && styles.navBtnTextDisabled]}>← Prev</Text>
        </TouchableOpacity>

        {currentIndex === assessment.totalQuestions - 1 ? (
          <TouchableOpacity style={styles.submitBtn} onPress={confirmSubmit}>
            <Text style={styles.submitBtnText}>Submit</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.navBtn} onPress={() => setCurrentIndex(currentIndex + 1)}>
            <Text style={styles.navBtnText}>Next →</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  emptyText: { ...typography.body, color: colors.textMain, textAlign: 'center', margin: spacing.xl },
  
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: spacing.m, backgroundColor: colors.white },
  backButton: { padding: spacing.xs },
  backText: { ...typography.bodyMedium, color: colors.danger },
  headerTitle: { ...typography.h3, color: colors.textMain },
  timer: { ...typography.bodyMedium, color: colors.textMain, fontWeight: '700' },

  progressBarBg: { height: 4, backgroundColor: colors.border },
  progressBarFill: { height: 4, backgroundColor: colors.primary },

  questionContainer: { flex: 1, padding: spacing.m },
  questionText: { ...typography.h2, color: colors.textMain, marginBottom: spacing.xl, lineHeight: 32 },

  optionCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white, padding: spacing.m, borderRadius: 12, marginBottom: spacing.m, borderWidth: 1, borderColor: colors.border },
  optionCardActive: { borderColor: colors.primary, backgroundColor: colors.primaryLight },
  radio: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: colors.border, marginRight: spacing.m, justifyContent: 'center', alignItems: 'center' },
  radioActive: { borderColor: colors.primary },
  radioInner: { width: 12, height: 12, borderRadius: 6, backgroundColor: colors.primary },
  optionText: { ...typography.bodyLarge, color: colors.textMain, flex: 1 },
  optionTextActive: { color: colors.primary, fontWeight: '600' },

  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: spacing.m, backgroundColor: colors.white, borderTopWidth: 1, borderTopColor: colors.border },
  navBtn: { padding: spacing.m },
  navBtnDisabled: { opacity: 0.5 },
  navBtnText: { ...typography.bodyMedium, color: colors.textMain },
  navBtnTextDisabled: { color: colors.textMuted },
  
  submitBtn: { backgroundColor: colors.success, paddingVertical: spacing.m, paddingHorizontal: spacing.xl, borderRadius: 8 },
  submitBtnText: { ...typography.bodyMedium, color: colors.white },

  primaryBtn: { backgroundColor: colors.primary, padding: spacing.m, borderRadius: 8, alignItems: 'center', margin: spacing.m },
  primaryBtnText: { ...typography.bodyMedium, color: colors.white },
});
