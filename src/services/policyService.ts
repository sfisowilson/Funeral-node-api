
import { Response } from 'express';
import { RequestWithTenant } from '../middleware/tenantMiddleware';
import Policy from '../models/policy';

export const getById = async (req: RequestWithTenant, res: Response) => {
  try {
    if (!req.tenant) {
      return res.status(400).json({ error: 'Tenant not found' });
    }
    const { id } = req.params;
    const policy = await Policy.findOne({ where: { id, tenantId: req.tenant.id } });
    if (policy) {
      res.json(policy);
    } else {
      res.status(404).json({ error: 'Policy not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error getting policy' });
  }
};

export const getAllPolicies = async (req: RequestWithTenant, res: Response) => {
  try {
    if (!req.tenant) {
      return res.status(400).json({ error: 'Tenant not found' });
    }
    const policies = await Policy.findAll({ where: { tenantId: req.tenant.id } });
    res.json(policies);
  } catch (error) {
    res.status(500).json({ error: 'Error getting policies' });
  }
};

export const createPolicy = async (req: RequestWithTenant, res: Response) => {
  try {
    const { policyNumber, description, status, payoutAmount, coverageAmount, price, premiumAmount } = req.body;
    if (!req.tenant) {
      return res.status(400).json({ error: 'Tenant not found' });
    }
    const policy = await Policy.create({ policyNumber, description, status, payoutAmount, coverageAmount, price, premiumAmount, tenantId: req.tenant.id });
    res.status(201).json(policy);
  } catch (error) {
    res.status(500).json({ error: 'Error creating policy' });
  }
};

export const updatePolicy = async (req: RequestWithTenant, res: Response) => {
  try {
    if (!req.tenant) {
      return res.status(400).json({ error: 'Tenant not found' });
    }
    const { id } = req.params;
    const { policyNumber, description, status, payoutAmount, coverageAmount, price, premiumAmount } = req.body;
    const [updated] = await Policy.update({ policyNumber, description, status, payoutAmount, coverageAmount, price, premiumAmount }, { where: { id, tenantId: req.tenant.id } });
    if (updated) {
      const updatedPolicy = await Policy.findOne({ where: { id } });
      res.json(updatedPolicy);
    } else {
      res.status(404).json({ error: 'Policy not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error updating policy' });
  }
};

export const deletePolicy = async (req: RequestWithTenant, res: Response) => {
  try {
    if (!req.tenant) {
      return res.status(400).json({ error: 'Tenant not found' });
    }
    const { id } = req.params;
    const deleted = await Policy.destroy({ where: { id, tenantId: req.tenant.id } });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Policy not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error deleting policy' });
  }
};
