import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db/database';
import { v4 as uuidv4 } from 'uuid';

enum ClaimStatus {
  Draft = 'Draft',
  Submitted = 'Submitted',
  InitialReview = 'InitialReview',
  DocumentsRequired = 'DocumentsRequired',
  DocumentReview = 'DocumentReview',
  VerificationPending = 'VerificationPending',
  VerificationFailed = 'VerificationFailed',
  Assessment = 'Assessment',
  ManagerReview = 'ManagerReview',
  Approved = 'Approved',
  PartiallyApproved = 'PartiallyApproved',
  Rejected = 'Rejected',
  PaymentPending = 'PaymentPending',
  Paid = 'Paid',
  PartiallyPaid = 'PartiallyPaid',
  Closed = 'Closed',
  Disputed = 'Disputed',
  Cancelled = 'Cancelled',
  Fraudulent = 'Fraudulent'
}

interface ClaimWorkflowHistoryAttributes {
  id: string;
  tenantId: string;
  claimId: string;
  oldStatus: ClaimStatus;
  newStatus: ClaimStatus;
  notes?: string;
  changedBy: string;
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
  updatedBy?: string;
}

interface ClaimWorkflowHistoryCreationAttributes extends Optional<ClaimWorkflowHistoryAttributes, 'id'> {}

class ClaimWorkflowHistory extends Model<ClaimWorkflowHistoryAttributes, ClaimWorkflowHistoryCreationAttributes> implements ClaimWorkflowHistoryAttributes {
  public id!: string;
  public tenantId!: string;
  public claimId!: string;
  public oldStatus!: ClaimStatus;
  public newStatus!: ClaimStatus;
  public notes?: string;
  public changedBy!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public createdBy?: string;
  public updatedBy?: string;
}

ClaimWorkflowHistory.init(
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
    claimId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    oldStatus: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    newStatus: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    changedBy: {
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
    modelName: 'ClaimWorkflowHistory',
    tableName: 'ClaimWorkflowHistories',
    timestamps: true,
  }
);

export default ClaimWorkflowHistory;
export { ClaimStatus };
