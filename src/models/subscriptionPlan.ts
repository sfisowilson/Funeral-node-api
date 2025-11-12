import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db/database';
import { v4 as uuidv4 } from 'uuid';

interface SubscriptionPlanAttributes {
  id: string;
  name?: string;
  description?: string;
  monthlyPrice: number;
  allowedTenantType: string;
  features: string;
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
  updatedBy?: string;
}

interface SubscriptionPlanCreationAttributes extends Optional<SubscriptionPlanAttributes, 'id'> {}

class SubscriptionPlan extends Model<SubscriptionPlanAttributes, SubscriptionPlanCreationAttributes> implements SubscriptionPlanAttributes {
  public id!: string;
  public name?: string;
  public description?: string;
  public monthlyPrice!: number;
  public allowedTenantType!: string;
  public features!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public createdBy?: string;
  public updatedBy?: string;

  getSupportsIdentityVerification(): boolean {
    try {
      const features = JSON.parse(this.features);
      return features?.IdentityVerification ?? false;
    } catch {
      return false;
    }
  }

  getMaxVerificationsPerMonth(): number {
    try {
      const features = JSON.parse(this.features);
      return features?.MaxVerificationsPerMonth ?? 0;
    } catch {
      return 0;
    }
  }
}

SubscriptionPlan.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    monthlyPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    allowedTenantType: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    features: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: {},
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
    modelName: 'SubscriptionPlan',
    tableName: 'SubscriptionPlans',
    timestamps: true,
  }
);

export default SubscriptionPlan;
