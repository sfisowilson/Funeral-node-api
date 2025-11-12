
import { Router } from 'express';
import { getById, getAllBeneficiaries, getMyBeneficiaries, getBeneficiariesByMemberId, createBeneficiary, updateBeneficiary, deleteBeneficiary } from '../services/beneficiaryService';

const router = Router();

/**
 * @openapi
 * /api/Beneficiary/Beneficiary_GetById/{id}:
 *   get:
 *     tags:
 *       - Beneficiaries
 *     summary: Get beneficiary by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: Beneficiary ID
 *     responses:
 *       200:
 *         description: Beneficiary details
 *       404:
 *         description: Beneficiary not found
 *       500:
 *         description: Error fetching beneficiary
 */
router.get('/Beneficiary_GetById/:id', getById);
/**
 * @openapi
 * /api/Beneficiary/Beneficiary_GetAllBeneficiaries:
 *   get:
 *     tags:
 *       - Beneficiaries
 *     summary: Get all beneficiaries
 *     responses:
 *       200:
 *         description: List of beneficiaries
 *       500:
 *         description: Error fetching beneficiaries
 */
router.get('/Beneficiary_GetAllBeneficiaries', getAllBeneficiaries);
/**
 * @openapi
 * /api/Beneficiary/Beneficiary_GetMyBeneficiaries:
 *   get:
 *     tags:
 *       - Beneficiaries
 *     summary: Get current user's beneficiaries
 *     responses:
 *       200:
 *         description: List of beneficiaries
 *       500:
 *         description: Error fetching beneficiaries
 */
router.get('/Beneficiary_GetMyBeneficiaries', getMyBeneficiaries);
/**
 * @openapi
 * /api/Beneficiary/Beneficiary_GetBeneficiariesByMemberId/{memberId}:
 *   get:
 *     tags:
 *       - Beneficiaries
 *     summary: Get beneficiaries by member ID
 *     parameters:
 *       - in: path
 *         name: memberId
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: Member ID
 *     responses:
 *       200:
 *         description: List of beneficiaries
 *       404:
 *         description: No beneficiaries found
 *       500:
 *         description: Error fetching beneficiaries
 */
router.get('/Beneficiary_GetBeneficiariesByMemberId/:memberId', getBeneficiariesByMemberId);
/**
 * @openapi
 * /api/Beneficiary/Beneficiary_CreateBeneficiary:
 *   post:
 *     tags:
 *       - Beneficiaries
 *     summary: Create a new beneficiary
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BeneficiaryDto'
 *     responses:
 *       201:
 *         description: Beneficiary created
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Error creating beneficiary
 */
router.post('/Beneficiary_CreateBeneficiary', createBeneficiary);
/**
 * @openapi
 * /api/Beneficiary/Beneficiary_UpdateBeneficiary:
 *   put:
 *     tags:
 *       - Beneficiaries
 *     summary: Update a beneficiary
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BeneficiaryDto'
 *     responses:
 *       200:
 *         description: Beneficiary updated
 *       404:
 *         description: Beneficiary not found
 *       500:
 *         description: Error updating beneficiary
 */
router.put('/Beneficiary_UpdateBeneficiary', updateBeneficiary);
/**
 * @openapi
 * /api/Beneficiary/Beneficiary_DeleteBeneficiary/{id}:
 *   delete:
 *     tags:
 *       - Beneficiaries
 *     summary: Delete a beneficiary
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: Beneficiary ID
 *     responses:
 *       204:
 *         description: Beneficiary deleted
 *       404:
 *         description: Beneficiary not found
 *       500:
 *         description: Error deleting beneficiary
 */
router.delete('/Beneficiary_DeleteBeneficiary/:id', deleteBeneficiary);

export default router;
