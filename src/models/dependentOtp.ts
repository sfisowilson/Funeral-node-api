import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db/database';
import { v4 as uuidv4 } from 'uuid';

interface DependentOtpAttributes {
  id: string;
  mainMemberId: string;
  idNumber: string;
  otpCode: string;
  contactMethod: string;
  contactValue: string;
  tenantId: string;
  expiresAt: Date;
  isUsed: boolean;
  usedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
  updatedBy?: string;
}

interface DependentOtpCreationAttributes extends Optional<DependentOtpAttributes, 'id'> {}

class DependentOtp extends Model<DependentOtpAttributes, DependentOtpCreationAttributes> implements DependentOtpAttributes {
  public id!: string;
  public mainMemberId!: string;
  public idNumber!: string;
  public otpCode!: string;
  public contactMethod!: string;
  public contactValue!: string;
  public tenantId!: string;
  public expiresAt!: Date;
  public isUsed!: boolean;
  public usedAt?: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public createdBy?: string;
  public updatedBy?: string;
}

DependentOtp.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      primaryKey: true,
    },
    mainMemberId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    idNumber: {
      type: DataTypes.STRING(13),
      allowNull: false,
    },
    otpCode: {
      type: DataTypes.STRING(6),
      allowNull: false,
    },
    contactMethod: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    contactValue: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    tenantId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    isUsed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    usedAt: {
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
    modelName: 'DependentOtp',
    tableName: 'DependentOtps',
    timestamps: true,
  }
);

export default DependentOtp;
