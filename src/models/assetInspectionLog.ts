
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db/database';
import { v4 as uuidv4 } from 'uuid';

interface AssetInspectionLogAttributes {
  id: string;
  tenantId: string;
  assetId?: string;
  inspectionDate?: Date;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
  updatedBy?: string;
}

interface AssetInspectionLogCreationAttributes extends Optional<AssetInspectionLogAttributes, 'id'> {}

class AssetInspectionLog extends Model<AssetInspectionLogAttributes, AssetInspectionLogCreationAttributes> implements AssetInspectionLogAttributes {
  public id!: string;
  public tenantId!: string;
  public assetId?: string;
  public inspectionDate?: Date;
  public notes?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public createdBy?: string;
  public updatedBy?: string;
}

AssetInspectionLog.init(
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
    assetId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    inspectionDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    notes: {
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
    modelName: 'AssetInspectionLog',
    tableName: 'AssetInspectionLogs',
    timestamps: true,
  }
);

export default AssetInspectionLog;