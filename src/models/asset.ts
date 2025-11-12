
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db/database';
import { v4 as uuidv4 } from 'uuid';

interface AssetAttributes {
  id: string;
  tenantId: string;
  // Basic Information
  name?: string;
  description?: string;
  assetType?: string; // AssetType enum: Vehicle, Tent, Equipment, Refrigeration, Furniture, Tools, Other
  // Asset Identification
  identificationNumber?: string;
  make?: string;
  model?: string;
  year?: number;
  quantity?: number;
  // Current Status
  status?: string; // AssetStatus enum: Available, CheckedOut, UnderMaintenance, OutOfService, Retired
  currentLocation?: string;
  // Inspection & Maintenance
  requiresInspection?: boolean;
  inspectionCheckpointsJson?: string; // JSON array of checkpoint names
  lastMaintenanceDate?: Date;
  nextMaintenanceDate?: Date;
  // Financial Tracking
  purchaseDate?: Date;
  purchaseCost?: number;
  // Condition
  conditionNotes?: string;
  // Audit
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
  updatedBy?: string;
}

interface AssetCreationAttributes extends Optional<AssetAttributes, 'id'> {}

class Asset extends Model<AssetAttributes, AssetCreationAttributes> implements AssetAttributes {
  public id!: string;
  public tenantId!: string;
  public name?: string;
  public description?: string;
  public assetType?: string;
  public identificationNumber?: string;
  public make?: string;
  public model?: string;
  public year?: number;
  public quantity?: number;
  public status?: string;
  public currentLocation?: string;
  public requiresInspection?: boolean;
  public inspectionCheckpointsJson?: string;
  public lastMaintenanceDate?: Date;
  public nextMaintenanceDate?: Date;
  public purchaseDate?: Date;
  public purchaseCost?: number;
  public conditionNotes?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public createdBy?: string;
  public updatedBy?: string;
}

Asset.init(
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
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    assetType: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: 'AssetType enum: Vehicle, Tent, Equipment, Refrigeration, Furniture, Tools, Other',
    },
    identificationNumber: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    make: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    model: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 1,
    },
    status: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: 'Available',
      comment: 'AssetStatus enum: Available, CheckedOut, UnderMaintenance, OutOfService, Retired',
    },
    currentLocation: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    requiresInspection: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true,
    },
    inspectionCheckpointsJson: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'JSON array of inspection checkpoint names',
    },
    lastMaintenanceDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    nextMaintenanceDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    purchaseDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    purchaseCost: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
    },
    conditionNotes: {
      type: DataTypes.TEXT,
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
    modelName: 'Asset',
    tableName: 'Assets',
    timestamps: true,
  }
);

export default Asset;