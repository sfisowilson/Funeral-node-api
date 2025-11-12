
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db/database';
import { v4 as uuidv4 } from 'uuid';

interface UserRoleAttributes {
  id: string;
  userId: string;
  roleId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface UserRoleCreationAttributes extends Optional<UserRoleAttributes, 'id'> {}

class UserRole extends Model<UserRoleAttributes, UserRoleCreationAttributes> implements UserRoleAttributes {
  declare id: string;
  declare userId: string;
  declare roleId: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

UserRole.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    roleId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'UserRole',
    tableName: 'UserRoles',
    timestamps: true,
  }
);

export default UserRole;