import { Router } from 'express';
import { getAllPermissions, createPermission } from '../services/permissionService';

const router = Router();

/**
 * @openapi
 * /api/Permission/Permission_GetAllPermissions:
 *   get:
 *     tags:
 *       - Permission
 *     summary: Get all permissions (filtered by tenant type)
 *     description: Host tenant gets all permissions. Regular tenants don't get tenant/subscription management permissions.
 *     responses:
 *       200:
 *         description: List of permissions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PermissionDto'
 *       500:
 *         description: Error fetching permissions
 */
router.get('/Permission_GetAllPermissions', getAllPermissions);

/**
 * @openapi
 * /api/Permission/Permission_CreatePermission:
 *   post:
 *     tags:
 *       - Permission
 *     summary: Create a new permission
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *             required:
 *               - name
 *     responses:
 *       201:
 *         description: Permission created
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Error creating permission
 */
router.post('/Permission_CreatePermission', createPermission);

export default router;
