import Claim from '../models/claim';
import Member from '../models/member';
import Policy from '../models/policy';
import Beneficiary from '../models/beneficiary';

export interface ClaimValidationResult {
  isValid: boolean;
  isMemberValid: boolean;
  isPolicyValid: boolean;
  isBeneficiaryValid: boolean;
  isBeneficiaryAuthorized: boolean;
  maxClaimAmount: number;
  recommendedAmount: number;
  validationErrors: string[];
}

/**
 * Claim Validation Service - Validates claims before processing
 * Migrated from C# ClaimValidationService.cs
 */
export class ClaimValidationService {
  private logger = {
    info: (message: string, ...args: any[]) => console.log(`[INFO] ${message}`, ...args),
    error: (message: string, error?: any) => console.error(`[ERROR] ${message}`, error),
    warn: (message: string, ...args: any[]) => console.warn(`[WARN] ${message}`, ...args),
  };

  /**
   * Validate a claim before creation (C# ValidateClaimAsync)
   */
  async validateClaimAsync(
    claimDto: any,
    tenantId: string
  ): Promise<ClaimValidationResult> {
    const result: ClaimValidationResult = {
      isValid: false,
      isMemberValid: false,
      isPolicyValid: false,
      isBeneficiaryValid: false,
      isBeneficiaryAuthorized: false,
      maxClaimAmount: 0,
      recommendedAmount: 0,
      validationErrors: [],
    };

    try {
      // Validate member
      const member = await Member.findOne({
        where: { id: claimDto.memberId, tenantId },
      });

      if (!member) {
        result.validationErrors.push('Member not found');
        result.isMemberValid = false;
      } else {
        result.isMemberValid = true;
      }

      // Validate policy
      const policy = await Policy.findOne({
        where: { id: claimDto.policyId, tenantId },
      });

      if (!policy) {
        result.validationErrors.push('Policy not found');
        result.isPolicyValid = false;
      } else {
        result.isPolicyValid = true;
        result.maxClaimAmount = policy.coverageAmount || 0;
      }

      // Validate beneficiary
      if (claimDto.beneficiaryId && claimDto.beneficiaryId !== '00000000-0000-0000-0000-000000000000') {
        const beneficiary = await Beneficiary.findOne({
          where: { id: claimDto.beneficiaryId, tenantId },
        });

        result.isBeneficiaryValid = !!beneficiary;
        if (!result.isBeneficiaryValid) {
          result.validationErrors.push('Beneficiary not found');
        }
      }

      // Check for duplicate claims
      const hasDuplicates = await this.checkForDuplicateClaimsAsync(
        claimDto.memberId,
        claimDto.dateOfDeath,
        tenantId
      );

      if (hasDuplicates) {
        result.validationErrors.push('Duplicate claim detected for this member and date of death');
      }

      // Set overall validity
      result.isValid = result.validationErrors.length === 0;
      result.recommendedAmount = Math.min(
        claimDto.requestedAmount || 0,
        result.maxClaimAmount
      );

      return result;
    } catch (error) {
      this.logger.error(
        `Error validating claim for member ${claimDto.memberId}`,
        error
      );
      result.isValid = false;
      result.validationErrors.push('Validation failed due to system error');
      return result;
    }
  }

  /**
   * Validate policy eligibility (C# ValidatePolicyEligibilityAsync)
   */
  async validatePolicyEligibilityAsync(
    memberId: string,
    policyId: string,
    tenantId: string
  ): Promise<ClaimValidationResult> {
    const result: ClaimValidationResult = {
      isValid: false,
      isMemberValid: false,
      isPolicyValid: false,
      isBeneficiaryValid: false,
      isBeneficiaryAuthorized: false,
      maxClaimAmount: 0,
      recommendedAmount: 0,
      validationErrors: [],
    };

    try {
      // Check if member has active policy enrollment
      // In simplified Node model, check if Policy is related to Member
      const policy = await Policy.findOne({
        where: { id: policyId, tenantId },
      });

      if (!policy) {
        result.validationErrors.push('No active policy enrollment found');
        result.isPolicyValid = false;
      } else {
        result.isPolicyValid = true;
        result.maxClaimAmount = policy.coverageAmount || 0;
      }

      result.isValid = result.validationErrors.length === 0;
      return result;
    } catch (error) {
      this.logger.error(
        `Error validating policy eligibility for member ${memberId} and policy ${policyId}`,
        error
      );
      result.isValid = false;
      result.validationErrors.push('Policy validation failed due to system error');
      return result;
    }
  }

