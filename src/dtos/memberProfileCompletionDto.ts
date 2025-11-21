export interface MemberProfileCompletionDto {
  id: string;
  memberId: string;
  hasDependents: boolean;
  hasBeneficiaries: boolean;
  hasUploadedIdDocument: boolean;
  hasAcceptedTerms: boolean;
  hasCompletedCustomForms: boolean;
  hasUploadedRequiredDocuments: boolean;
  isProfileComplete: boolean;
  profileCompletedAt: Date | null | undefined;
  completionPercentage: number;
  nextStepRecommendation: string | null;
}