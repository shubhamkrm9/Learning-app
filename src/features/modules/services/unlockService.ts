/**
 * Learning Module SDK - Unlock Service
 *
 * Evaluates whether the next module should be unlocked,
 * and checks if a module is fully completed.
 */

import type { RootState } from '../store';
import { unlockModule } from '../store/slices/progressSlice';

/**
 * Check if module is complete: all lessons watched AND all assessments passed.
 * Returns true if module is fully complete.
 */
export const checkModuleCompletion =
  (moduleId: string, totalVideoLessons: number, videoLessonIds: string[]) =>
  (_dispatch: any, getState: any): boolean => {
    const state = getState() as RootState;

    // Check all video lessons are completed
    const completedLessons = state.progress.completedLessons;
    const allLessonsComplete = videoLessonIds.every((id) =>
      completedLessons.includes(id),
    );

    // Check all assessments for video lessons are passed
    const pastResults = state.assessment.pastResults;
    const allAssessmentsPassed = videoLessonIds.every((lessonId) => {
      const assessmentId = `a-${lessonId}`;
      const result = pastResults[assessmentId];
      return result && result.isPass;
    });

    return allLessonsComplete && allAssessmentsPassed;
  };

/**
 * Unlock the next module in sequence after current module is completed.
 */
export const evaluateModuleUnlock =
  (currentModuleId: string) => (dispatch: any, getState: any) => {
    const state = getState() as RootState;
    const modules = state.module.modules;

    // Find current module index
    const currentIdx = modules.findIndex(
      (m: any) => m.id === currentModuleId,
    );
    if (currentIdx < 0 || currentIdx >= modules.length - 1) return;

    // Find next locked module
    const nextModule = modules[currentIdx + 1];
    if (nextModule && (nextModule as any).status === 'LOCKED') {
      dispatch(unlockModule(nextModule.id));
      dispatch({
        type: 'module/updateModule',
        payload: { ...nextModule, status: 'AVAILABLE' },
      });
    }
  };
