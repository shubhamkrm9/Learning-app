/**
 * Learning Module SDK - Assessment API
 *
 * GET /assessments/:assessmentId — Fetch assessment questions
 * POST /assessments/submit — Submit assessment answers
 */

import { baseApi } from './baseApi';
import type {
  Assessment,
  AssessmentSubmission,
  AssessmentResult,
} from '../core/types/assessment';

import assessmentsMock from '../mocks/assessments.json';

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(() => resolve(), ms));

export const assessmentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAssessment: builder.query<Assessment, string>({
      queryFn: async (assessmentId) => {
        await delay(500);
        const detail = (assessmentsMock as any)[assessmentId];
        if (!detail) {
          return { error: { status: 404, data: 'Not found' } };
        }
        return { data: detail.data as Assessment };
      },
      providesTags: (_result, _error, assessmentId) => [
        { type: 'Assessment', id: assessmentId },
      ],
    }),
    submitAssessment: builder.mutation<
      AssessmentResult,
      AssessmentSubmission
    >({
      queryFn: async (_body) => {
        await delay(500);
        return {
          data: {
            score: 100,
            passed: true,
            minimumRequired: 75,
          },
        };
      },
      invalidatesTags: ['Assessment'],
    }),
  }),
});

export const { useGetAssessmentQuery, useSubmitAssessmentMutation } =
  assessmentApi;

