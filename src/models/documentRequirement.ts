
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db/database';
import { v4 as uuidv4 } from 'uuid';

interface DocumentRequirementAttributes {
  id: string;
  tenantId: string;
  name?: string;
  description?: string;
  isMandatory?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
  updatedBy?: string;
}

interface DocumentRequirementCreationAttributes extends Optional<DocumentRequirementAttributes, 'id'> {}

class DocumentRequirement extends Model<DocumentRequirementAttributes, DocumentRequirementCreationAttributes> implements DocumentRequirementAttributes {
  public id!: string;
  public tenantId!: string;
  public name?: string;
  public description?: string;
  public isMandatory?: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public createdBy?: string;
  public updatedBy?: string;
}

DocumentRequirement.init(
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
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    isMandatory: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
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
    modelName: 'DocumentRequirement',
    tableName: 'DocumentRequirements',
    timestamps: true,
  }
);

export default DocumentRequirement;