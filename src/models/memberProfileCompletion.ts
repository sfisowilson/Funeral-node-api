import { DataTypes, Model } from 'sequelize';
import sequelize from '../db/database';
import Tenant from './tenant';
import { v4 as uuidv4 } from 'uuid';

class MemberProfileCompletion extends Model {
  public id!: string;
  public memberId!: string;
  public tenantId!: string;
  public hasDependents!: boolean;
  public hasBeneficiaries!: boolean;
  public hasUploadedIdDocument!: boolean;
  public hasAcceptedTerms!: boolean;
  public hasCompletedCustomForms!: boolean;
  public hasUploadedRequiredDocuments!: boolean;
  public isProfileComplete!: boolean;
  public profileCompletedAt?: Date;
  public dependentsCompletedAt?: Date;
  public beneficiariesCompletedAt?: Date;
  public idDocumentUploadedAt?: Date;
  public termsAcceptedAt?: Date;
  public customFormsCompletedAt?: Date;
  public requiredDocumentsUploadedAt?: Date;
  public readonly createdAt?: Date;
  public readonly updatedAt?: Date;
  public createdBy?: string;
  public updatedBy?: string;
}

MemberProfileCompletion.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      primaryKey: true,
    },
    memberId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    tenantId: {
      type: DataTypes.UUID,
      references: {
        model: Tenant,
        key: 'id',
      },
    },
    hasDependents: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    hasBeneficiaries: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    hasUploadedIdDocument: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    hasAcceptedTerms: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    hasCompletedCustomForms: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    hasUploadedRequiredDocuments: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    isProfileComplete: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    profileCompletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    dependentsCompletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    beneficiariesCompletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    idDocumentUploadedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    termsAcceptedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    customFormsCompletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    requiredDocumentsUploadedAt: {
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
    modelName: 'MemberProfileCompletion',
    tableName: 'MemberProfileCompletions',
    timestamps: true,
  }
);

export default MemberProfileCompletion;
