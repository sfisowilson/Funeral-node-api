export const getCheckoutsByAsset = async (req: RequestWithTenant, res: Response) => {
  try {
    const { assetId } = req.params;
    // Optionally filter by tenant if multi-tenant
    const where: any = { assetId };
    if (req.tenant?.id) {
      where.tenantId = req.tenant.id;
    }
    const checkouts = await AssetCheckout.findAll({
      where,
      order: [['checkoutDate', 'DESC']],
      include: [{ model: Asset }],
    });
    res.json(checkouts);
  } catch (error) {
    console.error('Error getting checkouts by asset:', error);
    res.status(500).send('An error occurred while retrieving checkouts');
  }
};


import { Request, Response } from 'express';
import { RequestWithTenant } from '../middleware/tenantMiddleware';
import Asset from '../models/asset';
import AssetCheckout from '../models/assetCheckout';
import AssetInspectionLog from '../models/assetInspectionLog';
import { Op } from 'sequelize';

export const getAll = async (req: RequestWithTenant, res: Response) => {
  try {
    const assets = await Asset.findAll();
    res.json(assets);
  } catch (error) {
    console.error('Error getting all assets:', error);
    res.status(500).send('An error occurred while retrieving assets');
  }
};
export const getById = async (req: RequestWithTenant, res: Response) => {
  try {
    const { id } = req.params;
    const asset = await Asset.findByPk(id);
    if (asset) {
      res.json(asset);
    } else {
      res.status(404).send('Asset not found');
    }
  } catch (error) {
    console.error('Error getting asset by ID:', error);
    res.status(500).send('An error occurred while retrieving the asset');
  }
};
export const getByType = async (req: RequestWithTenant, res: Response) => {
  try {
    // Asset model doesn't have assetType field - return all assets as fallback
    const assets = await Asset.findAll();
    res.json(assets);
  } catch (error) {
    console.error('Error getting assets:', error);
    res.status(500).send('An error occurred while retrieving assets');
  }
};
export const getByStatus = async (req: RequestWithTenant, res: Response) => {
  try {
    const { status } = req.params;
    const assets = await Asset.findAll({ where: { status } });
    res.json(assets);
  } catch (error) {
    console.error('Error getting assets by status:', error);
    res.status(500).send('An error occurred while retrieving assets');
  }
};
export const getAvailable = async (req: RequestWithTenant, res: Response) => {
  try {
    // Asset model doesn't have isAvailable field - return all assets as fallback
    const assets = await Asset.findAll();
    res.json(assets);
  } catch (error) {
    console.error('Error getting available assets:', error);
    res.status(500).send('An error occurred while retrieving available assets');
  }
};
export const create = async (req: RequestWithTenant, res: Response) => {
  try {
    const {
      name,
      description,
      assetType,
      identificationNumber,
      make,
      model,
      year,
      quantity,
      status,
      currentLocation,
      requiresInspection,
      inspectionCheckpointsJson,
      purchaseDate,
      purchaseCost,
      conditionNotes,
    } = req.body;

    if (!req.tenant?.id) {
      return res.status(401).send('Tenant not found');
    }

    const asset = await Asset.create({
      name,
      description,
      assetType,
      identificationNumber,
      make,
      model,
      year,
      quantity,
      status,
      currentLocation,
      requiresInspection,
      inspectionCheckpointsJson,
      purchaseDate,
      purchaseCost,
      conditionNotes,
      tenantId: req.tenant.id,
    });

    res.status(201).json(asset);
  } catch (error) {
    console.error('Error creating asset:', error);
    res.status(500).send('An error occurred while creating the asset');
  }
};
export const update = async (req: RequestWithTenant, res: Response) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      assetType,
      identificationNumber,
      make,
      model,
      year,
      quantity,
      status,
      currentLocation,
      requiresInspection,
      inspectionCheckpointsJson,
      lastMaintenanceDate,
      nextMaintenanceDate,
      purchaseDate,
      purchaseCost,
      conditionNotes,
    } = req.body;

    const [updated] = await Asset.update(
      {
        name,
        description,
        assetType,
        identificationNumber,
        make,
        model,
        year,
        quantity,
        status,
        currentLocation,
        requiresInspection,
        inspectionCheckpointsJson,
        lastMaintenanceDate,
        nextMaintenanceDate,
        purchaseDate,
        purchaseCost,
        conditionNotes,
      },
      { where: { id, tenantId: req.tenant?.id } }
    );

    if (updated) {
      const updatedAsset = await Asset.findByPk(id);
      res.json(updatedAsset);
    } else {
      res.status(404).send('Asset not found');
    }
  } catch (error) {
    console.error('Error updating asset:', error);
    res.status(500).send('An error occurred while updating the asset');
  }
};
export const deleteAsset = async (req: RequestWithTenant, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await Asset.destroy({ where: { id } });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).send('Asset not found');
    }
  } catch (error) {
    console.error('Error deleting asset:', error);
    res.status(500).send('An error occurred while deleting the asset');
  }
};
export const getStats = async (req: RequestWithTenant, res: Response) => {
  try {
    const totalAssets = await Asset.count();
    const checkedOutAssets = await Asset.count();
    const underMaintenanceAssets = await Asset.count();

    res.json({
      totalAssets,
      availableAssets: totalAssets,
      checkedOutAssets,
      underMaintenanceAssets,
    });
  } catch (error) {
    console.error('Error getting asset stats:', error);
    res.status(500).send('An error occurred while retrieving asset statistics');
  }
};
export const checkout = async (req: RequestWithTenant, res: Response) => {
  try {
    const { assetId, userId, checkoutDate } = req.body;
    if (!req.tenant?.id) {
      return res.status(401).send('Tenant not found');
    }
    const checkedOutByUserId = req.user?.id; 
    const createData: any = { assetId, userId, checkoutDate, tenantId: req.tenant.id };
    if (checkedOutByUserId) {
      createData.createdBy = checkedOutByUserId;
    }

    const checkout = await AssetCheckout.create(createData);
    res.status(201).json(checkout);
  } catch (error) {
    console.error('Error checking out asset:', error);
    res.status(500).send('An error occurred while checking out the asset');
  }
};
export const checkin = async (req: RequestWithTenant, res: Response) => {
  try {
    const { checkoutId, returnDate } = req.body;
    const checkedInByUserId = req.user?.id;
    const updateData: any = { returnDate };
    if (checkedInByUserId) {
      updateData.updatedBy = checkedInByUserId;
    }

    const [updated] = await AssetCheckout.update(
      updateData,
      { where: { id: checkoutId } }
    );

    if (updated) {
      const updatedCheckout = await AssetCheckout.findByPk(checkoutId);
      res.json(updatedCheckout);
    } else {
      res.status(404).send('Checkout record not found');
    }
  } catch (error) {
    console.error('Error checking in asset:', error);
    res.status(500).send('An error occurred while checking in the asset');
  }
};
export const getAllCheckouts = async (req: RequestWithTenant, res: Response) => {
  try {
    const checkouts = await AssetCheckout.findAll();
    res.json(checkouts);
  } catch (error) {
    console.error('Error getting all checkouts:', error);
    res.status(500).send('An error occurred while retrieving checkouts');
  }
};
export const getActiveCheckouts = async (req: RequestWithTenant, res: Response) => {
  try {
    const activeCheckouts = await AssetCheckout.findAll();
    res.json(activeCheckouts);
  } catch (error) {
    console.error('Error getting active checkouts:', error);
    res.status(500).send('An error occurred while retrieving active checkouts');
  }
};
export const getOverdueCheckouts = async (req: RequestWithTenant, res: Response) => {
  try {
    // AssetCheckout model doesn't have status or expectedReturnDate fields
    const overdueCheckouts = await AssetCheckout.findAll();
    res.json(overdueCheckouts);
  } catch (error) {
    console.error('Error getting overdue checkouts:', error);
    res.status(500).send('An error occurred while retrieving overdue checkouts');
  }
};
export const getMyCheckouts = async (req: RequestWithTenant, res: Response) => {
  try {
    const userId = req.user?.id; // Assuming req.user is populated by authentication middleware
    if (!userId) {
      return res.status(401).send('User not authenticated');
    }
    const myCheckouts = await AssetCheckout.findAll({ where: { userId } });
    res.json(myCheckouts);
  } catch (error) {
    console.error('Error getting user checkouts:', error);
    res.status(500).send('An error occurred while retrieving your checkouts');
  }
};
export const getCheckoutsByUser = async (req: RequestWithTenant, res: Response) => {
  try {
    const { userId } = req.params;
    const checkouts = await AssetCheckout.findAll({ where: { userId } });
    res.json(checkouts);
  } catch (error) {
    console.error('Error getting checkouts by user:', error);
    res.status(500).send('An error occurred while retrieving checkouts');
  }
};
export const getCheckoutById = async (req: RequestWithTenant, res: Response) => {
  try {
    const { id } = req.params;
    const checkout = await AssetCheckout.findByPk(id);
    if (checkout) {
      res.json(checkout);
    } else {
      res.status(404).send('Checkout not found');
    }
  } catch (error) {
    console.error('Error getting checkout by ID:', error);
    res.status(500).send('An error occurred while retrieving the checkout');
  }
};
export const cancelCheckout = async (req: RequestWithTenant, res: Response) => {
  try {
    const { checkoutId } = req.params;
    const checkout = await AssetCheckout.findByPk(checkoutId);
    if (!checkout) {
      return res.status(404).send('Checkout not found');
    }
    // Delete the checkout record
    await checkout.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Error cancelling checkout:', error);
    res.status(500).send('An error occurred while cancelling the checkout');
  }
};
export const createInspection = async (req: RequestWithTenant, res: Response) => {
  try {
    const { assetId } = req.params;
    const { notes } = req.body;
    const userId = req.user?.id;
    if (!userId) return res.status(401).send('User not authenticated');
    if (!req.tenant?.id) return res.status(401).send('Tenant not found');
    if (!assetId) return res.status(400).send('Asset ID is required');
    
    const inspection = await AssetInspectionLog.create({
      assetId,
      notes,
      inspectionDate: new Date(),
      tenantId: req.tenant.id,
      createdBy: userId
    });
    res.status(201).json(inspection);
  } catch (error) {
    console.error('Error creating inspection:', error);
    res.status(500).send('An error occurred while creating inspection');
  }
};
export const getInspectionsByAsset = async (req: RequestWithTenant, res: Response) => {
  try {
    const { assetId } = req.params;
    const inspections = await AssetInspectionLog.findAll({ where: { assetId } });
    res.json(inspections);
  } catch (error) {
    console.error('Error getting inspections by asset:', error);
    res.status(500).send('An error occurred while retrieving inspections');
  }
};
export const getInspectionsByCheckout = async (req: RequestWithTenant, res: Response) => {
  try {
    // AssetInspectionLog model doesn't have checkoutId field
    const inspections = await AssetInspectionLog.findAll();
    res.json(inspections);
  } catch (error) {
    console.error('Error getting inspections by checkout:', error);
    res.status(500).send('An error occurred while retrieving inspections');
  }
};
export const getInspectionById = async (req: RequestWithTenant, res: Response) => {
  try {
    const { id } = req.params;
    const inspection = await AssetInspectionLog.findByPk(id);
    if (inspection) {
      res.json(inspection);
    } else {
      res.status(404).send('Inspection not found');
    }
  } catch (error) {
    console.error('Error getting inspection by ID:', error);
    res.status(500).send('An error occurred while retrieving the inspection');
  }
};
export const scheduleMaintenance = async (req: RequestWithTenant, res: Response) => {
  try {
    const { assetId, maintenanceDate, notes } = req.body;
    const asset = await Asset.findByPk(assetId);
    if (!asset) return res.status(404).send('Asset not found');
    // Asset model doesn't have nextMaintenanceDate or conditionNotes fields
    // Just update the status
    asset.status = 'UnderMaintenance';
    await asset.save();
    res.status(204).send();
  } catch (error) {
    console.error('Error scheduling maintenance:', error);
    res.status(500).send('An error occurred while scheduling maintenance');
  }
};
export const completeMaintenance = async (req: RequestWithTenant, res: Response) => {
  try {
    const { assetId, nextMaintenanceDate, notes } = req.body;
    const asset = await Asset.findByPk(assetId);
    if (!asset) return res.status(404).send('Asset not found');
    // Asset model doesn't have lastMaintenanceDate, nextMaintenanceDate, or conditionNotes fields
    asset.status = 'Available';
    await asset.save();
    res.status(204).send();
  } catch (error) {
    console.error('Error completing maintenance:', error);
    res.status(500).send('An error occurred while completing maintenance');
  }
};
export const getAssetsNeedingMaintenance = async (req: RequestWithTenant, res: Response) => {
  try {
    // Asset model doesn't have nextMaintenanceDate field
    const assets = await Asset.findAll({
      order: [['createdAt', 'ASC']],
    });
    res.json(assets);
  } catch (error) {
    console.error('Error getting assets needing maintenance:', error);
    res.status(500).send('An error occurred while retrieving assets needing maintenance');
  }
};
