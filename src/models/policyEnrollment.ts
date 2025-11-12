import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db/database';
import { v4 as uuidv4 } from 'uuid';

interface PolicyEnrollmentAttributes {
  id: string;
  tenantId: string;
  policyId?: string;
  memberId?: string;
  enrollmentDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
  updatedBy?: string;
}

interface PolicyEnrollmentCreationAttributes extends Optional<PolicyEnrollmentAttributes, 'id'> {}

class PolicyEnrollment extends Model<PolicyEnrollmentAttributes, PolicyEnrollmentCreationAttributes> implements PolicyEnrollmentAttributes {
  public id!: string;
  public tenantId!: string;
  public policyId?: string;
  public memberId?: string;
  public enrollmentDate?: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public createdBy?: string;
  public updatedBy?: string;
}

PolicyEnrollment.init(
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
    policyId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    memberId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    enrollmentDate: {
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
    modelName: 'PolicyEnrollment',
    tableName: 'PolicyEnrollments',
    timestamps: true,
  }
);

export default PolicyEnrollment;