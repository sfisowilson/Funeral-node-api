import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db/database';
import { v4 as uuidv4 } from 'uuid';

interface OnboardingFieldConfigurationAttributes {
  id: string;
  tenantId: string;
  fieldKey: string;
  displayName: string;
  isRequired: boolean;
  isEnabled: boolean;
  displayOrder: number;
  fieldType?: string;
  category?: string;
  placeholder?: string;
  helpText?: string;
  options?: string;
  validationRules?: string;
  defaultValue?: string;
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
  updatedBy?: string;
}

interface OnboardingFieldConfigurationCreationAttributes 
  extends Optional<OnboardingFieldConfigurationAttributes, 'id'> {}

class OnboardingFieldConfiguration 
  extends Model<OnboardingFieldConfigurationAttributes, OnboardingFieldConfigurationCreationAttributes> 
  implements OnboardingFieldConfigurationAttributes {
  
  public id!: string;
  public tenantId!: string;
  public fieldKey!: string;
  public displayName!: string;
  public isRequired!: boolean;
  public isEnabled!: boolean;
  public displayOrder!: number;
  public fieldType?: string;
  public category?: string;
  public placeholder?: string;
  public helpText?: string;
  public options?: string;
  public validationRules?: string;
  public defaultValue?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public createdBy?: string;
  public updatedBy?: string;
}

OnboardingFieldConfiguration.init(
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
    fieldKey: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    displayName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    isRequired: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    isEnabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    displayOrder: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    fieldType: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    category: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    placeholder: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    helpText: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    options: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    validationRules: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    defaultValue: {
      type: DataTypes.STRING(255),
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
    modelName: 'OnboardingFieldConfiguration',
    tableName: 'OnboardingFieldConfigurations',
    timestamps: true,
  }
);

export default OnboardingFieldConfiguration;
