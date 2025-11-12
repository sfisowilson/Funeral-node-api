
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db/database';
import { v4 as uuidv4 } from 'uuid';

interface RolePermissionAttributes {
  id: string;
  roleId: string;
  permissionId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface RolePermissionCreationAttributes extends Optional<RolePermissionAttributes, 'id'> {}

class RolePermission extends Model<RolePermissionAttributes, RolePermissionCreationAttributes> implements RolePermissionAttributes {
  declare id: string;
  declare roleId: string;
  declare permissionId: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

RolePermission.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      primaryKey: true,
    },
    roleId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    permissionId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'RolePermission',
    tableName: 'RolePermissions',
    timestamps: true,
  }
);

export default RolePermission;