
import { Router } from 'express';
import { getStatus, getMyStatus, initialize, updateStep, recalculate, recalculateMy, getIncompleteMembers } from '../services/memberProfileCompletionService';

const router = Router();

/**
 * @openapi
 * /api/MemberProfileCompletion/ProfileCompletion_GetStatus/{memberId}:
 *   get:
 *     tags:
 *       - MemberProfileCompletion
 *     summary: Get profile completion status for a member
 *     parameters:
 *       - in: path
 *         name: memberId
 *         required: true
 *         schema:
 *           type: string
 *         description: Member ID
 *     responses:
 *       200:
 *         description: Profile completion status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       404:
 *         description: Member not found
 */
router.get('/ProfileCompletion_GetStatus/:memberId', getStatus);
/**
 * @openapi
 * /api/MemberProfileCompletion/ProfileCompletion_GetMyStatus:
 *   get:
 *     tags:
 *       - MemberProfileCompletion
 *     summary: Get profile completion status for the current user
 *     responses:
 *       200:
 *         description: Profile completion status for current user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       401:
 *         description: Unauthorized
 */
router.get('/ProfileCompletion_GetMyStatus', getMyStatus);
/**
 * @openapi
 * /api/MemberProfileCompletion/ProfileCompletion_Initialize:
 *   post:
 *     tags:
 *       - MemberProfileCompletion
 *     summary: Initialize profile completion for a member
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Profile completion initialized
 *       400:
 *         description: Invalid request
 */
router.post('/ProfileCompletion_Initialize', initialize);
/**
 * @openapi
 * /api/MemberProfileCompletion/ProfileCompletion_UpdateStep:
 *   post:
 *     tags:
 *       - MemberProfileCompletion
 *     summary: Update a profile completion step
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Step updated
 *       400:
 *         description: Invalid request
 */
router.post('/ProfileCompletion_UpdateStep', updateStep);
/**
 * @openapi
 * /api/MemberProfileCompletion/ProfileCompletion_Recalculate/{memberId}:
 *   post:
 *     tags:
 *       - MemberProfileCompletion
 *     summary: Recalculate profile completion for a member
 *     parameters:
 *       - in: path
 *         name: memberId
 *         required: true
 *         schema:
 *           type: string
 *         description: Member ID
 *     responses:
 *       200:
 *         description: Profile completion recalculated
 *       404:
 *         description: Member not found
 */
router.post('/ProfileCompletion_Recalculate/:memberId', recalculate);
/**
 * @openapi
 * /api/MemberProfileCompletion/ProfileCompletion_RecalculateMy:
 *   post:
 *     tags:
 *       - MemberProfileCompletion
 *     summary: Recalculate profile completion for the current user
 *     responses:
 *       200:
 *         description: Profile completion recalculated for current user
 *       401:
 *         description: Unauthorized
 */
router.post('/ProfileCompletion_RecalculateMy', recalculateMy);
/**
 * @openapi
 * /api/MemberProfileCompletion/ProfileCompletion_GetIncompleteMembers:
 *   get:
 *     tags:
 *       - MemberProfileCompletion
 *     summary: Get members with incomplete profiles
 *     responses:
 *       200:
 *         description: List of members with incomplete profiles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
router.get('/ProfileCompletion_GetIncompleteMembers', getIncompleteMembers);

export default router;
