import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  SafeAreaView,
} from 'react-native';
import { VideoPlayer } from '../components/VideoPlayer';
import { LessonTabs } from '../components/LessonTabs';
import { ModuleRepository } from '../../modules/moduleApi';

import { API_URLS } from '../../../core/api/apiConfig';
import { colors } from '../../../core/theme/colors';
import { typography } from '../../../core/theme/typography';
import { spacing } from '../../../core/theme/spacing';
import { useAppDispatch, useAppSelector } from '../../../core/store';
import {
  markLessonCompleted,
  unlockAssessment,
  setVideoWatchPercent,
} from '../../progress/progressSlice';
import type { Lesson, ModuleSection } from '../../../core/types/models';

export const VideoPlayerScreen = ({ route, navigation }: any) => {
  const dispatch = useAppDispatch();
  const { lessonId, moduleId } = route.params;
  const [lessonData, setLessonData] = useState<Lesson | null>(null);
  const [allLessons, setAllLessons] = useState<Lesson[]>([]);
  const [hasReached80, setHasReached80] = useState(false);
  const [showUnlockBanner, setShowUnlockBanner] = useState(false);

  // Read unlock state from Redux
  const unlockedAssessments = useAppSelector(
    (state) => state.progress.unlockedAssessments,
  );
  const isAssessmentUnlocked =
    unlockedAssessments.includes(lessonId) || hasReached80;

  useEffect(() => {
    ModuleRepository.getModuleSections(moduleId).then(
      (sections: ModuleSection[]) => {
        const flatLessons: Lesson[] = [];
        for (const sec of sections) {
          for (const l of sec.lessons) {
            flatLessons.push(l);
            if (l.id === lessonId) {
              setLessonData(l);
            }
          }
        }
        setAllLessons(flatLessons);
      },
    );
  }, [lessonId, moduleId]);

  // Check if assessment was previously unlocked
  useEffect(() => {
    if (unlockedAssessments.includes(lessonId)) {
      setHasReached80(true);
    }
  }, [unlockedAssessments, lessonId]);

  const handleProgressPercent = useCallback(
    (percent: number) => {
      dispatch(setVideoWatchPercent({ lessonId, percent }));

      // 80% threshold — unlock assessment
      if (percent >= 80 && !hasReached80 && lessonData?.assessmentId) {
        setHasReached80(true);
        setShowUnlockBanner(true);
        dispatch(unlockAssessment(lessonId));

        // Hide banner after 4 seconds
        setTimeout(() => setShowUnlockBanner(false), 4000);
      }
    },
    [hasReached80, lessonData, lessonId, dispatch],
  );

  const handleVideoEnd = useCallback(() => {
    if (!lessonData) return;
    console.log('Video ended — marking lesson completed');
    dispatch(
      markLessonCompleted({
        lessonId,
        moduleId,
        title: lessonData.title,
      }),
    );
  }, [lessonData, lessonId, moduleId, dispatch]);

  // Find next lesson
  const currentIndex = allLessons.findIndex((l) => l.id === lessonId);
  const nextLesson =
    currentIndex >= 0 && currentIndex < allLessons.length - 1
      ? allLessons[currentIndex + 1]
      : null;
  const prevLesson =
    currentIndex > 0 ? allLessons[currentIndex - 1] : null;

  if (!lessonData) return null;

  const baseUrl = useAppSelector((state) => state.app.baseUrl);

  // Build video URL: prefer API stream URL, fallback to mock videoUrl
  const videoUrl =
    baseUrl
      ? `${baseUrl.replace(/\/$/, '')}${API_URLS.VIDEO_STREAM(lessonId)}`
      : lessonData.videoUrl;

  const startPosition = 0;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {lessonData.title}
        </Text>
      </View>

      {/* Assessment Unlocked Banner */}
      {showUnlockBanner && (
        <View style={styles.unlockBanner}>
          <Text style={styles.unlockBannerText}>
            Assessment Unlocked! You've watched 80% of this video.
          </Text>
        </View>
      )}

      {/* Video Player Component */}
      <VideoPlayer
        videoUrl={videoUrl}
        initialPosition={startPosition}
        onProgressPercent={handleProgressPercent}
        onEnd={handleVideoEnd}
        seekLocked={!isAssessmentUnlocked}
      />

      {/* Lesson Meta */}
      <View style={styles.metaContainer}>
        <Text style={styles.title}>{lessonData.title}</Text>
        <Text style={styles.meta}>⏱ {lessonData.durationString}</Text>
      </View>

      {/* Take Assessment Button (shows after 80%) */}
      {isAssessmentUnlocked && lessonData.assessmentId && (
        <TouchableOpacity
          style={styles.assessmentButton}
          onPress={() =>
            navigation.navigate('Assessment', {
              assessmentId: lessonData.assessmentId,
              videoId: lessonId,
              moduleId,
            })
          }
        >
          <Text style={styles.assessmentButtonText}>
            📝 Take Assessment
          </Text>
        </TouchableOpacity>
      )}

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <LessonTabs description={lessonData.description} />
        <Text>and the url used for this video is for {videoUrl}</Text>
      </View>

      {/* Footer Navigation */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.navButton, !prevLesson && styles.navButtonDisabled]}
          disabled={!prevLesson}
          onPress={() => {
            if (prevLesson) {
              navigation.replace('VideoPlayer', {
                lessonId: prevLesson.id,
                moduleId,
              });
            }
          }}
        >
          <Text
            style={[
              styles.navText,
              !prevLesson && styles.navTextDisabled,
            ]}
          >
            ← Previous
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.navButtonPrimary,
            !nextLesson && styles.navButtonDisabled,
          ]}
          disabled={!nextLesson}
          onPress={() => {
            if (nextLesson) {
              navigation.replace('VideoPlayer', {
                lessonId: nextLesson.id,
                moduleId,
              });
            }
          }}
        >
          <Text
            style={[
              styles.navTextPrimary,
              !nextLesson && styles.navTextDisabled,
            ]}
          >
            Next Lesson →
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.m,
    backgroundColor: colors.white,
  },
  backButton: { marginRight: spacing.m },
  backText: { ...typography.bodyMedium, color: colors.primary },
  headerTitle: { ...typography.h3, color: colors.textMain, flex: 1 },

  unlockBanner: {
    backgroundColor: colors.success,
    padding: spacing.m,
    alignItems: 'center',
  },
  unlockBannerText: {
    ...typography.bodyMedium,
    color: colors.white,
  },

  metaContainer: { padding: spacing.m, backgroundColor: colors.white },
  title: {
    ...typography.h1,
    color: colors.textMain,
    marginBottom: spacing.s,
  },
  meta: { ...typography.body, color: colors.textMuted },

  assessmentButton: {
    backgroundColor: colors.success,
    margin: spacing.m,
    padding: spacing.m,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 3,
  },
  assessmentButtonText: {
    ...typography.h3,
    color: colors.white,
  },

  tabsContainer: { flex: 1, backgroundColor: colors.white },

  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: spacing.m,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.white,
  },
  navButton: { padding: spacing.m },
  navButtonDisabled: { opacity: 0.4 },
  navText: { ...typography.bodyMedium, color: colors.textMain },
  navTextDisabled: { color: colors.textMuted },
  navButtonPrimary: {
    padding: spacing.m,
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  navTextPrimary: { ...typography.bodyMedium, color: colors.white },
});
