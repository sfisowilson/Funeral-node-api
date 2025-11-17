import { Router, Request, Response } from 'express';
import { userRoleService } from '../services/userRoleService';

const router = Router();

/**
 * @openapi
 * /api/UserRole/UserRole_GetAll:
 *   get:
 *     tags:
 *       - User Role
 *     summary: Get all user roles
 *     responses:
 *       200:
 *         description: List of user roles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserRoleDto'
 *       500:
 *         description: Error fetching user roles
 */
router.get('/UserRole_GetAll', async (req: Request, res: Response) => {
    try {
        const userRoles = await userRoleService.getAllUserRoles();
        res.json(userRoles);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user roles', error });
    }
});

/**
 * @openapi
 * /api/UserRole/UserRole_GetByUserId:
 *   get:
 *     tags:
 *       - User Role
 *     summary: Get user roles by user ID
 *     parameters:
 *       - name: userId
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: User roles retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserRoleDto'
 *       500:
 *         description: Error fetching user roles
 */
router.get('/UserRole_GetByUserId', async (req: Request, res: Response) => {
    try {
        const { userId } = req.query;
        const userRoles = await userRoleService.getUserRolesByUserId(userId as string);
        res.json(userRoles);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user roles', error });
    }
});

/**
 * @openapi
 * /api/UserRole/UserRole_Get:
 *   get:
 *     tags:
 *       - User Role
 *     summary: Get user role by ID
 *     parameters:
 *       - name: id
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: User role retrieved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserRoleDto'
 *       404:
 *         description: User role not found
 *       500:
 *         description: Error fetching user role
 */
router.get('/UserRole_Get', async (req: Request, res: Response) => {
    try {
        const { id } = req.query;
        const userRole = await userRoleService.getUserRoleById(id as string);
        if (!userRole) {
            return res.status(404).json({ message: 'UserRole not found' });
        }
        res.json(userRole);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user role', error });
    }
});

/**
 * @openapi
 * /api/UserRole/UserRole_CreateUserRole:
 *   post:
 *     tags:
 *       - User Role
 *     summary: Create user role
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserRoleInputDto'
 *     responses:
 *       200:
 *         description: User role created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserRoleDto'
 *       400:
 *         description: Invalid request
 *       500:
 *         description: Error creating user role
 */
router.post('/UserRole_CreateUserRole', async (req: Request, res: Response) => {
    try {
        const userRole = await userRoleService.createUserRole(req.body);
        res.json(userRole);
    } catch (error) {
        res.status(500).json({ message: 'Error creating user role', error });
    }
});

/**
 * @openapi
 * /api/UserRole/UserRole_Delete:
 *   delete:
 *     tags:
 *       - User Role
 *     summary: Delete user role
 *     parameters:
 *       - name: id
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: User role deleted
 *       404:
 *         description: User role not found
 *       500:
 *         description: Error deleting user role
 */
router.delete('/UserRole_Delete', async (req: Request, res: Response) => {
    try {
        const { id } = req.query;
        const result = await userRoleService.deleteUserRole(id as string);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user role', error });
    }
});

export default router;