  /**
   * Validate beneficiary (C# ValidateBeneficiaryAsync)
   */
  async validateBeneficiaryAsync(
    beneficiaryId: string,
    memberId: string,
    tenantId: string
  ): Promise<ClaimValidationResult> {
    const result: ClaimValidationResult = {
      isValid: false,
      isMemberValid: false,
      isPolicyValid: false,
      isBeneficiaryValid: false,
      isBeneficiaryAuthorized: true,
      maxClaimAmount: 0,
      recommendedAmount: 0,
      validationErrors: [],
    };

    try {
      const beneficiary = await Beneficiary.findOne({
        where: { id: beneficiaryId, memberId, tenantId },
      });

      if (!beneficiary) {
        result.validationErrors.push(
          'Beneficiary not found or not associated with the member'
        );
        result.isBeneficiaryValid = false;
      } else {
        result.isBeneficiaryValid = true;
        result.isBeneficiaryAuthorized = true;
      }

      result.isValid = result.validationErrors.length === 0;
      return result;
    } catch (error) {
      this.logger.error(
        `Error validating beneficiary ${beneficiaryId} for member ${memberId}`,
        error
      );
      result.isValid = false;
      result.validationErrors.push('Beneficiary validation failed due to system error');
      return result;
    }
  }

  /**
   * Check for duplicate claims (C# CheckForDuplicateClaimsAsync)
   */
  async checkForDuplicateClaimsAsync(
    memberId: string,
    dateOfDeath: Date,
    tenantId: string
  ): Promise<boolean> {
    try {
      const startOfDay = new Date(dateOfDeath);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(dateOfDeath);
      endOfDay.setHours(23, 59, 59, 999);

      const existingClaim = await Claim.count({
        where: {
          memberId,
          tenantId,
          dateOfDeath: {
            [require('sequelize').Op.between]: [startOfDay, endOfDay],
          },
        },
      });

      return existingClaim > 0;
    } catch (error) {
      this.logger.error(
        `Error checking for duplicate claims for member ${memberId}`,
        error
      );
      return false;
    }
  }

  /**
   * Calculate maximum claim amount (C# CalculateMaxClaimAmountAsync)
   */
  async calculateMaxClaimAmountAsync(
    policyId: string,
    tenantId: string
  ): Promise<number> {
    try {
      const policy = await Policy.findOne({
        where: { id: policyId, tenantId },
      });

      return policy?.coverageAmount || 0;
    } catch (error) {
      this.logger.error(
        `Error calculating max claim amount for policy ${policyId}`,
        error
      );
      return 0;
    }
  }

  /**
   * Get required documents for claim (C# GetRequiredDocumentsAsync)
   */
  async getRequiredDocumentsAsync(claimDto: any): Promise<string[]> {
    try {
      const requiredDocs = [
        'Death Certificate',
        'Identity Document of Deceased',
        'Identity Document of Beneficiary',
      ];

      // Add conditional documents based on cause of death
      if (claimDto.causeOfDeath && claimDto.causeOfDeath.length > 0) {
        const cause = claimDto.causeOfDeath.toLowerCase();

        if (cause.includes('accident')) {
          requiredDocs.push('Police Report');
          requiredDocs.push('Medical Report');
        } else if (cause.includes('natural')) {
          requiredDocs.push('Medical Report');
        }
      }

      return requiredDocs;
    } catch (error) {
      this.logger.error('Error getting required documents for claim', error);
      return ['Death Certificate', 'Identity Document'];
    }
  }
}

export const claimValidationService = new ClaimValidationService();
