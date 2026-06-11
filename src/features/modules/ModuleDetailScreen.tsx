import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { colors } from '../../core/theme/colors';
import { typography } from '../../core/theme/typography';
import { spacing } from '../../core/theme/spacing';
import { ModuleRepository } from './moduleApi';
import { useResumeLearning } from '../video/services/resumeLearningService';
import type { Module, ModuleSection, Lesson } from '../../core/types/models';
import { useAppSelector } from '../../core/store';

export const ModuleDetailScreen = ({ route, navigation }: any) => {
  const { id } = route.params;
  const [moduleData, setModuleData] = useState<Module | null>(null);
  const [sections, setSections] = useState<ModuleSection[]>([]);
  const { resumeData } = useResumeLearning();
  const completedLessons = useAppSelector(state => state.progress.completedLessons);

  useEffect(() => {
    ModuleRepository.getModuleById(id).then(setModuleData);
    ModuleRepository.getModuleSections(id).then(setSections);
  }, [id]);

  if (!moduleData) return null;

  const renderLesson = (lesson: Lesson) => {
    const isCompleted = completedLessons.includes(lesson.id);
    const isLocked = lesson.status === 'LOCKED';
    let icon = '▶';
    if (isCompleted) icon = '✅';
    if (isLocked) icon = '🔒';

    return (
      <TouchableOpacity
        key={lesson.id}
        style={styles.lessonRow}
        disabled={isLocked}
        onPress={() => navigation.navigate('VideoPlayer', { lessonId: lesson.id, moduleId: id })}
      >
        <Text style={styles.lessonIcon}>{icon}</Text>
        <View style={styles.lessonInfo}>
          <Text style={[styles.lessonTitle, isLocked && styles.textLocked]}>{lesson.title}</Text>
          <Text style={styles.lessonMeta}>{lesson.durationString}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header Bar */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{moduleData.title}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Banner */}
        <View style={styles.banner}>
          <Image source={{ uri: moduleData.thumbnailUrl }} style={styles.bannerImage} />
          <View style={styles.bannerContent}>
            <Text style={styles.moduleCategory}>{moduleData.category.toUpperCase()}</Text>
            <Text style={styles.moduleTitle}>{moduleData.title}</Text>
            <Text style={styles.moduleMeta}>⏱ {moduleData.durationString}   📖 {moduleData.totalLessons} Lessons   📊 {moduleData.level}</Text>

            <View style={styles.progressContainer}>
              <Text style={styles.progressText}>Your Progress</Text>
              <Text style={styles.progressPercent}>{moduleData.progressPercent}%</Text>
            </View>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${moduleData.progressPercent}%` }]} />
            </View>
          </View>
        </View>

        {/* Skills */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Skills You'll Learn</Text>
          {moduleData.skills.map((skill, idx) => (
            <Text key={idx} style={styles.listItem}>✓ {skill}</Text>
          ))}
        </View>

        {/* Prerequisites */}
        {moduleData.prerequisites.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Before Starting</Text>
            {moduleData.prerequisites.map((req, idx) => (
              <Text key={idx} style={styles.listItem}>• {req}</Text>
            ))}
          </View>
        )}

        {/* Instructor */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Created By: </Text>
          <View style={styles.instructorRow}>
            <View style={styles.avatar}><Text>👤</Text></View>
            <View>
              <Text style={styles.instructorName}>{moduleData.instructorName}</Text>
              <Text style={styles.instructorTitle}>{moduleData.instructorTitle} • {moduleData.rating} Rating</Text>
            </View>
          </View>
        </View>

        {/* Certificate */}
        {moduleData.certificateAvailable && (
          <View style={styles.certCard}>
            <Text style={styles.certIcon}>🏆</Text>
            <View style={styles.certInfo}>
              <Text style={styles.certTitle}>Certificate Available</Text>
              <Text style={styles.certDesc}>Complete course and pass final assessment to receive a verified certificate.</Text>
            </View>
          </View>
        )}

        {/* Lessons List */}
        <Text style={styles.sectionTitle}>Lesson List</Text>
        {sections.map(section => (
          <View key={section.id} style={styles.moduleSection}>
            <View style={styles.sectionHeaderRow}>
              {section.isLocked && <Text style={styles.lockIcon}>🔒</Text>}
              <Text style={[styles.sectionHeading, section.isLocked && styles.textLocked]}>{section.title}</Text>
            </View>
            {section.lessons.map(renderLesson)}
          </View>
        ))}
      </ScrollView>

      {/* Sticky Bottom Action */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => {
            if (resumeData?.lessonId) {
              navigation.navigate('VideoPlayer', { lessonId: resumeData.lessonId, moduleId: id });
            }
          }}
        >
          <Text style={styles.actionText}>
            {moduleData.progressPercent > 0 ? `Resume Lesson` : 'Enroll Now'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', padding: spacing.m, backgroundColor: colors.white, elevation: 2 },
  backButton: { marginRight: spacing.m },
  backText: { ...typography.bodyMedium, color: colors.primary },
  headerTitle: { ...typography.h3, color: colors.textMain },

  content: { paddingBottom: 100 },
  banner: { backgroundColor: colors.white, marginBottom: spacing.m },
  bannerImage: { width: '100%', height: 200, backgroundColor: colors.border },
  bannerContent: { padding: spacing.m },
  moduleCategory: { ...typography.caption, color: colors.primary, marginBottom: spacing.xs, fontWeight: '700' },
  moduleTitle: { ...typography.h1, color: colors.textMain, marginBottom: spacing.s },
  moduleMeta: { ...typography.body, color: colors.textMuted, marginBottom: spacing.l },

  progressContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  progressText: { ...typography.bodyMedium, color: colors.textMain },
  progressPercent: { ...typography.h3, color: colors.primary },
  progressBarBg: { height: 8, backgroundColor: colors.border, borderRadius: 4 },
  progressBarFill: { height: 8, backgroundColor: colors.primary, borderRadius: 4 },

  section: { padding: spacing.m, backgroundColor: colors.white, marginBottom: spacing.m },
  sectionTitle: { ...typography.h2, color: colors.textMain, marginBottom: spacing.m, paddingHorizontal: spacing.m },
  listItem: { ...typography.body, color: colors.textMain, marginBottom: spacing.s },

  instructorRow: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: colors.border, justifyContent: 'center', alignItems: 'center', marginRight: spacing.m },
  instructorName: { ...typography.bodyMedium, color: colors.textMain },
  instructorTitle: { ...typography.caption, color: colors.textMuted },

  certCard: { flexDirection: 'row', backgroundColor: colors.successLight, padding: spacing.m, margin: spacing.m, borderRadius: 12, alignItems: 'center' },
  certIcon: { fontSize: 32, marginRight: spacing.m },
  certInfo: { flex: 1 },
  certTitle: { ...typography.bodyMedium, color: colors.textMain },
  certDesc: { ...typography.caption, color: colors.textMuted },

  moduleSection: { backgroundColor: colors.white, marginBottom: spacing.s, padding: spacing.m },
  sectionHeaderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.m },
  lockIcon: { marginRight: spacing.s },
  sectionHeading: { ...typography.h3, color: colors.textMain },
  textLocked: { color: colors.textMuted },

  lessonRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.s, borderBottomWidth: 1, borderBottomColor: colors.divider },
  lessonIcon: { width: 30, fontSize: 16 },
  lessonInfo: { flex: 1 },
  lessonTitle: { ...typography.bodyMedium, color: colors.textMain },
  lessonMeta: { ...typography.caption, color: colors.textMuted },

  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: spacing.m, backgroundColor: colors.white, borderTopWidth: 1, borderTopColor: colors.border, elevation: 10 },
  actionButton: { backgroundColor: colors.primary, padding: spacing.m, borderRadius: 8, alignItems: 'center' },
  actionText: { ...typography.h3, color: colors.white },
});
