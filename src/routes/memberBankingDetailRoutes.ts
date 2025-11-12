
import { Router } from 'express';
import { getMyBankingDetails, getBankingDetailsByMemberId, hasBankingDetails, createBankingDetails, updateBankingDetails, deleteBankingDetails } from '../services/memberBankingDetailService';

const router = Router();

/**
 * @openapi
 * /api/MemberBankingDetail/MemberBankingDetail_GetMyBankingDetails:
 *   get:
 *     tags:
 *       - MemberBankingDetail
 *     summary: Get banking details for the current user
 *     responses:
 *       200:
 *         description: Banking details for the current user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       401:
 *         description: Unauthorized
 */
router.get('/MemberBankingDetail_GetMyBankingDetails', getMyBankingDetails);
/**
 * @openapi
 * /api/MemberBankingDetail/MemberBankingDetail_GetBankingDetailsByMemberId/{memberId}:
 *   get:
 *     tags:
 *       - MemberBankingDetail
 *     summary: Get banking details by member ID
 *     parameters:
 *       - in: path
 *         name: memberId
 *         required: true
 *         schema:
 *           type: string
 *         description: Member ID
 *     responses:
 *       200:
 *         description: Banking details for the member
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       404:
 *         description: Member not found
 */
router.get('/MemberBankingDetail_GetBankingDetailsByMemberId/:memberId', getBankingDetailsByMemberId);
/**
 * @openapi
 * /api/MemberBankingDetail/MemberBankingDetail_HasBankingDetails:
 *   get:
 *     tags:
 *       - MemberBankingDetail
 *     summary: Check if current user has banking details
 *     responses:
 *       200:
 *         description: Whether the user has banking details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 hasBankingDetails:
 *                   type: boolean
 *       401:
 *         description: Unauthorized
 */
router.get('/MemberBankingDetail_HasBankingDetails', hasBankingDetails);
/**
 * @openapi
 * /api/MemberBankingDetail/MemberBankingDetail_CreateBankingDetails:
 *   post:
 *     tags:
 *       - MemberBankingDetail
 *     summary: Create banking details for the current user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Banking details created
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 */
router.post('/MemberBankingDetail_CreateBankingDetails', createBankingDetails);
/**
 * @openapi
 * /api/MemberBankingDetail/MemberBankingDetail_UpdateBankingDetails/{id}:
 *   put:
 *     tags:
 *       - MemberBankingDetail
 *     summary: Update banking details by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Banking detail ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Banking details updated
 *       400:
 *         description: Invalid request
 *       404:
 *         description: Banking detail not found
 */
router.put('/MemberBankingDetail_UpdateBankingDetails/:id', updateBankingDetails);
/**
 * @openapi
 * /api/MemberBankingDetail/MemberBankingDetail_DeleteBankingDetails/{id}:
 *   delete:
 *     tags:
 *       - MemberBankingDetail
 *     summary: Delete banking details by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Banking detail ID
 *     responses:
 *       200:
 *         description: Banking details deleted
 *       404:
 *         description: Banking detail not found
 */
router.delete('/MemberBankingDetail_DeleteBankingDetails/:id', deleteBankingDetails);

export default router;
