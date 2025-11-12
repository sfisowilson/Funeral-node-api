import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db/database';
import { v4 as uuidv4 } from 'uuid';

export interface PremiumSettingAttributes {
  id: string;
  tenantId: string;
  minPremium?: number;
  maxPremium?: number;
  defaultCover?: number;
  premiumRates?: string; // JSON string containing rate configurations
  settings?: string; // Additional JSON settings
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
  updatedBy?: string;
}

export interface PremiumSettingCreationAttributes extends Optional<PremiumSettingAttributes, 'id'> {}

export class PremiumSetting extends Model<PremiumSettingAttributes, PremiumSettingCreationAttributes> implements PremiumSettingAttributes {
  declare id: string;
  declare tenantId: string;
  declare minPremium?: number;
  declare maxPremium?: number;
  declare defaultCover?: number;
  declare premiumRates?: string;
  declare settings?: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare createdBy?: string;
  declare updatedBy?: string;
}

PremiumSetting.init(
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
    minPremium: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      comment: 'Minimum premium amount',
    },
    maxPremium: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      comment: 'Maximum premium amount',
    },
    defaultCover: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
      comment: 'Default cover amount',
    },
    premiumRates: {
      type: DataTypes.TEXT('long'),
      allowNull: true,
      comment: 'JSON string containing premium rate configurations',
    },
    settings: {
      type: DataTypes.TEXT('long'),
      allowNull: true,
      comment: 'Additional JSON settings',
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
    modelName: 'PremiumSetting',
    tableName: 'PremiumSettings',
    timestamps: true,
    indexes: [
      {
        fields: ['tenantId'],
        unique: false,
      },
    ],
  }
);

export default PremiumSetting;
