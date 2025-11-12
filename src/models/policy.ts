
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db/database';
import { v4 as uuidv4 } from 'uuid';

interface PolicyAttributes {
  id: string;
  tenantId: string;
  name?: string;
  policyNumber?: string;
  description?: string;
  payoutAmount?: number;
  coverageAmount?: number;
  price?: number;
  // Policy terms
  waitingPeriodDays?: number;
  maxClaimAmount?: number;
  isActive?: boolean;
  status?: string;
  startDate?: Date;
  endDate?: Date;
  premiumAmount?: number;
  // Audit
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
  updatedBy?: string;
}

interface PolicyCreationAttributes extends Optional<PolicyAttributes, 'id'> {}

class Policy extends Model<PolicyAttributes, PolicyCreationAttributes> implements PolicyAttributes {
  public id!: string;
  public tenantId!: string;
  public name?: string;
  public policyNumber?: string;
  public description?: string;
  public payoutAmount?: number;
  public coverageAmount?: number;
  public price?: number;
  public waitingPeriodDays?: number;
  public maxClaimAmount?: number;
  public isActive?: boolean;
  public status?: string;
  public startDate?: Date;
  public endDate?: Date;
  public premiumAmount?: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public createdBy?: string;
  public updatedBy?: string;
}

Policy.init(
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
    name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    policyNumber: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    payoutAmount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
    },
    coverageAmount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    // Policy terms
    waitingPeriodDays: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    maxClaimAmount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true,
    },
    status: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: 'Active',
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    premiumAmount: {
      type: DataTypes.DECIMAL(10, 2),
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
    modelName: 'Policy',
    tableName: 'Policies',
    timestamps: true,
  }
);

export default Policy;