import SubscriptionPlan from '../models/subscriptionPlan';

export const createSubscriptionPlanAsync = async (dto: any, tenantId: string) => {
  return await SubscriptionPlan.create({
    name: dto.name,
    description: dto.description,
    monthlyPrice: dto.monthlyPrice,
    allowedTenantType: dto.allowedTenantType || 'Standard',
    features: dto.features
  });
};

export const getSubscriptionPlanByIdAsync = async (id: string, tenantId: string) => {
  return await SubscriptionPlan.findByPk(id);
};

export const getAllSubscriptionPlansAsync = async (tenantId: string) => {
  return await SubscriptionPlan.findAll({
    order: [['monthlyPrice', 'ASC']]
  });
};

export const updateSubscriptionPlanAsync = async (dto: any, tenantId: string) => {
  const [updated] = await SubscriptionPlan.update(
    {
      name: dto.name,
      description: dto.description,
      monthlyPrice: dto.monthlyPrice,
      allowedTenantType: dto.allowedTenantType,
      features: dto.features
    },
    {
      where: { id: dto.id }
    }
  );

  if (updated === 0) return null;

  return await SubscriptionPlan.findByPk(dto.id);
};

export const deleteSubscriptionPlanAsync = async (id: string, tenantId: string) => {
  const deleted = await SubscriptionPlan.destroy({
    where: { id }
  });

  return deleted > 0;
};
