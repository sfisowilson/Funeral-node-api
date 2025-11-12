
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db/database';
import { v4 as uuidv4 } from 'uuid';

interface ClaimAttributes {
  id: string;
  tenantId: string;
  // Core claim information
  memberId?: string;
  policyId?: string;
  claimAmount?: number;
  claimDate?: Date;
  dateOfDeath?: Date;
  causeOfDeath?: string;
  placeOfDeath?: string;
  status?: string; // ClaimStatus enum
  description?: string;
  // Claim type and classification
  claimType?: string; // ClaimType enum
  claimantType?: string; // ClaimantType enum
  // Claimant information (who is making the claim)
  claimantId?: string;
  claimantName?: string;
  claimantEmail?: string;
  claimantPhone?: string;
  claimantIdNumber?: string;
  claimantAddress?: string;
  // Deceased information
  deceasedPersonId?: string;
  deceasedPersonName?: string;
  deceasedPersonIdNumber?: string;
  relationshipToDeceased?: string;
  // Beneficiary and Dependent references
  beneficiaryId?: string;
  dependentId?: string;
  // Banking details for payment
  bankName?: string;
  accountNumber?: string;
  branchCode?: string;
  accountHolderName?: string;
  // Funeral service details
  funeralServiceProvider?: string;
  estimatedFuneralCosts?: number;
  proposedFuneralDate?: Date;
  funeralLocation?: string;
  // Verification status
  isIdentityVerified?: boolean;
  isDeathVerified?: boolean;
  isPolicyVerified?: boolean;
  isRelationshipVerified?: boolean;
  // Document checklist
  hasDeathCertificate?: boolean;
  hasIdentityDocuments?: boolean;
  hasMedicalReports?: boolean;
  hasPoliceReport?: boolean;
  hasProofOfRelationship?: boolean;
  hasBankingDetails?: boolean;
  // Assessment details
  assessedAmount?: number;
  assessmentNotes?: string;
  assessedBy?: string;
  assessedAt?: Date;
  // Approval details
  approvedAmount?: number;
  approvalNotes?: string;
  approvedBy?: string;
  approvedAt?: Date;
  // Payment information
  paymentReference?: string;
  paymentDate?: Date;
  paidAmount?: number;
  processedBy?: string;
  // Additional fields
  rejectionReason?: string;
  requiresManagerApproval?: boolean;
  isFraudulent?: boolean;
  fraudNotes?: string;
  priority?: number; // 1=High, 2=Medium, 3=Normal, 4=Low
  expectedCompletionDate?: Date;
  // Communication tracking
  lastContactDate?: Date;
  lastContactMethod?: string;
  nextActionRequired?: string;
  nextFollowUpDate?: Date;
  // Audit
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
  updatedBy?: string;
}

interface ClaimCreationAttributes extends Optional<ClaimAttributes, 'id'> {}

class Claim extends Model<ClaimAttributes, ClaimCreationAttributes> implements ClaimAttributes {
  public id!: string;
  public tenantId!: string;
  public memberId?: string;
  public policyId?: string;
  public claimAmount?: number;
  public claimDate?: Date;
  public dateOfDeath?: Date;
  public causeOfDeath?: string;
  public placeOfDeath?: string;
  public status?: string;
  public description?: string;
  public claimType?: string;
  public claimantType?: string;
  public claimantId?: string;
  public claimantName?: string;
  public claimantEmail?: string;
  public claimantPhone?: string;
  public claimantIdNumber?: string;
  public claimantAddress?: string;
  public deceasedPersonId?: string;
  public deceasedPersonName?: string;
  public deceasedPersonIdNumber?: string;
  public relationshipToDeceased?: string;
  public beneficiaryId?: string;
  public dependentId?: string;
  public bankName?: string;
  public accountNumber?: string;
  public branchCode?: string;
  public accountHolderName?: string;
  public funeralServiceProvider?: string;
  public estimatedFuneralCosts?: number;
  public proposedFuneralDate?: Date;
  public funeralLocation?: string;
  public isIdentityVerified?: boolean;
  public isDeathVerified?: boolean;
  public isPolicyVerified?: boolean;
  public isRelationshipVerified?: boolean;
  public hasDeathCertificate?: boolean;
  public hasIdentityDocuments?: boolean;
  public hasMedicalReports?: boolean;
  public hasPoliceReport?: boolean;
  public hasProofOfRelationship?: boolean;
  public hasBankingDetails?: boolean;
  public assessedAmount?: number;
  public assessmentNotes?: string;
  public assessedBy?: string;
  public assessedAt?: Date;
  public approvedAmount?: number;
  public approvalNotes?: string;
  public approvedBy?: string;
  public approvedAt?: Date;
  public paymentReference?: string;
  public paymentDate?: Date;
  public paidAmount?: number;
  public processedBy?: string;
  public rejectionReason?: string;
  public requiresManagerApproval?: boolean;
  public isFraudulent?: boolean;
  public fraudNotes?: string;
  public priority?: number;
  public expectedCompletionDate?: Date;
  public lastContactDate?: Date;
  public lastContactMethod?: string;
  public nextActionRequired?: string;
  public nextFollowUpDate?: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public createdBy?: string;
  public updatedBy?: string;
}

Claim.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      primaryKey: true,
    },
    tenantId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    memberId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    policyId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    claimAmount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
    },
    claimDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    dateOfDeath: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    causeOfDeath: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    placeOfDeath: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: 'Pending',
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    claimType: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    claimantType: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    claimantId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    claimantName: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    claimantEmail: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    claimantPhone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    claimantIdNumber: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    claimantAddress: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    deceasedPersonId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    deceasedPersonName: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    deceasedPersonIdNumber: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    relationshipToDeceased: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    beneficiaryId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    dependentId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    bankName: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    accountNumber: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    branchCode: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    accountHolderName: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    funeralServiceProvider: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    estimatedFuneralCosts: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
    },
    proposedFuneralDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    funeralLocation: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    isIdentityVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    isDeathVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    isPolicyVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    isRelationshipVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    hasDeathCertificate: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    hasIdentityDocuments: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    hasMedicalReports: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    hasPoliceReport: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    hasProofOfRelationship: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    hasBankingDetails: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    assessedAmount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
    },
    assessmentNotes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    assessedBy: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    assessedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    approvedAmount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
    },
    approvalNotes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    approvedBy: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    approvedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    paymentReference: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    paymentDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    paidAmount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
    },
    processedBy: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    rejectionReason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    requiresManagerApproval: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    isFraudulent: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    fraudNotes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    priority: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 3, // 1=High, 2=Medium, 3=Normal, 4=Low
    },
    expectedCompletionDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    lastContactDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    lastContactMethod: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    nextActionRequired: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    nextFollowUpDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    updatedBy: {
      type: DataTypes.UUID,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Claim',
    tableName: 'Claims',
    timestamps: true,
  }
);

export default Claim;