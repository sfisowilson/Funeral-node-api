
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db/database';
import { v4 as uuidv4 } from 'uuid';

interface MemberAttributes {
  id: string;
  tenantId: string;
  // Legacy fields
  name?: string;
  address?: string;
  // Phase 1: Personal Information
  title?: string;
  firstNames?: string;
  surname?: string;
  dateOfBirth?: Date;
  email?: string;
  phone1?: string;
  phone2?: string;
  identificationNumber?: string;
  // Phase 1: Income Information
  sourceOfIncome?: string;
  sourceOfIncomeOther?: string;
  // Phase 1: Structured Address
  streetAddress?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  country?: string;
  // Phase 1: Policy Replacement
  isReplacingExistingPolicy?: boolean;
  existingPolicyNumber?: string;
  existingInsurerName?: string;
  existingPolicyPaidUpToDate?: boolean;
  existingPolicyWaitingPeriodExpired?: boolean;
  sameBenefitAsExistingPolicy?: boolean;
  benefitDifferenceNotes?: string;
  // Phase 2: Employment
  occupation?: string;
  workPhoneNumber?: string;
  // Phase 2: Nationality & Residency
  passportNumber?: string;
  countryOfBirth?: string;
  countryOfResidence?: string;
  citizenship?: string;
  nationality?: string;
  isForeigner?: boolean;
  workPermitNumber?: string;
  // Status & Payment
  status?: string;
  paymentStatus?: string;
  nextPaymentDate?: Date;
  // Tenant & Verification
  isIdVerified?: boolean;
  idVerifiedAt?: Date;
  isLifeVerified?: boolean;
  lifeVerifiedAt?: Date;
  // Digital Signature
  signatureDataUrl?: string;
  signedAt?: Date;
  // Audit
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
  updatedBy?: string;
}

interface MemberCreationAttributes extends Optional<MemberAttributes, 'id'> {}

class Member extends Model<MemberAttributes, MemberCreationAttributes> implements MemberAttributes {
  public id!: string;
  public tenantId!: string;
  public name?: string;
  public address?: string;
  public title?: string;
  public firstNames?: string;
  public surname?: string;
  public dateOfBirth?: Date;
  public email?: string;
  public phone1?: string;
  public phone2?: string;
  public identificationNumber?: string;
  public sourceOfIncome?: string;
  public sourceOfIncomeOther?: string;
  public streetAddress?: string;
  public city?: string;
  public province?: string;
  public postalCode?: string;
  public country?: string;
  public isReplacingExistingPolicy?: boolean;
  public existingPolicyNumber?: string;
  public existingInsurerName?: string;
  public existingPolicyPaidUpToDate?: boolean;
  public existingPolicyWaitingPeriodExpired?: boolean;
  public sameBenefitAsExistingPolicy?: boolean;
  public benefitDifferenceNotes?: string;
  public occupation?: string;
  public workPhoneNumber?: string;
  public passportNumber?: string;
  public countryOfBirth?: string;
  public countryOfResidence?: string;
  public citizenship?: string;
  public nationality?: string;
  public isForeigner?: boolean;
  public workPermitNumber?: string;
  public status?: string;
  public paymentStatus?: string;
  public nextPaymentDate?: Date;
  public isIdVerified?: boolean;
  public idVerifiedAt?: Date;
  public isLifeVerified?: boolean;
  public lifeVerifiedAt?: Date;
  public signatureDataUrl?: string;
  public signedAt?: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public createdBy?: string;
  public updatedBy?: string;
}

Member.init(
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
    // Legacy fields
    name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    // Phase 1: Personal Information
    title: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    firstNames: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    surname: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    dateOfBirth: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
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
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    // Phase 1: Income Information
    sourceOfIncome: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    sourceOfIncomeOther: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    // Phase 1: Structured Address
    streetAddress: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    province: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    postalCode: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    country: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    // Phase 1: Policy Replacement
    isReplacingExistingPolicy: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    existingPolicyNumber: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    existingInsurerName: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    existingPolicyPaidUpToDate: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    existingPolicyWaitingPeriodExpired: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    sameBenefitAsExistingPolicy: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    benefitDifferenceNotes: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    // Phase 2: Employment Information
    occupation: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    workPhoneNumber: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    // Phase 2: Nationality & Residency
    passportNumber: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    countryOfBirth: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    countryOfResidence: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    citizenship: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    nationality: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    isForeigner: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    workPermitNumber: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    // Status & Payment
    status: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: 'Pending',
    },
    paymentStatus: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: 'Pending',
    },
    nextPaymentDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    // Tenant & Verification
    isIdVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    idVerifiedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    isLifeVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    lifeVerifiedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    // Digital Signature
    signatureDataUrl: {
      type: DataTypes.TEXT('long'),
      allowNull: true,
    },
    signedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    // Audit
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
    modelName: 'Member',
    tableName: 'Members',
    timestamps: true,
  }
);

export default Member;