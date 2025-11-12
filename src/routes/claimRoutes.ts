
import { Router } from 'express';
import { checkEligibility, createEnhancedClaim, getProcessTracking, getByBeneficiary, getByMember, updateClaimDocuments, createClaim, getClaimById, getAllClaims, updateClaimStatus, deleteClaim } from '../services/claimService';

const router = Router();

/**
 * @openapi
 * /api/Claim/Claim_CheckEligibility:
 *   post:
 *     tags:
 *       - Claims
 *     summary: Check claim eligibility
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Eligibility result
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Error checking eligibility
 */
router.post('/Claim_CheckEligibility', checkEligibility);
/**
 * @openapi
 * /api/Claim/Claim_CreateEnhancedClaim:
 *   post:
 *     tags:
 *       - Claims
 *     summary: Create an enhanced claim
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EnhancedClaimDto'
 *     responses:
 *       201:
 *         description: Enhanced claim created
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Error creating claim
 */
router.post('/Claim_CreateEnhancedClaim', createEnhancedClaim);
/**
 * @openapi
 * /api/Claim/Claim_GetProcessTracking/{id}:
 *   get:
 *     tags:
 *       - Claims
 *     summary: Get claim process tracking by claim ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: Claim ID
 *     responses:
 *       200:
 *         description: Process tracking info
 *       404:
 *         description: Claim not found
 *       500:
 *         description: Error fetching process tracking
 */
router.get('/Claim_GetProcessTracking/:id', getProcessTracking);
/**
 * @openapi
 * /api/Claim/Claim_GetByBeneficiary/{beneficiaryId}:
 *   get:
 *     tags:
 *       - Claims
 *     summary: Get claims by beneficiary ID
 *     parameters:
 *       - in: path
 *         name: beneficiaryId
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: Beneficiary ID
 *     responses:
 *       200:
 *         description: List of claims
 *       404:
 *         description: No claims found
 *       500:
 *         description: Error fetching claims
 */
router.get('/Claim_GetByBeneficiary/:beneficiaryId', getByBeneficiary);
/**
 * @openapi
 * /api/Claim/Claim_GetByMember/{memberId}:
 *   get:
 *     tags:
 *       - Claims
 *     summary: Get claims by member ID
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
 *         description: List of claims
 *       404:
 *         description: No claims found
 *       500:
 *         description: Error fetching claims
 */
router.get('/Claim_GetByMember/:memberId', getByMember);
/**
 * @openapi
 * /api/Claim/Claim_UpdateClaimDocuments/{id}:
 *   post:
 *     tags:
 *       - Claims
 *     summary: Update claim documents
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: Claim ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Claim documents updated
 *       404:
 *         description: Claim not found
 *       500:
 *         description: Error updating claim documents
 */
router.post('/Claim_UpdateClaimDocuments/:id', updateClaimDocuments);
/**
 * @openapi
 * /api/Claim/Claim_CreateClaim:
 *   post:
 *     tags:
 *       - Claims
 *     summary: Create a new claim
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ClaimDto'
 *     responses:
 *       201:
 *         description: Claim created
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Error creating claim
 */
router.post('/Claim_CreateClaim', createClaim);
/**
 * @openapi
 * /api/Claim/Claim_GetClaimById/{id}:
 *   get:
 *     tags:
 *       - Claims
 *     summary: Get claim by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: Claim ID
 *     responses:
 *       200:
 *         description: Claim details
 *       404:
 *         description: Claim not found
 *       500:
 *         description: Error fetching claim
 */
router.get('/Claim_GetClaimById/:id', getClaimById);
/**
 * @openapi
 * /api/Claim/Claim_GetAllClaims:
 *   get:
 *     tags:
 *       - Claims
 *     summary: Get all claims
 *     responses:
 *       200:
 *         description: List of claims
 *       500:
 *         description: Error fetching claims
 */
router.get('/Claim_GetAllClaims', getAllClaims);
/**
 * @openapi
 * /api/Claim/Claim_UpdateClaimStatus/{id}:
 *   put:
 *     tags:
 *       - Claims
 *     summary: Update claim status
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: Claim ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Claim status updated
 *       404:
 *         description: Claim not found
 *       500:
 *         description: Error updating claim status
 */
router.put('/Claim_UpdateClaimStatus/:id', updateClaimStatus);
/**
 * @openapi
 * /api/Claim/Claim_DeleteClaim/{id}:
 *   delete:
 *     tags:
 *       - Claims
 *     summary: Delete a claim
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: Claim ID
 *     responses:
 *       204:
 *         description: Claim deleted
 *       404:
 *         description: Claim not found
 *       500:
 *         description: Error deleting claim
 */
router.delete('/Claim_DeleteClaim/:id', deleteClaim);

export default router;
