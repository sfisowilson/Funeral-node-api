import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db/database';
import { v4 as uuidv4 } from 'uuid';

interface TermsAcceptanceAttributes {
  id: string;
  memberId: string;
  termsAndConditionsId: string;
  tenantId: string;
  acceptedAt: Date;
  ipAddress?: string;
  userAgent?: string;
  acceptedVersion?: string;
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
  updatedBy?: string;
}

interface TermsAcceptanceCreationAttributes extends Optional<TermsAcceptanceAttributes, 'id'> {}

class TermsAcceptance extends Model<TermsAcceptanceAttributes, TermsAcceptanceCreationAttributes> implements TermsAcceptanceAttributes {
  public id!: string;
  public memberId!: string;
  public termsAndConditionsId!: string;
  public tenantId!: string;
  public acceptedAt!: Date;
  public ipAddress?: string;
  public userAgent?: string;
  public acceptedVersion?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public createdBy?: string;
  public updatedBy?: string;
}

TermsAcceptance.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      primaryKey: true,
    },
    memberId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    termsAndConditionsId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    tenantId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    acceptedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    ipAddress: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    userAgent: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    acceptedVersion: {
      type: DataTypes.STRING(50),
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
    modelName: 'TermsAcceptance',
    tableName: 'TermsAcceptances',
    timestamps: true,
  }
);

export default TermsAcceptance;
