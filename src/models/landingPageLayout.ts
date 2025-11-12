
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db/database';
import { v4 as uuidv4 } from 'uuid';

interface LandingPageLayoutAttributes {
  id: string;
  tenantId: string;
  name?: string;
  layoutJson?: string;
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
  updatedBy?: string;
}

interface LandingPageLayoutCreationAttributes extends Optional<LandingPageLayoutAttributes, 'id'> {}

class LandingPageLayout extends Model<LandingPageLayoutAttributes, LandingPageLayoutCreationAttributes> implements LandingPageLayoutAttributes {
  public id!: string;
  public tenantId!: string;
  public name?: string;
  public layoutJson?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public createdBy?: string;
  public updatedBy?: string;
}

LandingPageLayout.init(
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
    layoutJson: {
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
    modelName: 'LandingPageLayout',
    tableName: 'LandingPageLayouts',
    timestamps: true,
  }
);

export default LandingPageLayout;