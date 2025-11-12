
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db/database';
import { v4 as uuidv4 } from 'uuid';

interface TenantAttributes {
  id: string;
  name?: string;
  domain: string;
  email?: string;
  address?: string;
  phone1?: string;
  phone2?: string;
  registrationNumber?: string;
  type?: string;
  subscriptionPlanId?: string;
  subscriptionStartDate?: Date;
  lastInvoiceDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
  updatedBy?: string;
}

interface TenantCreationAttributes extends Optional<TenantAttributes, 'id'> {}

class Tenant extends Model<TenantAttributes, TenantCreationAttributes> implements TenantAttributes {
  declare id: string;
  declare name?: string;
  declare domain: string;
  declare email?: string;
  declare address?: string;
  declare phone1?: string;
  declare phone2?: string;
  declare registrationNumber?: string;
  declare type?: string;
  declare subscriptionPlanId?: string;
  declare subscriptionStartDate?: Date;
  declare lastInvoiceDate?: Date;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare createdBy?: string;
  declare updatedBy?: string;
}

Tenant.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    domain: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    address: {
      type: DataTypes.STRING,
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
    registrationNumber: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    type: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: 'Standard',
    },
    subscriptionPlanId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    subscriptionStartDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    lastInvoiceDate: {
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
    modelName: 'Tenant',
    tableName: 'Tenants',
    timestamps: true,
  }
);

export default Tenant;
