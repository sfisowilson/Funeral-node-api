
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db/database';
import { v4 as uuidv4 } from 'uuid';

interface DependentAttributes {
  id: string;
  tenantId: string;
  // Links to Member
  memberId?: string;
  // Basic Information
  name?: string;
  email?: string;
  address?: string;
  phone1?: string;
  phone2?: string;
  identificationNumber?: string;
  // Phase 3: Dependent Classification
  dependentType?: string; // DependentType enum (Spouse, Child, ExtendedFamily)
  dateOfBirth?: Date;
  // Audit
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
  updatedBy?: string;
}

interface DependentCreationAttributes extends Optional<DependentAttributes, 'id'> {}

class Dependent extends Model<DependentAttributes, DependentCreationAttributes> implements DependentAttributes {
  public id!: string;
  public tenantId!: string;
  public memberId?: string;
  public name?: string;
  public email?: string;
  public address?: string;
  public phone1?: string;
  public phone2?: string;
  public identificationNumber?: string;
  public dependentType?: string;
  public dateOfBirth?: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public createdBy?: string;
  public updatedBy?: string;

  // Computed property for calculated age
  get calculatedAge(): number | null {
    if (!this.dateOfBirth) return null;
    const today = new Date();
    let age = today.getFullYear() - this.dateOfBirth.getFullYear();
    const monthDiff = today.getMonth() - this.dateOfBirth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < this.dateOfBirth.getDate())) {
      age--;
    }
    return age;
  }
}

Dependent.init(
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
    memberId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    phone1: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    phone2: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    identificationNumber: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    dependentType: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: 'DependentType enum: Spouse, Child, ExtendedFamily',
    },
    dateOfBirth: {
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
    modelName: 'Dependent',
    tableName: 'Dependents',
    timestamps: true,
  }
);

export default Dependent;