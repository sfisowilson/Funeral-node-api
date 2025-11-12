import express from 'express';
import tenantSettingService from '../services/tenantSettingService';
import { tenantMiddleware, RequestWithTenant } from '../middleware/tenantMiddleware';

const router = express.Router();

// Note: TenantSetting_GetCurrentTenantSettings is registered as a public endpoint
// in index.ts before authMiddleware is applied, for landing page access

// GET by id
router.get('/TenantSetting_GetById/:id', tenantMiddleware, async (req: RequestWithTenant, res) => {
  try {
/**
 * @openapi
 * /api/TenantSetting/TenantSetting_GetById/{id}:
 *   get:
 *     tags:
 *       - Tenant Settings
 *     summary: Get tenant setting by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: TenantSetting ID
 *     responses:
 *       200:
 *         description: TenantSetting details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TenantSettingDto'
 *       404:
 *         description: TenantSetting not found
 *       500:
 *         description: Error fetching tenantSetting
 */
  const setting = await tenantSettingService.getById(req.params.id as string);
    if (!setting) return res.status(404).json({ message: 'TenantSetting not found' });
    res.json(setting);
  } catch (err) {
    res.status(500).json({ message: 'An error occurred', error: err });
  }
});

// GET all tenant settings
router.get('/TenantSetting_GetAllTenantSettings', tenantMiddleware, async (req, res) => {
  try {
/**
 * @openapi
 * /api/TenantSetting/TenantSetting_GetAllTenantSettings:
 *   get:
 *     tags:
 *       - Tenant Settings
 *     summary: Get all tenant settings
 *     parameters:
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *         required: false
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         required: false
 *     responses:
 *       200:
 *         description: List of tenant settings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TenantSettingDto'
 *       404:
 *         description: No tenantSettings found
 *       500:
 *         description: Error fetching tenantSettings
 */
    const offset = parseInt(req.query.offset as string) || 0;
    const limit = parseInt(req.query.limit as string) || 50;
    const settings = await tenantSettingService.getAllTenantSettings(offset, limit);
    if (!settings || settings.length === 0) return res.status(404).json({ message: 'No tenantSettings found.' });
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: 'An error occurred', error: err });
  }
});

// CREATE
router.post('/TenantSetting_CreateTenantSetting', tenantMiddleware, async (req: RequestWithTenant, res) => {
  try {
/**
 * @openapi
 * /api/TenantSetting/TenantSetting_CreateTenantSetting:
 *   post:
 *     tags:
 *       - Tenant Settings
 *     summary: Create a new tenant setting
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TenantSettingDto'
 *     responses:
 *       201:
 *         description: TenantSetting created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TenantSettingDto'
 *       500:
 *         description: Failed to create tenantSetting
 */
    const data = { ...req.body, tenantId: req.tenant?.id };
    const created = await tenantSettingService.createTenantSetting(data);
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create tenantSetting.', error: err });
  }
});

// UPDATE
router.post('/TenantSetting_UpdateTenantSetting', tenantMiddleware, async (req: RequestWithTenant, res) => {
  try {
/**
 * @openapi
 * /api/TenantSetting/TenantSetting_UpdateTenantSetting:
 *   post:
 *     tags:
 *       - Tenant Settings
 *     summary: Update a tenant setting
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TenantSettingDto'
 *     responses:
 *       200:
 *         description: TenantSetting updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TenantSettingDto'
 *       404:
 *         description: TenantSetting not found
 *       500:
 *         description: Failed to update tenantSetting
 */
    const { id, ...data } = req.body;
    if (!id) return res.status(400).json({ message: 'TenantSetting id is required.' });
    const updated = await tenantSettingService.updateTenantSetting(id, data);
    if (!updated) return res.status(404).json({ message: 'TenantSetting not found.' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update tenantSetting.', error: err });
  }
});

// UPDATE by TenantId (more convenient for UI)
router.post('/TenantSetting_UpdateCurrentTenantSetting', tenantMiddleware, async (req: RequestWithTenant, res) => {
  try {
    const tenantId = req.tenant?.id;
    if (!tenantId) return res.status(401).json({ message: 'Tenant not found.' });
    
    const updated = await tenantSettingService.updateTenantSettingByTenantId(tenantId, req.body);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update tenantSetting.', error: err });
  }
});

// DELETE
router.delete('/TenantSetting_DeleteTenantSetting/:id', tenantMiddleware, async (req, res) => {
  try {
/**
 * @openapi
 * /api/TenantSetting/TenantSetting_DeleteTenantSetting/{id}:
 *   delete:
 *     tags:
 *       - Tenant Settings
 *     summary: Delete a tenant setting
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: TenantSetting ID
 *     responses:
 *       204:
 *         description: TenantSetting deleted
 *       404:
 *         description: TenantSetting not found
 *       500:
 *         description: Failed to delete tenantSetting
 */
  const deleted = await tenantSettingService.deleteTenantSetting(req.params.id as string);
    if (!deleted) return res.status(404).json({ message: 'TenantSetting not found.' });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete tenantSetting.', error: err });
  }
});

// SAVE EMAIL SETTINGS
router.post('/TenantSetting_SaveEmailSettings', tenantMiddleware, async (req: RequestWithTenant, res) => {
  try {
    const tenantId = req.tenant?.id;
    if (!tenantId) return res.status(401).json({ message: 'Tenant not found.' });
    
    const { smtpServer, smtpPort, smtpUsername, smtpPassword, enableSsl } = req.body;
    
    if (!smtpServer || !smtpPort || !smtpUsername || !smtpPassword) {
      return res.status(400).json({ message: 'Missing required email settings.' });
    }

    const updated = await tenantSettingService.saveEmailSettings(
      tenantId,
      smtpServer,
      smtpPort,
      smtpUsername,
      smtpPassword,
      enableSsl || false
    );
    
    res.json({ message: 'Email settings saved successfully', data: updated });
  } catch (err) {
    res.status(500).json({ message: 'Failed to save email settings.', error: err });
  }
});

// SAVE OZOW SETTINGS
router.post('/TenantSetting_SaveOzowSettings', tenantMiddleware, async (req: RequestWithTenant, res) => {
  try {
    const tenantId = req.tenant?.id;
    if (!tenantId) return res.status(401).json({ message: 'Tenant not found.' });
    
    const { apiKey, siteCode, privateKey } = req.body;
    
    if (!apiKey || !siteCode || !privateKey) {
      return res.status(400).json({ message: 'Missing required Ozow settings.' });
    }

    const updated = await tenantSettingService.saveOzowSettings(
      tenantId,
      apiKey,
      siteCode,
      privateKey
    );
    
    res.json({ message: 'Ozow settings saved successfully', data: updated });
  } catch (err) {
    res.status(500).json({ message: 'Failed to save Ozow settings.', error: err });
  }
});

export default router;
