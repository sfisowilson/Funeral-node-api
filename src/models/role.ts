
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db/database';
import { v4 as uuidv4 } from 'uuid';

interface RoleAttributes {
  id: string;
  name: string;
  tenantId: string;
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
  updatedBy?: string;
}

interface RoleCreationAttributes extends Optional<RoleAttributes, 'id'> {}

class Role extends Model<RoleAttributes, RoleCreationAttributes> implements RoleAttributes {
  declare id: string;
  declare name: string;
  declare tenantId: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare createdBy?: string;
  declare updatedBy?: string;
}

Role.init(
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
    modelName: 'Role',
    tableName: 'Roles',
    timestamps: true,
  }
);

export default Role;
