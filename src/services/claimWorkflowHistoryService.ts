import { Response } from 'express';
import { RequestWithTenant } from '../middleware/tenantMiddleware';
import ClaimWorkflowHistory from '../models/claimWorkflowHistory';
import { ClaimStatus } from '../models/claimWorkflowHistory';

export const createWorkflowHistory = async (req: RequestWithTenant, res: Response) => {
  try {
    const { claimId, oldStatus, newStatus, notes, changedBy } = req.body;
    if (!req.tenant) {
      return res.status(400).json({ error: 'Tenant not found' });
    }
    const history = await ClaimWorkflowHistory.create({
      claimId,
      oldStatus,
      newStatus,
      notes,
      changedBy,
      tenantId: req.tenant.id
    });
    res.status(201).json(history);
  } catch (error) {
    res.status(500).json({ error: 'Error creating workflow history' });
  }
};

export const getWorkflowHistoryById = async (req: RequestWithTenant, res: Response) => {
  try {
    if (!req.tenant) {
      return res.status(400).json({ error: 'Tenant not found' });
    }
    const { id } = req.params;
    const history = await ClaimWorkflowHistory.findOne({ where: { id, tenantId: req.tenant.id } });
    if (history) {
      res.json(history);
    } else {
      res.status(404).json({ error: 'Workflow history not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error getting workflow history' });
  }
};

export const getHistoryByClaim = async (req: RequestWithTenant, res: Response) => {
  try {
    if (!req.tenant) {
      return res.status(400).json({ error: 'Tenant not found' });
    }
    const { claimId } = req.params;
    const history = await ClaimWorkflowHistory.findAll({ 
      where: { claimId, tenantId: req.tenant.id },
      order: [['createdAt', 'DESC']]
    });
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: 'Error getting workflow history' });
  }
};

export const getAllWorkflowHistory = async (req: RequestWithTenant, res: Response) => {
  try {
    if (!req.tenant) {
      return res.status(400).json({ error: 'Tenant not found' });
    }
    const history = await ClaimWorkflowHistory.findAll({ 
      where: { tenantId: req.tenant.id },
      order: [['createdAt', 'DESC']]
    });
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: 'Error getting workflow history' });
  }
};

export const deleteWorkflowHistory = async (req: RequestWithTenant, res: Response) => {
  try {
    if (!req.tenant) {
      return res.status(400).json({ error: 'Tenant not found' });
    }
    const { id } = req.params;
    const deleted = await ClaimWorkflowHistory.destroy({ where: { id, tenantId: req.tenant.id } });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Workflow history not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error deleting workflow history' });
  }
};
