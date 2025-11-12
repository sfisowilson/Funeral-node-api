import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db/database';
import { v4 as uuidv4 } from 'uuid';

enum ClaimDocumentType {
  DeathCertificate = 1,
  IdentityDocument = 2,
  MedicalReport = 3,
  PoliceReport = 4,
  BeneficiaryIdentity = 5,
  PowerOfAttorney = 6,
  BankStatement = 7,
  MarriageCertificate = 8,
  BirthCertificate = 9,
  Other = 10
}

enum ClaimDocumentStatus {
  Pending = 1,
  UnderReview = 2,
  Approved = 3,
  Rejected = 4,
  RequiresReplacement = 5
}

interface ClaimDocumentAttributes {
  id: string;
  tenantId: string;
  claimId: string;
  fileName: string;
  originalFileName: string;
  filePath: string;
  contentType: string;
  fileSize: number;
  documentType: ClaimDocumentType;
  status: ClaimDocumentStatus;
  rejectionReason?: string;
  verifiedBy?: string;
  verifiedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
  updatedBy?: string;
}

interface ClaimDocumentCreationAttributes extends Optional<ClaimDocumentAttributes, 'id'> {}

class ClaimDocument extends Model<ClaimDocumentAttributes, ClaimDocumentCreationAttributes> implements ClaimDocumentAttributes {
  public id!: string;
  public tenantId!: string;
  public claimId!: string;
  public fileName!: string;
  public originalFileName!: string;
  public filePath!: string;
  public contentType!: string;
  public fileSize!: number;
  public documentType!: ClaimDocumentType;
  public status!: ClaimDocumentStatus;
  public rejectionReason?: string;
  public verifiedBy?: string;
  public verifiedAt?: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public createdBy?: string;
  public updatedBy?: string;
}

ClaimDocument.init(
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
    claimId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    fileName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    originalFileName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    filePath: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    contentType: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    fileSize: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    documentType: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    rejectionReason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    verifiedBy: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    verifiedAt: {
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
    modelName: 'ClaimDocument',
    tableName: 'ClaimDocuments',
    timestamps: true,
  }
);

export default ClaimDocument;
export { ClaimDocumentType, ClaimDocumentStatus };
