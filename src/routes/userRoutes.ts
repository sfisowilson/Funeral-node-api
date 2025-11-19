import express from 'express';
import { userService } from '../services/userService';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

/**
 * @swagger
 * /api/User/User_GetAll:
 *   get:
 *     tags: [User]
 *     summary: Get all users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: tenantId
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserDto'
 */
router.get('/User_GetAll', authMiddleware, async (req, res) => {
    try {
        const tenantId = (req as any).tenantId;
        const users = await userService.getAllUsers(tenantId);
        res.json(users);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/User/User_Get:
 *   get:
 *     tags: [User]
 *     summary: Get user by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: User details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserDto'
 */
router.get('/User_Get', authMiddleware, async (req, res) => {
    try {
        const id = req.query.id as string;
        const user = await userService.getUserById(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/User/User_Create:
 *   post:
 *     tags: [User]
 *     summary: Create a new user
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserDto'
 *     responses:
 *       200:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserDto'
 */
router.post('/User_Create', authMiddleware, async (req, res) => {
    try {
        const currentUserId = (req as any).user?.id;
        const user = await userService.createUser(req.body, currentUserId);
        res.json(user);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/User/User_Update:
 *   put:
 *     tags: [User]
 *     summary: Update a user
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserDto'
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserDto'
 */
router.put('/User_Update', authMiddleware, async (req, res) => {
    try {
        const currentUserId = (req as any).user?.id;
        const user = await userService.updateUser(req.body.id, req.body, currentUserId);
        res.json(user);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/User/User_Delete:
 *   delete:
 *     tags: [User]
 *     summary: Delete a user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: User deleted successfully
 */
router.delete('/User_Delete', authMiddleware, async (req, res) => {
    try {
        const id = req.query.id as string;
        const result = await userService.deleteUser(id);
        res.json(result);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/User/User_Search:
 *   get:
 *     tags: [User]
 *     summary: Search users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: searchTerm
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: tenantId
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Search results
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserDto'
 */
router.get('/User_Search', authMiddleware, async (req, res) => {
    try {
        const searchTerm = req.query.searchTerm as string;
        const tenantId = (req as any).tenantId;
        const users = await userService.searchUsers(searchTerm, tenantId);
        res.json(users);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
