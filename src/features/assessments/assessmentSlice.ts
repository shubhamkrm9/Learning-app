import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AssessmentResult } from '../../core/types/models';

export interface AssessmentState {
  currentAssessmentId: string | null;
  answers: Record<string, number>;
  score: number;
  isPassed: boolean;
  loading: boolean;
  currentQuestionIndex: number;
  totalQuestions: number;
  pastResults: Record<string, AssessmentResult>;
}

const initialState: AssessmentState = {
  currentAssessmentId: null,
  answers: {},
  score: 0,
  isPassed: false,
  loading: false,
  currentQuestionIndex: 0,
  totalQuestions: 0,
  pastResults: {},
};

const assessmentSlice = createSlice({
  name: 'assessment',
  initialState,
  reducers: {
    setAssessment(state, action: PayloadAction<{ assessmentId: string; totalQuestions: number }>) {
      state.currentAssessmentId = action.payload.assessmentId;
      state.totalQuestions = action.payload.totalQuestions;
      state.answers = {};
      state.score = 0;
      state.isPassed = false;
      state.currentQuestionIndex = 0;
    },
    saveAnswer(state, action: PayloadAction<{ questionId: string; selectedAnswer: number }>) {
      state.answers[action.payload.questionId] = action.payload.selectedAnswer;
    },
    setAssessmentResult(state, action: PayloadAction<AssessmentResult>) {
      state.score = action.payload.scorePercent;
      state.isPassed = action.payload.isPass;
      state.loading = false;
      
      const prevResult = state.pastResults[action.payload.assessmentId];
      const attempts = (prevResult?.attempts || 0) + 1;
      const bestScore = Math.max(prevResult?.bestScore || 0, action.payload.scorePercent);
      
      state.pastResults[action.payload.assessmentId] = {
        ...action.payload,
        attempts,
        bestScore,
        lastScore: action.payload.scorePercent
      };
    },
    setAssessmentLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    nextQuestion(state) {
      if (state.currentQuestionIndex < state.totalQuestions - 1) {
        state.currentQuestionIndex += 1;
      }
    },
    previousQuestion(state) {
      if (state.currentQuestionIndex > 0) {
        state.currentQuestionIndex -= 1;
      }
    },
    resetAssessment() {
      // Retain past results when resetting active assessment
      return { ...initialState, pastResults: { ...initialState.pastResults } };
    },
  },
  selectors: {
    selectAssessment: (state) => state,
    selectAssessmentScore: (state) => state.score,
    selectAssessmentStatus: (state) => state.isPassed,
    selectAssessmentLoading: (state) => state.loading,
    selectCurrentQuestionIndex: (state) => state.currentQuestionIndex,
    selectAnswers: (state) => state.answers,
    selectPastResults: (state) => state.pastResults,
    selectAssessmentResultById: (state) => (id: string) => state.pastResults[id],
  },
});

export const {
  setAssessment,
  saveAnswer,
  setAssessmentResult,
  setAssessmentLoading,
  nextQuestion,
  previousQuestion,
  resetAssessment,
} = assessmentSlice.actions;

export const {
  selectAssessment,
  selectAssessmentScore,
  selectAssessmentStatus,
  selectAssessmentLoading,
  selectCurrentQuestionIndex,
  selectAnswers,
  selectPastResults,
  selectAssessmentResultById,
} = assessmentSlice.selectors;

export default assessmentSlice.reducer;
