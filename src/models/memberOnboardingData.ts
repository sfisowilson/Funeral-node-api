import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db/database';
import { v4 as uuidv4 } from 'uuid';

interface MemberOnboardingDataAttributes {
  id: string;
  memberId: string;
  tenantId: string;
  fieldConfigurationId: string;
  fieldKey: string;
  fieldValue?: string;
  submittedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
  updatedBy?: string;
}

interface MemberOnboardingDataCreationAttributes extends Optional<MemberOnboardingDataAttributes, 'id'> {}

class MemberOnboardingData extends Model<MemberOnboardingDataAttributes, MemberOnboardingDataCreationAttributes> implements MemberOnboardingDataAttributes {
  public id!: string;
  public memberId!: string;
  public tenantId!: string;
  public fieldConfigurationId!: string;
  public fieldKey!: string;
  public fieldValue?: string;
  public submittedAt?: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public createdBy?: string;
  public updatedBy?: string;
}

MemberOnboardingData.init(
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
    tenantId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    fieldConfigurationId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    fieldKey: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    fieldValue: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    submittedAt: {
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
    modelName: 'MemberOnboardingData',
    tableName: 'MemberOnboardingDatas',
    timestamps: true,
  }
);

export default MemberOnboardingData;
