import RequiredDocument from '../models/requiredDocument';
import FileMetadata from '../models/fileMetadata';
import { Op } from 'sequelize';

export const getRequiredDocumentsAsync = async (tenantId: string) => {
  return await RequiredDocument.findAll({
    where: { tenantId, isActive: true },
    order: [['documentName', 'ASC']]
  });
};

export const getMemberDocumentStatusAsync = async (memberId: string, tenantId: string) => {
  const requiredDocs = await RequiredDocument.findAll({
    where: { tenantId, isActive: true }
  });

  const uploadedDocs = await FileMetadata.findAll({
    where: {
      tenantId,
      entityId: memberId,
      entityType: 'Member'
    }
  });

  const status = {
    memberId,
    totalRequired: requiredDocs.filter(d => d.isRequired).length,
    totalUploaded: uploadedDocs.length,
    documents: requiredDocs.map(doc => ({
      ...doc.toJSON(),
      isUploaded: uploadedDocs.some(u => u.memberDocumentType === Number(doc.documentType))
    }))
  };

  return status;
};

export const createRequiredDocumentAsync = async (dto: any, tenantId: string, userId?: string) => {
  const createData: any = {
    tenantId,
    documentName: dto.documentName,
    description: dto.description,
    documentType: dto.documentType,
    entityType: dto.entityType,
    isRequired: dto.isRequired ?? true,
    isActive: dto.isActive ?? true,
    allowedFileTypes: dto.allowedFileTypes,
    maxFileSizeBytes: dto.maxFileSizeBytes
  };
  if (userId) {
    createData.createdBy = userId;
  }
  return await RequiredDocument.create(createData);
};

export const updateRequiredDocumentAsync = async (dto: any, tenantId: string, userId?: string) => {
  const updateData: any = {
    documentName: dto.documentName,
    description: dto.description,
    documentType: dto.documentType,
    entityType: dto.entityType,
    isRequired: dto.isRequired,
    isActive: dto.isActive,
    allowedFileTypes: dto.allowedFileTypes,
    maxFileSizeBytes: dto.maxFileSizeBytes
  };
  if (userId) {
    updateData.updatedBy = userId;
  }
  const [updated] = await RequiredDocument.update(updateData, {
    where: { id: dto.id, tenantId }
  });

  return updated > 0;
};

export const deleteRequiredDocumentAsync = async (id: string, tenantId: string) => {
  const deleted = await RequiredDocument.destroy({
    where: { id, tenantId }
  });

  return deleted > 0;
};
