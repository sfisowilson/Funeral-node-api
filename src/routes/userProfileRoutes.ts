import express from 'express';
import { userService } from '../services/userService';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

/**
 * @swagger
 * /api/UserProfile/UserProfile_Get:
 *   get:
 *     tags: [UserProfile]
 *     summary: Get user profile
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
 *         description: User profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserProfileDto'
 */
router.get('/UserProfile_Get', authMiddleware, async (req, res) => {
    try {
        const id = req.query.id as string;
        const profile = await userService.getUserProfile(id);
        if (!profile) {
            return res.status(404).json({ error: 'User profile not found' });
        }
        res.json(profile);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/UserProfile/UserProfile_GetCurrent:
 *   get:
 *     tags: [UserProfile]
 *     summary: Get current user's profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserProfileDto'
 */
router.get('/UserProfile_GetCurrent', authMiddleware, async (req, res) => {
    try {
        const currentUserId = (req as any).user?.id;
        if (!currentUserId) {
            return res.status(401).json({ error: 'Not authenticated' });
        }
        
        const profile = await userService.getUserProfile(currentUserId);
        res.json(profile);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/UserProfile/UserProfile_UpdateCurrentUserProfile:
 *   put:
 *     tags: [UserProfile]
 *     summary: Update current user's profile
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserProfileDto'
 *     responses:
 *       204:
 *         description: Profile updated successfully
 *       401:
 *         description: Not authenticated
 */
router.put('/UserProfile_UpdateCurrentUserProfile', authMiddleware, async (req, res) => {
    try {
        const currentUserId = (req as any).user?.id;
        if (!currentUserId) {
            return res.status(401).json({ error: 'Not authenticated' });
        }
        
        await userService.updateUserProfile(currentUserId, req.body);
        res.status(204).send();
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
