import { Response } from 'express';
import { RequestWithTenant } from '../middleware/tenantMiddleware';
import ClaimDocument from '../models/claimDocument';
import { ClaimDocumentType, ClaimDocumentStatus } from '../models/claimDocument';

export const createClaimDocument = async (req: RequestWithTenant, res: Response) => {
  try {
    const { claimId, fileName, originalFileName, filePath, contentType, fileSize, documentType, status } = req.body;
    if (!req.tenant) {
      return res.status(400).json({ error: 'Tenant not found' });
    }
    const claimDocument = await ClaimDocument.create({
      claimId,
      fileName,
      originalFileName,
      filePath,
      contentType,
      fileSize,
      documentType,
      status,
      tenantId: req.tenant.id
    });
    res.status(201).json(claimDocument);
  } catch (error) {
    res.status(500).json({ error: 'Error creating claim document' });
  }
};

export const getClaimDocumentById = async (req: RequestWithTenant, res: Response) => {
  try {
    if (!req.tenant) {
      return res.status(400).json({ error: 'Tenant not found' });
    }
    const { id } = req.params;
    const claimDocument = await ClaimDocument.findOne({ where: { id, tenantId: req.tenant.id } });
    if (claimDocument) {
      res.json(claimDocument);
    } else {
      res.status(404).json({ error: 'Claim document not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error getting claim document' });
  }
};

export const getDocumentsByClaim = async (req: RequestWithTenant, res: Response) => {
  try {
    if (!req.tenant) {
      return res.status(400).json({ error: 'Tenant not found' });
    }
    const { claimId } = req.params;
    const documents = await ClaimDocument.findAll({ where: { claimId, tenantId: req.tenant.id } });
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Error getting claim documents' });
  }
};

export const getAllClaimDocuments = async (req: RequestWithTenant, res: Response) => {
  try {
    if (!req.tenant) {
      return res.status(400).json({ error: 'Tenant not found' });
    }
    const documents = await ClaimDocument.findAll({ where: { tenantId: req.tenant.id } });
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Error getting claim documents' });
  }
};

export const updateClaimDocument = async (req: RequestWithTenant, res: Response) => {
  try {
    if (!req.tenant) {
      return res.status(400).json({ error: 'Tenant not found' });
    }
    const { id } = req.params;
    const { status, rejectionReason, verifiedBy, verifiedAt } = req.body;
    const [updated] = await ClaimDocument.update(
      { status, rejectionReason, verifiedBy, verifiedAt },
      { where: { id, tenantId: req.tenant.id } }
    );
    if (updated) {
      const updatedDocument = await ClaimDocument.findOne({ where: { id } });
      res.json(updatedDocument);
    } else {
      res.status(404).json({ error: 'Claim document not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error updating claim document' });
  }
};

export const deleteClaimDocument = async (req: RequestWithTenant, res: Response) => {
  try {
    if (!req.tenant) {
      return res.status(400).json({ error: 'Tenant not found' });
    }
    const { id } = req.params;
    const deleted = await ClaimDocument.destroy({ where: { id, tenantId: req.tenant.id } });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Claim document not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error deleting claim document' });
  }
};
