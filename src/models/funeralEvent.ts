
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db/database';
import { v4 as uuidv4 } from 'uuid';

interface FuneralEventAttributes {
  id: string;
  tenantId: string;
  // Links to Claim
  claimId?: string;
  // Event Information
  eventDate?: Date;
  location?: string;
  notes?: string;
  status?: string; // FuneralEventStatus enum
  // Resource Management (stored as JSON arrays of UUIDs)
  assetIds?: string; // JSON array of asset IDs
  driverIds?: string; // JSON array of driver IDs
  decoratorIds?: string; // JSON array of decorator IDs
  // Audit
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
  updatedBy?: string;
}

interface FuneralEventCreationAttributes extends Optional<FuneralEventAttributes, 'id'> {}

class FuneralEvent extends Model<FuneralEventAttributes, FuneralEventCreationAttributes> implements FuneralEventAttributes {
  public id!: string;
  public tenantId!: string;
  public claimId?: string;
  public eventDate?: Date;
  public location?: string;
  public notes?: string;
  public status?: string;
  public assetIds?: string;
  public driverIds?: string;
  public decoratorIds?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public createdBy?: string;
  public updatedBy?: string;
}

FuneralEvent.init(
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
      allowNull: true,
    },
    eventDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    location: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: 'FuneralEventStatus enum',
    },
    assetIds: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'JSON array of asset IDs',
    },
    driverIds: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'JSON array of driver IDs',
    },
    decoratorIds: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'JSON array of decorator IDs',
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
    modelName: 'FuneralEvent',
    tableName: 'FuneralEvents',
    timestamps: true,
  }
);

export default FuneralEvent;