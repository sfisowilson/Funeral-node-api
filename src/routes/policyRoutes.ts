
import { Router } from 'express';
import { getById, getAllPolicies, createPolicy, updatePolicy, deletePolicy } from '../services/policyService';

const router = Router();

/**
 * @openapi
 * /api/Policy/Policy_GetById/{id}:
 *   get:
 *     tags:
 *       - Policies
 *     summary: Get policy by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: Policy ID
 *     responses:
 *       200:
 *         description: Policy details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PolicyDto'
 *       404:
 *         description: Policy not found
 *       500:
 *         description: Error fetching policy
 */
router.get('/Policy_GetById/:id', getById);
/**
 * @openapi
 * /api/Policy/Policy_GetAllPolicies:
 *   get:
 *     tags:
 *       - Policies
 *     summary: Get all policies
 *     responses:
 *       200:
 *         description: List of policies
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PolicyDto'
 *       500:
 *         description: Error fetching policies
 */
router.get('/Policy_GetAllPolicies', getAllPolicies);
/**
 * @openapi
 * /api/Policy/Policy_CreatePolicy:
 *   post:
 *     tags:
 *       - Policies
 *     summary: Create a new policy
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PolicyDto'
 *     responses:
 *       201:
 *         description: Policy created
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Error creating policy
 */
router.post('/Policy_CreatePolicy', createPolicy);
/**
 * @openapi
 * /api/Policy/Policy_UpdatePolicy:
 *   post:
 *     tags:
 *       - Policies
 *     summary: Update a policy
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PolicyDto'
 *     responses:
 *       200:
 *         description: Policy updated
 *       404:
 *         description: Policy not found
 *       500:
 *         description: Error updating policy
 */
router.post('/Policy_UpdatePolicy', updatePolicy);
/**
 * @openapi
 * /api/Policy/Policy_DeletePolicy/{id}:
 *   delete:
 *     tags:
 *       - Policies
 *     summary: Delete a policy
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: Policy ID
 *     responses:
 *       204:
 *         description: Policy deleted
 *       404:
 *         description: Policy not found
 *       500:
 *         description: Error deleting policy
 */
router.delete('/Policy_DeletePolicy/:id', deletePolicy);

export default router;
