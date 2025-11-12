
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db/database';
import { v4 as uuidv4 } from 'uuid';

interface DashboardWidgetSettingAttributes {
  id: string;
  tenantId: string;
  // Widget Identification
  widgetKey?: string; // e.g., 'stats', 'revenue', 'member-growth'
  widgetName?: string; // Display name
  // Widget Configuration
  isVisible?: boolean;
  allowedRoles?: string; // Comma-separated role names
  displayOrder?: number;
  // Audit
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
  updatedBy?: string;
}

interface DashboardWidgetSettingCreationAttributes extends Optional<DashboardWidgetSettingAttributes, 'id'> {}

class DashboardWidgetSetting extends Model<DashboardWidgetSettingAttributes, DashboardWidgetSettingCreationAttributes> implements DashboardWidgetSettingAttributes {
  public id!: string;
  public tenantId!: string;
  public widgetKey?: string;
  public widgetName?: string;
  public isVisible?: boolean;
  public allowedRoles?: string;
  public displayOrder?: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public createdBy?: string;
  public updatedBy?: string;
}

DashboardWidgetSetting.init(
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
    widgetKey: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "e.g., 'stats', 'revenue', 'member-growth'",
    },
    widgetName: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    isVisible: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true,
    },
    allowedRoles: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: 'Comma-separated role names',
    },
    displayOrder: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
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
    modelName: 'DashboardWidgetSetting',
    tableName: 'DashboardWidgetSettings',
    timestamps: true,
  }
);

export default DashboardWidgetSetting;