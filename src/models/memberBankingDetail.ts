
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db/database';
import { v4 as uuidv4 } from 'uuid';

interface MemberBankingDetailAttributes {
  id: string;
  tenantId: string;
  // Links to Member
  memberId?: string;
  // Banking Information
  bankName?: string;
  accountNumber?: string;
  accountType?: string; // e.g., Savings, Checking, Current
  branchCode?: string;
  branchName?: string;
  accountHolderName?: string;
  // Payment preferences
  debitDay?: number; // Preferred day of month to debit (1-31)
  paymentMethod?: string; // PaymentMethodType: Debit Order, Stop Order, Cash, EFT
  // Verification and Status
  isVerified?: boolean;
  isDeleted?: boolean;
  // Audit
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
  updatedBy?: string;
}

interface MemberBankingDetailCreationAttributes extends Optional<MemberBankingDetailAttributes, 'id'> {}

class MemberBankingDetail extends Model<MemberBankingDetailAttributes, MemberBankingDetailCreationAttributes> implements MemberBankingDetailAttributes {
  public id!: string;
  public tenantId!: string;
  public memberId?: string;
  public bankName?: string;
  public accountNumber?: string;
  public accountType?: string;
  public branchCode?: string;
  public branchName?: string;
  public accountHolderName?: string;
  public debitDay?: number;
  public paymentMethod?: string;
  public isVerified?: boolean;
  public isDeleted?: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public createdBy?: string;
  public updatedBy?: string;
}

MemberBankingDetail.init(
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
    memberId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    bankName: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    accountNumber: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    accountType: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'e.g., Savings, Checking, Current',
    },
    branchCode: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    branchName: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    accountHolderName: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    debitDay: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 1,
        max: 31,
      },
      comment: 'Preferred day of month to debit account (1-31)',
    },
    paymentMethod: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: 'PaymentMethodType: Debit Order, Stop Order, Cash, EFT',
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
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
    modelName: 'MemberBankingDetail',
    tableName: 'MemberBankingDetails',
    timestamps: true,
  }
);

export default MemberBankingDetail;