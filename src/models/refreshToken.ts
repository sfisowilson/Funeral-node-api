import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db/database';
import { v4 as uuidv4 } from 'uuid';

interface RefreshTokenAttributes {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  createdAt: Date;
  createdByIp?: string;
  revokedAt?: Date;
  revokedByIp?: string;
  replacedByToken?: string;
  updatedAt?: Date;
}

interface RefreshTokenCreationAttributes extends Optional<RefreshTokenAttributes, 'id'> {}

class RefreshToken extends Model<RefreshTokenAttributes, RefreshTokenCreationAttributes> implements RefreshTokenAttributes {
  public id!: string;
  public userId!: string;
  public token!: string;
  public expiresAt!: Date;
  public createdAt!: Date;
  public createdByIp?: string;
  public revokedAt?: Date;
  public revokedByIp?: string;
  public replacedByToken?: string;
  public readonly updatedAt!: Date;

  get isRevoked(): boolean {
    return this.revokedAt != null;
  }

  get isExpired(): boolean {
    return new Date() >= this.expiresAt;
  }
}

RefreshToken.init(
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
    token: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    createdByIp: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    revokedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    revokedByIp: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    replacedByToken: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'RefreshToken',
    tableName: 'RefreshTokens',
    timestamps: true,
  }
);

export default RefreshToken;
