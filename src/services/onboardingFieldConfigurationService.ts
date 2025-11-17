import OnboardingFieldConfiguration from '../models/onboardingFieldConfiguration';
import { Op } from 'sequelize';

export const getAllFieldConfigurationsAsync = async (tenantId: string) => {
  return await OnboardingFieldConfiguration.findAll({
    where: { tenantId },
    order: [['category', 'ASC'], ['displayOrder', 'ASC']]
  });
};

export const getFieldConfigurationByIdAsync = async (id: string, tenantId: string) => {
  return await OnboardingFieldConfiguration.findOne({
    where: { id, tenantId }
  });
};

export const getEnabledFieldConfigurationsAsync = async (tenantId: string) => {
  return await OnboardingFieldConfiguration.findAll({
    where: {
      tenantId,
      isEnabled: true
    },
    order: [['category', 'ASC'], ['displayOrder', 'ASC']]
  });
};

export const getFieldConfigurationsByCategoryAsync = async (tenantId: string) => {
  const configurations = await OnboardingFieldConfiguration.findAll({
    where: { tenantId, isEnabled: true },
    order: [['category', 'ASC'], ['displayOrder', 'ASC']]
  });

  // Group by category
  const grouped: { [key: string]: any[] } = {};
  configurations.forEach((config: any) => {
    const category = config.category || 'Other';
    if (!grouped[category]) {
      grouped[category] = [];
    }
    grouped[category].push(config.toJSON());
  });

  return grouped;
};

export const createFieldConfigurationAsync = async (dto: any, tenantId: string) => {
  return await OnboardingFieldConfiguration.create({
    tenantId,
    fieldKey: dto.fieldKey || dto.fieldName,
    displayName: dto.displayName || dto.displayLabel,
    fieldType: dto.fieldType,
    category: dto.category,
    displayOrder: dto.displayOrder,
    isRequired: dto.isRequired ?? false,
    isEnabled: dto.isEnabled ?? true,
    placeholder: dto.placeholder,
    helpText: dto.helpText,
    validationRules: dto.validationRules,
    options: dto.options,
    defaultValue: dto.defaultValue
  });
};

export const updateFieldConfigurationAsync = async (dto: any, tenantId: string) => {
  const [updated] = await OnboardingFieldConfiguration.update(
    {
      fieldKey: dto.fieldKey || dto.fieldName,
      displayName: dto.displayName || dto.displayLabel,
      fieldType: dto.fieldType,
      category: dto.category,
      displayOrder: dto.displayOrder,
      isRequired: dto.isRequired,
      isEnabled: dto.isEnabled,
      placeholder: dto.placeholder,
      helpText: dto.helpText,
      validationRules: dto.validationRules,
      options: dto.options,
      defaultValue: dto.defaultValue
    },
    {
      where: { id: dto.id, tenantId }
    }
  );

  if (updated === 0) {
    throw new Error('Field configuration not found');
  }

  return await OnboardingFieldConfiguration.findOne({
    where: { id: dto.id, tenantId }
  });
};

export const deleteFieldConfigurationAsync = async (id: string, tenantId: string) => {
  const deleted = await OnboardingFieldConfiguration.destroy({
    where: { id, tenantId }
  });

  if (deleted === 0) {
    throw new Error('Field configuration not found');
  }

  return true;
};

export const updateFieldOrdersAsync = async (orders: any[], tenantId: string) => {
  for (const order of orders) {
    await OnboardingFieldConfiguration.update(
      { displayOrder: order.displayOrder },
      { where: { id: order.id, tenantId } }
    );
  }
};

export const initializeDefaultFieldConfigurationsAsync = async (tenantId: string) => {
  const defaults = [
    { fieldKey: 'firstName', displayName: 'First Name', fieldType: 'text', category: 'Personal', displayOrder: 1, isRequired: true },
    { fieldKey: 'lastName', displayName: 'Last Name', fieldType: 'text', category: 'Personal', displayOrder: 2, isRequired: true },
    { fieldKey: 'idNumber', displayName: 'ID Number', fieldType: 'text', category: 'Personal', displayOrder: 3, isRequired: true },
    { fieldKey: 'dateOfBirth', displayName: 'Date of Birth', fieldType: 'date', category: 'Personal', displayOrder: 4, isRequired: true },
    { fieldKey: 'gender', displayName: 'Gender', fieldType: 'select', category: 'Personal', displayOrder: 5, isRequired: true },
    { fieldKey: 'phoneNumber', displayName: 'Phone Number', fieldType: 'tel', category: 'Contact', displayOrder: 6, isRequired: true },
    { fieldKey: 'email', displayName: 'Email Address', fieldType: 'email', category: 'Contact', displayOrder: 7, isRequired: true },
    { fieldKey: 'address', displayName: 'Physical Address', fieldType: 'textarea', category: 'Contact', displayOrder: 8, isRequired: false }
  ];

  for (const def of defaults) {
    await OnboardingFieldConfiguration.create({
      tenantId,
      ...def,
      isEnabled: true
    });
  }
};

export const saveMemberOnboardingDataAsync = async (memberId: string, data: any, tenantId: string) => {
  // This would save to a MemberOnboardingData table
  // Implement based on your data model
  // For now, this is a placeholder
  return true;
};

export const getMemberOnboardingDataAsync = async (memberId: string, tenantId: string) => {
  // This would retrieve from a MemberOnboardingData table
  // Implement based on your data model
  // For now, this is a placeholder
  return {};
};
