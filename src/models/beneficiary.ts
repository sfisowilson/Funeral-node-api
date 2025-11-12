
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db/database';
import { v4 as uuidv4 } from 'uuid';

interface BeneficiaryAttributes {
  id: string;
  tenantId: string;
  // Contact Information
  memberId?: string;
  name?: string;
  email?: string;
  address?: string;
  phone1?: string;
  phone2?: string;
  // Identification & Relationship
  identificationNumber?: string;
  relationship?: string; // Relationship to member
  benefitPercentage?: number;
  // Verification tracking
  isVerified?: boolean;
  verifiedAt?: Date;
  // Audit
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
  updatedBy?: string;
}

interface BeneficiaryCreationAttributes extends Optional<BeneficiaryAttributes, 'id'> {}

class Beneficiary extends Model<BeneficiaryAttributes, BeneficiaryCreationAttributes> implements BeneficiaryAttributes {
  public id!: string;
  public tenantId!: string;
  public memberId?: string;
  public name?: string;
  public email?: string;
  public address?: string;
  public phone1?: string;
  public phone2?: string;
  public identificationNumber?: string;
  public relationship?: string;
  public benefitPercentage?: number;
  public isVerified?: boolean;
  public verifiedAt?: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public createdBy?: string;
  public updatedBy?: string;
}

Beneficiary.init(
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
    name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    phone1: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    phone2: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    identificationNumber: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    relationship: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    benefitPercentage: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
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
    modelName: 'Beneficiary',
    tableName: 'Beneficiaries',
    timestamps: true,
  }
);

export default Beneficiary;