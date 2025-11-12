import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db/database';
import { v4 as uuidv4 } from 'uuid';

interface InvoiceAttributes {
  id: string;
  tenantId: string;
  memberId: string;
  amountDue: number;
  dueDate: Date;
  issueDate: Date;
  isPaid: boolean;
  invoiceNumber?: string;
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
  updatedBy?: string;
}

interface InvoiceCreationAttributes extends Optional<InvoiceAttributes, 'id'> {}

class Invoice extends Model<InvoiceAttributes, InvoiceCreationAttributes> implements InvoiceAttributes {
  public id!: string;
  public tenantId!: string;
  public memberId!: string;
  public amountDue!: number;
  public dueDate!: Date;
  public issueDate!: Date;
  public isPaid!: boolean;
  public invoiceNumber?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public createdBy?: string;
  public updatedBy?: string;
}

Invoice.init(
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
      allowNull: false,
    },
    amountDue: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: false,
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    issueDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    isPaid: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    invoiceNumber: {
      type: DataTypes.STRING(100),
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
    modelName: 'Invoice',
    tableName: 'Invoices',
    timestamps: true,
  }
);

export default Invoice;
