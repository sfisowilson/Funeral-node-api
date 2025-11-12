import Member from '../models/member';
import Dependent from '../models/dependent';
import FileMetadata from '../models/fileMetadata';
import { Op } from 'sequelize';

export enum MemberDocumentType {
  IdentificationDocument = 'IdentificationDocument',
  ProofOfAddress = 'ProofOfAddress',
  MarriageCertificate = 'MarriageCertificate',
  Passport = 'Passport',
  WorkPermit = 'WorkPermit',
  BirthCertificate = 'BirthCertificate',
  BankingDocument = 'BankingDocument',
}

export enum DocumentVerificationStatus {
  Pending = 'Pending',
  Approved = 'Approved',
  Rejected = 'Rejected',
  RequiresResubmission = 'RequiresResubmission',
}

export interface DocumentRequirement {
  documentType: MemberDocumentType;
  documentName: string;
  requirementReason: string;
  isRequired: boolean;
  isUploaded: boolean;
  fileMetadataId?: string;
  verificationStatus?: DocumentVerificationStatus;
}

export interface DocumentComplianceStatus {
  isCompliant: boolean;
  totalRequired: number;
  totalUploaded: number;
  totalApproved: number;
  missingDocuments: DocumentRequirement[];
  pendingVerification: DocumentRequirement[];
  rejectedDocuments: DocumentRequirement[];
}

/**
 * Document Requirement Service - Manages conditional document requirements
 * Migrated from C# DocumentRequirementService.cs with Phase 4 enhancement
 */
export class DocumentRequirementService {
  private logger = {
    info: (message: string, ...args: any[]) => console.log(`[INFO] ${message}`, ...args),
    error: (message: string, error?: any) => console.error(`[ERROR] ${message}`, error),
    warn: (message: string, ...args: any[]) => console.warn(`[WARN] ${message}`, ...args),
  };

  /**
   * Get required documents for a member based on their profile (C# GetRequiredDocumentsForMemberAsync)
   */
  async getRequiredDocumentsForMemberAsync(
    memberId: string,
    tenantId: string
  ): Promise<DocumentRequirement[]> {
    try {
      // Get member with dependents
      const member = await Member.findOne({
        where: { id: memberId, tenantId },
        include: [{ association: 'dependents', model: Dependent }],
      });

      if (!member) {
        this.logger.warn(
          `Member ${memberId} not found for tenant ${tenantId}`
        );
        return [];
      }

      // Get uploaded documents for this member
      const uploadedDocuments = await FileMetadata.findAll({
        where: {
          entityType: 'Member',
          entityId: memberId,
          tenantId,
        },
      }).then(docs => docs.filter(d => d.memberDocumentType != null));

      const requirements: DocumentRequirement[] = [];

      // ========== ALWAYS REQUIRED DOCUMENTS ==========

      // 1. Identification Document (ALWAYS REQUIRED)
      requirements.push(
        this.createRequirement(
          MemberDocumentType.IdentificationDocument,
          'Identification Document',
          'Required for all members - SA ID or Passport',
          true,
          uploadedDocuments
        )
      );

      // 2. Proof of Address (ALWAYS REQUIRED)
      requirements.push(
        this.createRequirement(
          MemberDocumentType.ProofOfAddress,
          'Proof of Residential Address',
          'Required for all members - Utility bill, bank statement, or lease agreement',
          true,
          uploadedDocuments
        )
      );

      // ========== CONDITIONAL DOCUMENTS BASED ON MEMBER PROFILE ==========

      // 3. Marriage Certificate (REQUIRED if member has spouse dependent)
      const dependents = (member as any).dependents || [];
      const hasSpouse = dependents.some((d: any) => d.dependentType === 'Spouse');
      if (hasSpouse) {
        requirements.push(
          this.createRequirement(
            MemberDocumentType.MarriageCertificate,
            'Marriage Certificate',
            'Required because member has a spouse dependent',
            true,
            uploadedDocuments
          )
        );
      }

      // 4. Passport (REQUIRED if IsForeigner = true)
      if ((member as any).isForeigner) {
        requirements.push(
          this.createRequirement(
            MemberDocumentType.Passport,
            'Valid Passport',
            'Required for foreign nationals',
            true,
            uploadedDocuments
          )
        );

        // 5. Work Permit (REQUIRED if IsForeigner = true)
        requirements.push(
          this.createRequirement(
            MemberDocumentType.WorkPermit,
            'Work Permit / Visa',
            'Required for foreign nationals residing in South Africa',
            true,
            uploadedDocuments
          )
        );
      }

      // ========== OPTIONAL DOCUMENTS ==========

      // Birth Certificate (Optional)
      requirements.push(
        this.createRequirement(
          MemberDocumentType.BirthCertificate,
          'Birth Certificate',
          'Optional - May be required for dependents',
          false,
          uploadedDocuments
        )
      );

      // Banking Document (Optional)
      requirements.push(
        this.createRequirement(
          MemberDocumentType.BankingDocument,
          'Banking Details Confirmation',
          'Optional - Proof of banking details',
          false,
          uploadedDocuments
        )
      );

      this.logger.info(
        `Generated ${requirements.filter(r => r.isRequired).length} required and ${requirements.filter(r => !r.isRequired).length} optional documents for member ${memberId}`
      );

      return requirements;
    } catch (error) {
      this.logger.error(
        `Error getting required documents for member ${memberId}`,
        error
      );
      throw error;
    }
  }

