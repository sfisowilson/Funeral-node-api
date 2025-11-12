
import { Response } from 'express';
import { RequestWithTenant } from '../middleware/tenantMiddleware';
import DashboardWidgetSetting from '../models/dashboardWidgetSetting';

export const getAll = async (req: RequestWithTenant, res: Response) => {
  try {
    if (!req.tenant) {
      return res.status(400).json({ error: 'Tenant not found' });
    }
    const dashboardWidgetSettings = await DashboardWidgetSetting.findAll({ where: { tenantId: req.tenant.id } });
    res.json(dashboardWidgetSettings);
  } catch (error) {
    res.status(500).json({ error: 'Error getting dashboard widget settings' });
  }
};

export const getVisibleByRoles = async (req: RequestWithTenant, res: Response) => {
  try {
    if (!req.tenant) {
      return res.status(400).json({ error: 'Tenant not found' });
    }
    const { roles } = req.body;
    if (!Array.isArray(roles)) {
      return res.status(400).json({ error: 'Roles must be an array' });
    }
    const settings = await DashboardWidgetSetting.findAll({
      where: { tenantId: req.tenant.id },
      order: [['displayOrder', 'ASC']]
    });
    // Filter by allowedRoles string (comma-separated)
    const visible = settings.filter(s => {
      let allowedRoles: string[] = [];
      try {
        if (s.allowedRoles) {
          allowedRoles = s.allowedRoles.split(',').map(r => r.trim());
        }
      } catch { allowedRoles = []; }
      if (!allowedRoles.length) return true;
      return allowedRoles.some(r => roles.includes(r));
    });
    res.json(visible);
  } catch (error) {
    res.status(500).json({ error: 'Error getting visible dashboard widgets' });
  }
};

export const create = async (req: RequestWithTenant, res: Response) => {
  try {
    const { widgetKey, widgetName, isVisible, allowedRoles, displayOrder } = req.body;
    if (!req.tenant) {
      return res.status(400).json({ error: 'Tenant not found' });
    }
    const dashboardWidgetSetting = await DashboardWidgetSetting.create({
      widgetKey,
      widgetName,
      isVisible,
      allowedRoles,
      displayOrder,
      tenantId: req.tenant.id,
    });
    res.status(201).json(dashboardWidgetSetting);
  } catch (error) {
    res.status(500).json({ error: 'Error creating dashboard widget setting' });
  }
};

export const update = async (req: RequestWithTenant, res: Response) => {
  try {
    if (!req.tenant) {
      return res.status(400).json({ error: 'Tenant not found' });
    }
    const { id } = req.params;
    const { widgetKey, widgetName, isVisible, allowedRoles, displayOrder } = req.body;
    const [updated] = await DashboardWidgetSetting.update(
      { widgetKey, widgetName, isVisible, allowedRoles, displayOrder },
      { where: { id, tenantId: req.tenant.id } }
    );
    if (updated) {
      const updatedDashboardWidgetSetting = await DashboardWidgetSetting.findOne({ where: { id, tenantId: req.tenant.id } });
      res.json(updatedDashboardWidgetSetting);
    } else {
      res.status(404).json({ error: 'Dashboard widget setting not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error updating dashboard widget setting' });
  }
};

export const deleteWidget = async (req: RequestWithTenant, res: Response) => {
  try {
    if (!req.tenant) {
      return res.status(400).json({ error: 'Tenant not found' });
    }
    const { id } = req.params;
    const deleted = await DashboardWidgetSetting.destroy({ where: { id, tenantId: req.tenant.id } });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Dashboard widget setting not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error deleting dashboard widget setting' });
  }
};

export const initializeDefaults = async (req: RequestWithTenant, res: Response) => {
  try {
    if (!req.tenant) {
      return res.status(400).json({ error: 'Tenant not found' });
    }
    const tenantId = req.tenant.id;
    const existingCount = await DashboardWidgetSetting.count({ where: { tenantId } });
    if (existingCount > 0) {
      return res.json(false);
    }
    const defaults = [
      {
        widgetName: 'Stats Summary',
        configuration: JSON.stringify({ allowedRoles: ['Admin', 'Manager'], displayOrder: 1 }),
      },
      {
        widgetName: 'Revenue Chart',
        configuration: JSON.stringify({ allowedRoles: ['Admin', 'Manager'], displayOrder: 2 }),
      },
      {
        widgetName: 'Member Growth',
        configuration: JSON.stringify({ allowedRoles: ['Admin', 'Manager'], displayOrder: 3 }),
      }
    ];
    for (const def of defaults) {
      await DashboardWidgetSetting.create({ ...def, tenantId });
    }
    res.json(true);
  } catch (error) {
    res.status(500).json({ error: 'Error initializing default dashboard widgets' });
  }
};
