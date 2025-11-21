
import { MemberProfileCompletionDto } from './memberProfileCompletionDto';

export interface ProfileCompletionStatusDto {
  isComplete: boolean;
  dependentsCount: number;
  beneficiariesCount: number;
  hasAcceptedLatestTerms: boolean;
  uploadedDocumentsCount: number;
  requiredDocumentsCount: number;
  completionPercentage: number;
  profileCompletion: MemberProfileCompletionDto | null;
  completedSteps: string[];
  remainingSteps: string[];
  nextStepRecommendation: string | null;
}
