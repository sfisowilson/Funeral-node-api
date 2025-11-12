import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db/database';
import { v4 as uuidv4 } from 'uuid';

enum VerificationType {
  IdDocument = 'IdDocument',
  FacialRecognition = 'FacialRecognition',
  BankAccount = 'BankAccount',
  PhoneNumber = 'PhoneNumber',
  Email = 'Email'
}

enum VerificationStatus {
  Pending = 'Pending',
  InProgress = 'InProgress',
  Verified = 'Verified',
  Failed = 'Failed',
  Rejected = 'Rejected',
  Expired = 'Expired'
}

interface VerificationRequestAttributes {
  id: string;
  tenantId: string;
  idNumber: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: Date;
  verificationType: VerificationType;
  status: VerificationStatus;
  verifyIdTransactionId?: string;
  responseData?: string;
  errorMessage?: string;
  verifiedAt?: Date;
  userId?: string;
  memberId?: string;
  claimId?: string;
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
  updatedBy?: string;
}

interface VerificationRequestCreationAttributes extends Optional<VerificationRequestAttributes, 'id'> {}

class VerificationRequest extends Model<VerificationRequestAttributes, VerificationRequestCreationAttributes> implements VerificationRequestAttributes {
  public id!: string;
  public tenantId!: string;
  public idNumber!: string;
  public firstName!: string;
  public lastName!: string;
  public dateOfBirth?: Date;
  public verificationType!: VerificationType;
  public status!: VerificationStatus;
  public verifyIdTransactionId?: string;
  public responseData?: string;
  public errorMessage?: string;
  public verifiedAt?: Date;
  public userId?: string;
  public memberId?: string;
  public claimId?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public createdBy?: string;
  public updatedBy?: string;
}

VerificationRequest.init(
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
    idNumber: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    dateOfBirth: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    verificationType: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    verifyIdTransactionId: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    responseData: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    errorMessage: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    verifiedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    memberId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    claimId: {
      type: DataTypes.UUID,
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
    modelName: 'VerificationRequest',
    tableName: 'VerificationRequests',
    timestamps: true,
  }
);

export default VerificationRequest;
export { VerificationType, VerificationStatus };
