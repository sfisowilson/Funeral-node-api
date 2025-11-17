import TermsAndConditions from '../models/termsAndConditions';
import TermsAcceptance from '../models/termsAcceptance';
import { Op } from 'sequelize';

export const getActiveTermsAsync = async (tenantId: string) => {
  const now = new Date();
  return await TermsAndConditions.findOne({
    where: {
      tenantId,
      isActive: true,
      effectiveDate: { [Op.lte]: now }
    },
    order: [['effectiveDate', 'DESC']]
  });
};

export const getAllTermsAsync = async (tenantId: string) => {
  return await TermsAndConditions.findAll({
    where: { tenantId },
    order: [['effectiveDate', 'DESC']]
  });
};

export const createTermsAsync = async (dto: any, tenantId: string, userId?: string) => {
  // Deactivate previous active terms
  await TermsAndConditions.update(
    { isActive: false },
    { where: { tenantId, isActive: true } }
  );

  // Create new terms
  const createData: any = {
    tenantId,
    title: dto.title,
    content: dto.content,
    version: dto.version,
    isActive: true,
    effectiveDate: dto.effectiveDate || new Date(),
    expiryDate: dto.expiryDate || null
  };
  if (userId) {
    createData.createdBy = userId;
  }
  const terms = await TermsAndConditions.create(createData);

  return terms;
};

export const acceptTermsAsync = async (dto: any, tenantId: string) => {
  // Get the active terms
  const activeTerms = await getActiveTermsAsync(tenantId);
  if (!activeTerms) {
    throw new Error('No active terms and conditions found');
  }

  // Create acceptance record
  const acceptance = await TermsAcceptance.create({
    memberId: dto.memberId,
    termsAndConditionsId: activeTerms.id,
    tenantId,
    acceptedAt: new Date(),
    ipAddress: dto.ipAddress,
    userAgent: dto.userAgent,
    acceptedVersion: activeTerms.version || '1.0'
  });

  return true;
};

export const hasAcceptedLatestTermsAsync = async (memberId: string, tenantId: string) => {
  // Get the active terms
  const activeTerms = await getActiveTermsAsync(tenantId);
  if (!activeTerms) {
    return true; // No terms to accept
  }

  // Check if member has accepted these terms
  const acceptance = await TermsAcceptance.findOne({
    where: {
      memberId,
      termsAndConditionsId: activeTerms.id,
      tenantId
    }
  });

  return !!acceptance;
};

export const getMemberTermsAcceptanceAsync = async (memberId: string, tenantId: string) => {
  const acceptance = await TermsAcceptance.findOne({
    where: { memberId, tenantId },
    order: [['acceptedAt', 'DESC']]
  });

  if (!acceptance) {
    return null;
  }

  // Get the associated terms
  const terms = await TermsAndConditions.findByPk(acceptance.termsAndConditionsId);

  return {
    ...acceptance.toJSON(),
    termsAndConditions: terms
  };
};
