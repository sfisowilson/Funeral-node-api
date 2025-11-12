
import { Response } from 'express';
import { RequestWithTenant } from '../middleware/tenantMiddleware';
import Asset from '../models/asset';

// Asset Service
export const createAsset = async (req: RequestWithTenant, res: Response) => {
  try {
    const { name, description } = req.body;
    if (!req.tenant) {
      return res.status(400).json({ error: 'Tenant not found' });
    }
    const asset = await Asset.create({ name, description, tenantId: req.tenant.id });
    res.status(201).json(asset);
  } catch (error) {
    res.status(500).json({ error: 'Error creating asset' });
  }
};

export const getAssets = async (req: RequestWithTenant, res: Response) => {
  try {
    if (!req.tenant) {
      return res.status(400).json({ error: 'Tenant not found' });
    }
    const assets = await Asset.findAll({ where: { tenantId: req.tenant.id } });
    res.json(assets);
  } catch (error) {
    res.status(500).json({ error: 'Error getting assets' });
  }
};

export const getAssetById = async (req: RequestWithTenant, res: Response) => {
  try {
    if (!req.tenant) {
      return res.status(400).json({ error: 'Tenant not found' });
    }
    const { id } = req.params;
    const asset = await Asset.findOne({ where: { id, tenantId: req.tenant.id } });
    if (asset) {
      res.json(asset);
    } else {
      res.status(404).json({ error: 'Asset not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error getting asset' });
  }
};

export const updateAsset = async (req: RequestWithTenant, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    if (!req.tenant) {
      return res.status(400).json({ error: 'Tenant not found' });
    }
    const asset = await Asset.findOne({ where: { id, tenantId: req.tenant.id } });
    if (!asset) {
      return res.status(404).json({ error: 'Asset not found' });
    }
    await asset.update({ name, description });
    res.json(asset);
  } catch (error) {
    res.status(500).json({ error: 'Error updating asset' });
  }
};

export const deleteAsset = async (req: RequestWithTenant, res: Response) => {
  try {
    if (!req.tenant) {
      return res.status(400).json({ error: 'Tenant not found' });
    }
    const { id } = req.params;
    const deleted = await Asset.destroy({ where: { id, tenantId: req.tenant.id } });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Asset not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error deleting asset' });
  }
};
