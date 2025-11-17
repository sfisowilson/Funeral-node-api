
import { Router } from 'express';
import { getById, getAllMembers, create, approveMember, rejectMember, disableMember, enableMember, updateMember, deleteMember, saveSignature, getMySignature, getSignatureForMember } from '../services/memberService';

const router = Router();

/**
 * @openapi
 * /api/Member/Member_GetById/{id}:
 *   get:
 *     tags:
 *       - Members
 *     summary: Get member by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: Member ID
 *     responses:
 *       200:
 *         description: Member details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MemberDto'
 *       404:
 *         description: Member not found
 *       500:
 *         description: Error fetching member
 */
router.get('/Member_GetById/:id', getById);
/**
 * @openapi
 * /api/Member/Member_GetAllMembers:
 *   get:
 *     tags:
 *       - Members
 *     summary: Get all members
 *     responses:
 *       200:
 *         description: List of members
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/MemberDto'
 *       500:
 *         description: Error fetching members
 */
router.get('/Member_GetAllMembers', getAllMembers);
/**
 * @openapi
 * /api/Member/Member_Create:
 *   post:
 *     tags:
 *       - Members
 *     summary: Create a new member
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MemberDto'
 *     responses:
 *       201:
 *         description: Member created
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Error creating member
 */
router.post('/Member_Create', create);
/**
 * @openapi
 * /api/Member/Member_ApproveMember/{id}:
 *   post:
 *     tags:
 *       - Members
 *     summary: Approve a member
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: Member ID
 *     responses:
 *       200:
 *         description: Member approved
 *       404:
 *         description: Member not found
 *       500:
 *         description: Error approving member
 */
router.post('/Member_ApproveMember/:id', approveMember);
/**
 * @openapi
 * /api/Member/Member_RejectMember/{id}:
 *   post:
 *     tags:
 *       - Members
 *     summary: Reject a member
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: Member ID
 *     responses:
 *       200:
 *         description: Member rejected
 *       404:
 *         description: Member not found
 *       500:
 *         description: Error rejecting member
 */
router.post('/Member_RejectMember/:id', rejectMember);
/**
 * @openapi
 * /api/Member/Member_DisableMember/{id}:
 *   post:
 *     tags:
 *       - Members
 *     summary: Disable a member
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: Member ID
 *     responses:
 *       200:
 *         description: Member disabled
 *       404:
 *         description: Member not found
 *       500:
 *         description: Error disabling member
 */
router.post('/Member_DisableMember/:id', disableMember);
/**
 * @openapi
 * /api/Member/Member_EnableMember/{id}:
 *   post:
 *     tags:
 *       - Members
 *     summary: Enable a member
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: Member ID
 *     responses:
 *       200:
 *         description: Member enabled
 *       404:
 *         description: Member not found
 *       500:
 *         description: Error enabling member
 */
router.post('/Member_EnableMember/:id', enableMember);
/**
 * @openapi
 * /api/Member/Member_UpdateMember/{id}:
 *   put:
 *     tags:
 *       - Members
 *     summary: Update a member
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: Member ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MemberDto'
 *     responses:
 *       200:
 *         description: Member updated
 *       404:
 *         description: Member not found
 *       500:
 *         description: Error updating member
 */
router.put('/Member_UpdateMember/:id', updateMember);
/**
 * @openapi
 * /api/Member/Member_DeleteMember/{id}:
 *   delete:
 *     tags:
 *       - Members
 *     summary: Delete a member
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: Member ID
 *     responses:
 *       204:
 *         description: Member deleted
 *       404:
 *         description: Member not found
 *       500:
 *         description: Error deleting member
 */
router.delete('/Member_DeleteMember/:id', deleteMember);
/**
 * @openapi
 * /api/Member/Member_SaveSignature:
 *   post:
 *     tags:
 *       - Members
 *     summary: Save a member's signature
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               memberId:
 *                 type: string
 *               signature:
 *                 type: string
 *     responses:
 *       200:
 *         description: Signature saved
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Error saving signature
 */
router.post('/Member_SaveSignature', saveSignature);
/**
 * @openapi
 * /api/Member/Member_GetMySignature:
 *   get:
 *     tags:
 *       - Members
 *     summary: Get the current user's signature
 *     responses:
 *       200:
 *         description: Signature data
 *       404:
 *         description: Signature not found
 *       500:
 *         description: Error fetching signature
 */
router.get('/Member_GetMySignature', getMySignature);
/**
 * @openapi
 * /api/Member/Member_GetSignatureForMember:
 *   get:
 *     tags:
 *       - Members
 *     summary: Get signature for a specific member
 *     parameters:
 *       - in: query
 *         name: memberId
 *         schema:
 *           type: string
 *         required: true
 *         description: Member ID
 *     responses:
 *       200:
 *         description: Signature data
 *       404:
 *         description: Signature not found
 *       500:
 *         description: Error fetching signature
 */
router.get('/Member_GetSignatureForMember', getSignatureForMember);

export default router;
