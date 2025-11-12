
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db/database';
import { v4 as uuidv4 } from 'uuid';

interface PermissionAttributes {
  id: string;
  name: string;
  tenantId: string;
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
  updatedBy?: string;
}

interface PermissionCreationAttributes extends Optional<PermissionAttributes, 'id'> {}

class Permission extends Model<PermissionAttributes, PermissionCreationAttributes> implements PermissionAttributes {
  declare id: string;
  declare name: string;
  declare tenantId: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare createdBy?: string;
  declare updatedBy?: string;
}

Permission.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tenantId: {
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
    modelName: 'Permission',
    tableName: 'Permissions',
    timestamps: true,
  }
);

export default Permission;
