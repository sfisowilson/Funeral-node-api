import express from 'express';
import {
  getAllFieldConfigurationsAsync,
  getFieldConfigurationByIdAsync,
  getEnabledFieldConfigurationsAsync,
  getFieldConfigurationsByCategoryAsync,
  createFieldConfigurationAsync,
  updateFieldConfigurationAsync,
  deleteFieldConfigurationAsync,
  updateFieldOrdersAsync,
  initializeDefaultFieldConfigurationsAsync,
  saveMemberOnboardingDataAsync,
  getMemberOnboardingDataAsync
} from '../services/onboardingFieldConfigurationService';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

/**
 * @openapi
 * /OnboardingFieldConfiguration/OnboardingFieldConfiguration_GetAll:
 *   get:
 *     summary: Get all field configurations (Admin only)
 *     tags: [OnboardingFieldConfiguration]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all field configurations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/OnboardingFieldConfigurationDto'
 */
router.get('/OnboardingFieldConfiguration_GetAll', authMiddleware, async (req: any, res) => {
  try {
    const tenantId = req.user?.tenantId;
    if (!tenantId) return res.status(401).json({ message: 'Tenant not found' });

    const configurations = await getAllFieldConfigurationsAsync(tenantId);
    res.json(configurations);
  } catch (error) {
    console.error('Error getting field configurations:', error);
    res.status(500).json({ message: 'Error retrieving field configurations' });
  }
});

/**
 * @openapi
 * /OnboardingFieldConfiguration/OnboardingFieldConfiguration_GetById:
 *   get:
 *     summary: Get a specific field configuration by ID (Admin only)
 *     tags: [OnboardingFieldConfiguration]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Field configuration details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OnboardingFieldConfigurationDto'
 */
router.get('/OnboardingFieldConfiguration_GetById', authMiddleware, async (req: any, res) => {
  try {
    const tenantId = req.user?.tenantId;
    if (!tenantId) return res.status(401).json({ message: 'Tenant not found' });

    const { id } = req.query;
    const configuration = await getFieldConfigurationByIdAsync(id as string, tenantId);
    
    if (!configuration) {
      return res.status(404).json({ message: 'Field configuration not found' });
    }

    res.json(configuration);
  } catch (error) {
    console.error('Error getting field configuration:', error);
    res.status(500).json({ message: 'Error retrieving field configuration' });
  }
});

/**
 * @openapi
 * /OnboardingFieldConfiguration/OnboardingFieldConfiguration_GetEnabled:
 *   get:
 *     summary: Get all enabled field configurations for onboarding form
 *     tags: [OnboardingFieldConfiguration]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of enabled field configurations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/OnboardingFieldConfigurationDto'
 */
router.get('/OnboardingFieldConfiguration_GetEnabled', authMiddleware, async (req: any, res) => {
  try {
    const tenantId = req.user?.tenantId;
    if (!tenantId) return res.status(401).json({ message: 'Tenant not found' });

    const configurations = await getEnabledFieldConfigurationsAsync(tenantId);
    res.json(configurations);
  } catch (error) {
    console.error('Error getting enabled field configurations:', error);
    res.status(500).json({ message: 'Error retrieving enabled field configurations' });
  }
});

/**
 * @openapi
 * /OnboardingFieldConfiguration/OnboardingFieldConfiguration_GetByCategory:
 *   get:
 *     summary: Get field configurations grouped by category
 *     tags: [OnboardingFieldConfiguration]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Field configurations grouped by category
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
router.get('/OnboardingFieldConfiguration_GetByCategory', authMiddleware, async (req: any, res) => {
  try {
    const tenantId = req.user?.tenantId;
    if (!tenantId) return res.status(401).json({ message: 'Tenant not found' });

    const configurations = await getFieldConfigurationsByCategoryAsync(tenantId);
    res.json(configurations);
  } catch (error) {
    console.error('Error getting field configurations by category:', error);
    res.status(500).json({ message: 'Error retrieving field configurations by category' });
  }
});

/**
 * @openapi
 * /OnboardingFieldConfiguration/OnboardingFieldConfiguration_Create:
 *   post:
 *     summary: Create a new field configuration (Admin only)
 *     tags: [OnboardingFieldConfiguration]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateOnboardingFieldConfigurationDto'
 *     responses:
 *       201:
 *         description: Created field configuration
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OnboardingFieldConfigurationDto'
 */
router.post('/OnboardingFieldConfiguration_Create', authMiddleware, async (req: any, res) => {
  try {
    const tenantId = req.user?.tenantId;
    if (!tenantId) return res.status(401).json({ message: 'Tenant not found' });

    const configuration = await createFieldConfigurationAsync(req.body, tenantId);
    res.status(201).json(configuration);
  } catch (error) {
    console.error('Error creating field configuration:', error);
    res.status(500).json({ message: 'Error creating field configuration' });
  }
});

/**
 * @openapi
 * /OnboardingFieldConfiguration/OnboardingFieldConfiguration_Update:
 *   put:
 *     summary: Update an existing field configuration (Admin only)
 *     tags: [OnboardingFieldConfiguration]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateOnboardingFieldConfigurationDto'
 *     responses:
 *       200:
 *         description: Updated field configuration
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OnboardingFieldConfigurationDto'
 */
