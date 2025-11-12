
import { Router } from 'express';
import { registerTenant, getTenantById, getAllTenants, updateTenant, deleteTenant } from '../services/tenantService';

const router = Router();

/**
 * @openapi
 * /api/Tenant/Tenant_RegisterTenant:
 *   post:
 *     tags:
 *       - Tenant
 *     summary: Register a new tenant
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Tenant registered successfully
 *       400:
 *         description: Invalid request
 *       500:
 *         description: Internal server error
 */
router.post('/Tenant_RegisterTenant', registerTenant);
/**
 * @openapi
 * /api/Tenant/Tenant_GetTenantById/{id}:
 *   get:
 *     tags:
 *       - Tenant
 *     summary: Get tenant by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Tenant ID
 *     responses:
 *       200:
 *         description: Tenant details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       404:
 *         description: Tenant not found
 */
router.get('/Tenant_GetTenantById/:id', getTenantById);
/**
 * @openapi
 * /api/Tenant/Tenant_GetAllTenants:
 *   get:
 *     tags:
 *       - Tenant
 *     summary: Get all tenants
 *     responses:
 *       200:
 *         description: List of tenants
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
router.get('/Tenant_GetAllTenants', getAllTenants);
/**
 * @openapi
 * /api/Tenant/Tenant_UpdateTenant/{id}:
 *   put:
 *     tags:
 *       - Tenant
 *     summary: Update tenant by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Tenant ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Tenant updated
 *       400:
 *         description: Invalid request
 *       404:
 *         description: Tenant not found
 */
router.put('/Tenant_UpdateTenant/:id', updateTenant);
/**
 * @openapi
 * /api/Tenant/Tenant_DeleteTenant/{id}:
 *   delete:
 *     tags:
 *       - Tenant
 *     summary: Delete tenant by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Tenant ID
 *     responses:
 *       200:
 *         description: Tenant deleted
 *       404:
 *         description: Tenant not found
 */
router.delete('/Tenant_DeleteTenant/:id', deleteTenant);

export default router;
