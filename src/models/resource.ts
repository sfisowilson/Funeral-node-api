
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db/database';
import { v4 as uuidv4 } from 'uuid';

interface ResourceAttributes {
  id: string;
  tenantId: string;
  name?: string;
  type?: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
  updatedBy?: string;
}

interface ResourceCreationAttributes extends Optional<ResourceAttributes, 'id'> {}

class Resource extends Model<ResourceAttributes, ResourceCreationAttributes> implements ResourceAttributes {
  public id!: string;
  public tenantId!: string;
  public name?: string;
  public type?: string;
  public description?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public createdBy?: string;
  public updatedBy?: string;
}

Resource.init(
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
    type: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    description: {
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
    modelName: 'Resource',
    tableName: 'Resources',
    timestamps: true,
  }
);

export default Resource;