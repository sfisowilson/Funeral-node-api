import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db/database';
import { v4 as uuidv4 } from 'uuid';

enum RequiredDocumentType {
  MemberIdDocument = 'MemberIdDocument',
  MemberProofOfAddress = 'MemberProofOfAddress',
  DependentIdDocument = 'DependentIdDocument',
  DependentBirthCertificate = 'DependentBirthCertificate',
  BeneficiaryIdDocument = 'BeneficiaryIdDocument',
  PolicyDocument = 'PolicyDocument',
  Other = 'Other'
}

enum RequiredDocumentEntityType {
  Member = 'Member',
  Dependent = 'Dependent',
  Beneficiary = 'Beneficiary',
  Policy = 'Policy'
}

interface RequiredDocumentAttributes {
  id: string;
  tenantId: string;
  documentName: string;
  description?: string;
  documentType: RequiredDocumentType;
  entityType: RequiredDocumentEntityType;
  isRequired: boolean;
  isActive: boolean;
  allowedFileTypes?: string;
  maxFileSizeBytes?: number;
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
  updatedBy?: string;
}

interface RequiredDocumentCreationAttributes extends Optional<RequiredDocumentAttributes, 'id'> {}

class RequiredDocument extends Model<RequiredDocumentAttributes, RequiredDocumentCreationAttributes> implements RequiredDocumentAttributes {
  public id!: string;
  public tenantId!: string;
  public documentName!: string;
  public description?: string;
  public documentType!: RequiredDocumentType;
  public entityType!: RequiredDocumentEntityType;
  public isRequired!: boolean;
  public isActive!: boolean;
  public allowedFileTypes?: string;
  public maxFileSizeBytes?: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public createdBy?: string;
  public updatedBy?: string;
}

RequiredDocument.init(
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
    documentName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    documentType: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    entityType: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    isRequired: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    allowedFileTypes: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    maxFileSizeBytes: {
      type: DataTypes.BIGINT,
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
    modelName: 'RequiredDocument',
    tableName: 'RequiredDocuments',
    timestamps: true,
  }
);

export default RequiredDocument;
export { RequiredDocumentType, RequiredDocumentEntityType };
