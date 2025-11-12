
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db/database';
import { v4 as uuidv4 } from 'uuid';

interface LandingPageComponentAttributes {
  id: string;
  tenantId: string;
  title?: string;
  content?: string;
  componentType?: string;
  sortOrder?: number;
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
  updatedBy?: string;
}

interface LandingPageComponentCreationAttributes extends Optional<LandingPageComponentAttributes, 'id'> {}

class LandingPageComponent extends Model<LandingPageComponentAttributes, LandingPageComponentCreationAttributes> implements LandingPageComponentAttributes {
  public id!: string;
  public tenantId!: string;
  public title?: string;
  public content?: string;
  public componentType?: string;
  public sortOrder?: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public createdBy?: string;
  public updatedBy?: string;
}

LandingPageComponent.init(
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
    title: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    componentType: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    sortOrder: {
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
    modelName: 'LandingPageComponent',
    tableName: 'LandingPageComponents',
    timestamps: true,
  }
);

export default LandingPageComponent;