  /**
   * Check if member has uploaded all required documents (C# CheckMemberDocumentComplianceAsync)
   */
  async checkMemberDocumentComplianceAsync(
    memberId: string,
    tenantId: string
  ): Promise<DocumentComplianceStatus> {
    try {
      const allRequirements = await this.getRequiredDocumentsForMemberAsync(
        memberId,
        tenantId
      );

      const requiredDocs = allRequirements.filter(r => r.isRequired);
      const uploadedDocs = requiredDocs.filter(r => r.isUploaded);
      const approvedDocs = uploadedDocs.filter(
        r => r.verificationStatus === DocumentVerificationStatus.Approved
      );
      const missingDocs = requiredDocs.filter(r => !r.isUploaded);
      const pendingDocs = uploadedDocs.filter(
        r => r.verificationStatus === DocumentVerificationStatus.Pending
      );
      const rejectedDocs = uploadedDocs.filter(
        r =>
          r.verificationStatus === DocumentVerificationStatus.Rejected ||
          r.verificationStatus === DocumentVerificationStatus.RequiresResubmission
      );

      const status: DocumentComplianceStatus = {
        isCompliant: missingDocs.length === 0 && rejectedDocs.length === 0,
        totalRequired: requiredDocs.length,
        totalUploaded: uploadedDocs.length,
        totalApproved: approvedDocs.length,
        missingDocuments: missingDocs,
        pendingVerification: pendingDocs,
        rejectedDocuments: rejectedDocs,
      };

      this.logger.info(
        `Member ${memberId} compliance: ${status.isCompliant} - ${status.totalUploaded}/${status.totalRequired} uploaded, ${status.totalApproved} approved`
      );

      return status;
    } catch (error) {
      this.logger.error(
        `Error checking document compliance for member ${memberId}`,
        error
      );
      throw error;
    }
  }

  /**
   * Get missing documents for a member (C# GetMissingDocumentsAsync)
   */
  async getMissingDocumentsAsync(
    memberId: string,
    tenantId: string
  ): Promise<DocumentRequirement[]> {
    const allRequirements = await this.getRequiredDocumentsForMemberAsync(
      memberId,
      tenantId
    );
    return allRequirements.filter(r => r.isRequired && !r.isUploaded);
  }

  /**
   * Helper method to create a document requirement with upload status (C# CreateRequirement)
   */
  private createRequirement(
    documentType: MemberDocumentType,
    documentName: string,
    requirementReason: string,
    isRequired: boolean,
    uploadedDocuments: any[]
  ): DocumentRequirement {
    const uploaded = uploadedDocuments.find(
      d => d.memberDocumentType === documentType
    );

    return {
      documentType,
      documentName,
      requirementReason,
      isRequired,
      isUploaded: !!uploaded,
      fileMetadataId: uploaded?.id,
      verificationStatus: uploaded?.verificationStatus as DocumentVerificationStatus,
    };
  }
}

export const documentRequirementService = new DocumentRequirementService();