router.put('/OnboardingFieldConfiguration_Update', authMiddleware, async (req: any, res) => {
  try {
    const tenantId = req.user?.tenantId;
    if (!tenantId) return res.status(401).json({ message: 'Tenant not found' });

    const configuration = await updateFieldConfigurationAsync(req.body, tenantId);
    res.json(configuration);
  } catch (error: any) {
    if (error.message === 'Field configuration not found') {
      return res.status(404).json({ message: error.message });
    }
    console.error('Error updating field configuration:', error);
    res.status(500).json({ message: 'Error updating field configuration' });
  }
});

/**
 * @openapi
 * /OnboardingFieldConfiguration/OnboardingFieldConfiguration_Delete:
 *   delete:
 *     summary: Delete a field configuration (Admin only)
 *     tags: [OnboardingFieldConfiguration]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Field configuration deleted successfully
 */
router.delete('/OnboardingFieldConfiguration_Delete', authMiddleware, async (req: any, res) => {
  try {
    const tenantId = req.user?.tenantId;
    if (!tenantId) return res.status(401).json({ message: 'Tenant not found' });

    const { id } = req.query;
    await deleteFieldConfigurationAsync(id as string, tenantId);
    res.status(204).send();
  } catch (error: any) {
    if (error.message === 'Field configuration not found') {
      return res.status(404).json({ message: error.message });
    }
    console.error('Error deleting field configuration:', error);
    res.status(500).json({ message: 'Error deleting field configuration' });
  }
});

/**
 * @openapi
 * /OnboardingFieldConfiguration/OnboardingFieldConfiguration_UpdateOrders:
 *   put:
 *     summary: Update display order for multiple fields (Admin only)
 *     tags: [OnboardingFieldConfiguration]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/UpdateFieldOrderDto'
 *     responses:
 *       200:
 *         description: Field orders updated successfully
 */
router.put('/OnboardingFieldConfiguration_UpdateOrders', authMiddleware, async (req: any, res) => {
  try {
    const tenantId = req.user?.tenantId;
    if (!tenantId) return res.status(401).json({ message: 'Tenant not found' });

    await updateFieldOrdersAsync(req.body, tenantId);
    res.json({ message: 'Orders updated successfully' });
  } catch (error) {
    console.error('Error updating field orders:', error);
    res.status(500).json({ message: 'Error updating field orders' });
  }
});

/**
 * @openapi
 * /OnboardingFieldConfiguration/OnboardingFieldConfiguration_InitializeDefaults:
 *   post:
 *     summary: Initialize default field configurations for the tenant (Admin only)
 *     tags: [OnboardingFieldConfiguration]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Default field configurations initialized
 */
router.post('/OnboardingFieldConfiguration_InitializeDefaults', authMiddleware, async (req: any, res) => {
  try {
    const tenantId = req.user?.tenantId;
    if (!tenantId) return res.status(401).json({ message: 'Tenant not found' });

    await initializeDefaultFieldConfigurationsAsync(tenantId);
    res.json({ message: 'Default field configurations initialized' });
  } catch (error) {
    console.error('Error initializing default field configurations:', error);
    res.status(500).json({ message: 'Error initializing default field configurations' });
  }
});

/**
 * @openapi
 * /OnboardingFieldConfiguration/OnboardingFieldConfiguration_SaveMemberData:
 *   post:
 *     summary: Save member's onboarding form data
 *     tags: [OnboardingFieldConfiguration]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SaveMemberOnboardingDataDto'
 *     responses:
 *       200:
 *         description: Onboarding data saved successfully
 */
router.post('/OnboardingFieldConfiguration_SaveMemberData', authMiddleware, async (req: any, res) => {
  try {
    const tenantId = req.user?.tenantId;
    const memberId = req.user?.memberId;
    
    if (!tenantId) return res.status(401).json({ message: 'Tenant not found' });
    if (!memberId) return res.status(400).json({ message: 'Member ID not found' });

    await saveMemberOnboardingDataAsync(memberId, req.body, tenantId);
    res.json({ message: 'Onboarding data saved successfully' });
  } catch (error) {
    console.error('Error saving member onboarding data:', error);
    res.status(500).json({ message: 'Error saving onboarding data' });
  }
});

/**
 * @openapi
 * /OnboardingFieldConfiguration/OnboardingFieldConfiguration_GetMemberData:
 *   get:
 *     summary: Get member's onboarding form data
 *     tags: [OnboardingFieldConfiguration]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Member onboarding data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MemberOnboardingDataDto'
 */
router.get('/OnboardingFieldConfiguration_GetMemberData', authMiddleware, async (req: any, res) => {
  try {
    const tenantId = req.user?.tenantId;
    const memberId = req.user?.memberId;
    
    if (!tenantId) return res.status(401).json({ message: 'Tenant not found' });
    if (!memberId) return res.status(400).json({ message: 'Member ID not found' });

    const data = await getMemberOnboardingDataAsync(memberId, tenantId);
    res.json(data);
  } catch (error) {
    console.error('Error getting member onboarding data:', error);
    res.status(500).json({ message: 'Error retrieving onboarding data' });
  }
});

export default router;
