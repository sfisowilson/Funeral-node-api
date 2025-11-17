import express from 'express';
import {
  createSubscriptionPlanAsync,
  getSubscriptionPlanByIdAsync,
  getAllSubscriptionPlansAsync,
  updateSubscriptionPlanAsync,
  deleteSubscriptionPlanAsync
} from '../services/subscriptionPlanService';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

/**
 * @openapi
 * /SubscriptionPlan/SubscriptionPlan_Create:
 *   post:
 *     summary: Create a new subscription plan
 *     tags: [SubscriptionPlan]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SubscriptionPlanDto'
 *     responses:
 *       201:
 *         description: Created subscription plan
 */
router.post('/SubscriptionPlan_Create', authMiddleware, async (req: any, res) => {
  try {
    const tenantId = req.user?.tenantId;
    if (!tenantId) return res.status(401).json({ message: 'Tenant not found' });

    const plan = await createSubscriptionPlanAsync(req.body, tenantId);
    res.status(201).json(plan);
  } catch (error) {
    console.error('Error creating subscription plan:', error);
    res.status(500).json({ message: 'Error creating subscription plan' });
  }
});

/**
 * @openapi
 * /SubscriptionPlan/SubscriptionPlan_GetById/{id}:
 *   get:
 *     summary: Get subscription plan by ID
 *     tags: [SubscriptionPlan]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Subscription plan details
 */
router.get('/SubscriptionPlan_GetById/:id', authMiddleware, async (req: any, res) => {
  try {
    const tenantId = req.user?.tenantId;
    if (!tenantId) return res.status(401).json({ message: 'Tenant not found' });

    const { id } = req.params;
    const plan = await getSubscriptionPlanByIdAsync(id, tenantId);
    
    if (!plan) {
      return res.status(404).json({ message: 'Subscription plan not found' });
    }

    res.json(plan);
  } catch (error) {
    console.error('Error getting subscription plan:', error);
    res.status(500).json({ message: 'Error retrieving subscription plan' });
  }
});

/**
 * @openapi
 * /SubscriptionPlan/SubscriptionPlan_GetAll:
 *   get:
 *     summary: Get all subscription plans
 *     tags: [SubscriptionPlan]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of subscription plans
 */
router.get('/SubscriptionPlan_GetAll', authMiddleware, async (req: any, res) => {
  try {
    const tenantId = req.user?.tenantId;
    if (!tenantId) return res.status(401).json({ message: 'Tenant not found' });

    const plans = await getAllSubscriptionPlansAsync(tenantId);
    res.json(plans);
  } catch (error) {
    console.error('Error getting subscription plans:', error);
    res.status(500).json({ message: 'Error retrieving subscription plans' });
  }
});

/**
 * @openapi
 * /SubscriptionPlan/SubscriptionPlan_Update/{id}:
 *   put:
 *     summary: Update a subscription plan
 *     tags: [SubscriptionPlan]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SubscriptionPlanDto'
 *     responses:
 *       200:
 *         description: Updated subscription plan
 */
router.put('/SubscriptionPlan_Update/:id', authMiddleware, async (req: any, res) => {
  try {
    const tenantId = req.user?.tenantId;
    if (!tenantId) return res.status(401).json({ message: 'Tenant not found' });

    const { id } = req.params;
    if (id !== req.body.id) {
      return res.status(400).json({ message: 'ID mismatch' });
    }

    const plan = await updateSubscriptionPlanAsync(req.body, tenantId);
    if (!plan) {
      return res.status(404).json({ message: 'Subscription plan not found' });
    }

    res.json(plan);
  } catch (error) {
    console.error('Error updating subscription plan:', error);
    res.status(500).json({ message: 'Error updating subscription plan' });
  }
});

/**
 * @openapi
 * /SubscriptionPlan/SubscriptionPlan_Delete/{id}:
 *   delete:
 *     summary: Delete a subscription plan
 *     tags: [SubscriptionPlan]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Subscription plan deleted successfully
 */
router.delete('/SubscriptionPlan_Delete/:id', authMiddleware, async (req: any, res) => {
  try {
    const tenantId = req.user?.tenantId;
    if (!tenantId) return res.status(401).json({ message: 'Tenant not found' });

    const { id } = req.params;
    const deleted = await deleteSubscriptionPlanAsync(id, tenantId);
    
    if (!deleted) {
      return res.status(404).json({ message: 'Subscription plan not found' });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting subscription plan:', error);
    res.status(500).json({ message: 'Error deleting subscription plan' });
  }
});

export default router;
