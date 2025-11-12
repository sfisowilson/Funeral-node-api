import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db/database';
import { v4 as uuidv4 } from 'uuid';

interface TermsAndConditionsAttributes {
  id: string;
  tenantId: string;
  title: string;
  content: string;
  version?: string;
  isActive: boolean;
  effectiveDate: Date;
  expiryDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
  updatedBy?: string;
}

interface TermsAndConditionsCreationAttributes extends Optional<TermsAndConditionsAttributes, 'id'> {}

class TermsAndConditions extends Model<TermsAndConditionsAttributes, TermsAndConditionsCreationAttributes> implements TermsAndConditionsAttributes {
  public id!: string;
  public tenantId!: string;
  public title!: string;
  public content!: string;
  public version?: string;
  public isActive!: boolean;
  public effectiveDate!: Date;
  public expiryDate?: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public createdBy?: string;
  public updatedBy?: string;
}

TermsAndConditions.init(
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
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    version: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    effectiveDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    expiryDate: {
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
    modelName: 'TermsAndConditions',
    tableName: 'TermsAndConditions',
    timestamps: true,
  }
);

export default TermsAndConditions;
