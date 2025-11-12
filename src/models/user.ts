
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db/database';
import { v4 as uuidv4 } from 'uuid';

interface UserAttributes {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  address?: string;
  idNumber?: string;
  passwordHash?: string;
  tenantId: string;
  mustChangePassword?: boolean;
  isIdVerified?: boolean;
  idVerifiedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
  updatedBy?: string;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  declare id: string;
  declare email: string;
  declare firstName?: string;
  declare lastName?: string;
  declare phoneNumber?: string;
  declare address?: string;
  declare idNumber?: string;
  declare passwordHash?: string;
  declare tenantId: string;
  declare mustChangePassword?: boolean;
  declare isIdVerified?: boolean;
  declare idVerifiedAt?: Date;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare createdBy?: string;
  declare updatedBy?: string;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    firstName: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    lastName: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    phoneNumber: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    idNumber: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    tenantId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    mustChangePassword: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    isIdVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    idVerifiedAt: {
      type: DataTypes.DATE,
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
    modelName: 'User',
    tableName: 'Users',
    timestamps: true,
  }
);

export default User;
