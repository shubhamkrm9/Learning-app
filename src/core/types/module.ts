/**
 * Learning Module SDK - Module Domain Models
 *
 * All interfaces are assumptions and may change once
 * Django API contracts are finalized.
 */

export interface Module {
  id: string;
  title: string;
  description: string;
  totalVideos: number;
  completedVideos: number;
  completionPercentage: number;
  isLocked: boolean;
  isCompleted: boolean;
}

export interface VideoLesson {
  id: string;
  title: string;
  duration: number;
  watchedPercentage: number;
  isCompleted: boolean;
  videoUrl?: string;
  thumbnailUrl?: string;
}

export interface ModuleDetail {
  id: string;
  title: string;
  completionPercentage: number;
  videos: VideoLesson[];
  assessment: AssessmentInfo;
}

export interface AssessmentInfo {
  id: string;
  isUnlocked: boolean;
  passingPercentage: number;
}
