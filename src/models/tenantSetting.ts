import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db/database';
import { v4 as uuidv4 } from 'uuid';
import Tenant from './tenant';

export interface TenantSettingAttributes {
  id: string;
  settings?: string;
  logo?: string;
  favicon?: string;
  tenantId: string;
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
  updatedBy?: string;
}

export interface TenantSettingCreationAttributes extends Optional<TenantSettingAttributes, 'id'> {}

export class TenantSetting extends Model<TenantSettingAttributes, TenantSettingCreationAttributes> implements TenantSettingAttributes {
  declare id: string;
  declare settings?: string;
  declare logo?: string;
  declare favicon?: string;
  declare tenantId: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare createdBy?: string;
  declare updatedBy?: string;
}

TenantSetting.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      primaryKey: true,
    },
    settings: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    logo: {
      type: DataTypes.TEXT('long'),
      allowNull: true,
    },
    favicon: {
      type: DataTypes.TEXT('long'),
      allowNull: true,
    },
    tenantId: {
      type: DataTypes.UUID,
      allowNull: false,
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
    modelName: 'TenantSetting',
    tableName: 'TenantSettings',
    timestamps: true,
  }
);

// Define association
TenantSetting.belongsTo(Tenant, {
  foreignKey: 'tenantId',
  as: 'tenant'
});

export default TenantSetting;


