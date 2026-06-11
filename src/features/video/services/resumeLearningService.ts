import { useState, useEffect } from 'react';

export interface ResumeData {
  lessonId: string | null;
  moduleId: string | null;
  position: number; // in seconds
}

// In a real app, this would use AsyncStorage or an API.
// For now, we keep it in memory as a singleton.
let inMemoryResumeData: ResumeData = {
  lessonId: 'l3',
  moduleId: 'm1',
  position: 315, // 05:15
};

export class ResumeLearningService {
  static async savePosition(moduleId: string, lessonId: string, position: number): Promise<void> {
    inMemoryResumeData = { moduleId, lessonId, position };
  }

  static async getResumeData(): Promise<ResumeData> {
    return inMemoryResumeData;
  }
}

// React Hook for easy access
export const useResumeLearning = () => {
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);

  useEffect(() => {
    ResumeLearningService.getResumeData().then(setResumeData);
  }, []);

  return {
    resumeData,
    savePosition: ResumeLearningService.savePosition
  };
};
