
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db/database';
import { v4 as uuidv4 } from 'uuid';

interface AssetCheckoutAttributes {
  id: string;
  tenantId: string;
  assetId?: string;
  userId?: string;
  checkoutDate?: Date;
  returnDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
  updatedBy?: string;
}

interface AssetCheckoutCreationAttributes extends Optional<AssetCheckoutAttributes, 'id'> {}

class AssetCheckout extends Model<AssetCheckoutAttributes, AssetCheckoutCreationAttributes> implements AssetCheckoutAttributes {
  public id!: string;
  public tenantId!: string;
  public assetId?: string;
  public userId?: string;
  public checkoutDate?: Date;
  public returnDate?: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public createdBy?: string;
  public updatedBy?: string;
}

AssetCheckout.init(
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
    assetId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    checkoutDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    returnDate: {
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
    modelName: 'AssetCheckout',
    tableName: 'AssetCheckouts',
    timestamps: true,
  }
);

export default AssetCheckout;