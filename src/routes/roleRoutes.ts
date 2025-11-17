import { Router } from 'express';
import { getAllRoles, createRole, updateRole } from '../services/roleService';

const router = Router();

/**
 * @openapi
 * /api/Role/Role_GetAllRoles:
 *   get:
 *     tags:
 *       - Role
 *     summary: Get all roles for the current tenant
 *     responses:
 *       200:
 *         description: List of roles with permissions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/RoleDto'
 *       500:
 *         description: Error fetching roles
 */
router.get('/Role_GetAllRoles', getAllRoles);

/**
 * @openapi
 * /api/Role/Role_CreateRole:
 *   post:
 *     tags:
 *       - Role
 *     summary: Create a new role
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
 *         description: Role created
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Error creating role
 */
router.post('/Role_CreateRole', createRole);

/**
 * @openapi
 * /api/Role/Role_UpdateRole:
 *   post:
 *     tags:
 *       - Role
 *     summary: Update an existing role
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RoleDto'
 *     responses:
 *       200:
 *         description: Role updated
 *       404:
 *         description: Role not found
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Error updating role
 */
router.post('/Role_UpdateRole', updateRole);

export default router;
