import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db/database';
import { v4 as uuidv4 } from 'uuid';

interface PasswordResetCodeAttributes {
  id: string;
  userId: string;
  code: string;
  expiryDate: Date;
  isUsed: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface PasswordResetCodeCreationAttributes extends Optional<PasswordResetCodeAttributes, 'id'> {}

class PasswordResetCode extends Model<PasswordResetCodeAttributes, PasswordResetCodeCreationAttributes> implements PasswordResetCodeAttributes {
  public id!: string;
  public userId!: string;
  public code!: string;
  public expiryDate!: Date;
  public isUsed!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

PasswordResetCode.init(
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
    code: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    expiryDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    isUsed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: 'PasswordResetCode',
    tableName: 'PasswordResetCodes',
    timestamps: true,
  }
);

export default PasswordResetCode;
