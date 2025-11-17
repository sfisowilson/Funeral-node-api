
import { Router } from 'express';
import { getById, getAllDependents, getMyDependents, getDependentsByMemberId, createDependent, updateDependent, deleteDependent } from '../services/dependentService';

const router = Router();

/**
 * @openapi
 * /api/Dependent/Dependent_GetById/{id}:
 *   get:
 *     tags:
 *       - Dependents
 *     summary: Get dependent by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: Dependent ID
 *     responses:
 *       200:
 *         description: Dependent details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DependentDto'
 *       404:
 *         description: Dependent not found
 *       500:
 *         description: Error fetching dependent
 */
router.get('/Dependent_GetById/:id', getById);
/**
 * @openapi
 * /api/Dependent/Dependent_GetAllDependents:
 *   get:
 *     tags:
 *       - Dependents
 *     summary: Get all dependents
 *     responses:
 *       200:
 *         description: List of dependents
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DependentDto'
 *       500:
 *         description: Error fetching dependents
 */
router.get('/Dependent_GetAllDependents', getAllDependents);
/**
 * @openapi
 * /api/Dependent/Dependent_GetMyDependents:
 *   get:
 *     tags:
 *       - Dependents
 *     summary: Get current user's dependents
 *     responses:
 *       200:
 *         description: List of dependents
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DependentDto'
 *       500:
 *         description: Error fetching dependents
 */
router.get('/Dependent_GetMyDependents', getMyDependents);
/**
 * @openapi
 * /api/Dependent/Dependent_GetDependentsByMemberId/{memberId}:
 *   get:
 *     tags:
 *       - Dependents
 *     summary: Get dependents by member ID
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
 *         description: List of dependents
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DependentDto'
 *       404:
 *         description: No dependents found
 *       500:
 *         description: Error fetching dependents
 */
router.get('/Dependent_GetDependentsByMemberId/:memberId', getDependentsByMemberId);
/**
 * @openapi
 * /api/Dependent/Dependent_CreateDependent:
 *   post:
 *     tags:
 *       - Dependents
 *     summary: Create a new dependent
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DependentDto'
 *     responses:
 *       201:
 *         description: Dependent created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DependentDto'
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Error creating dependent
 */
router.post('/Dependent_CreateDependent', createDependent);
/**
 * @openapi
 * /api/Dependent/Dependent_UpdateDependent:
 *   put:
 *     tags:
 *       - Dependents
 *     summary: Update a dependent
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DependentDto'
 *     responses:
 *       200:
 *         description: Dependent updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DependentDto'
 *       404:
 *         description: Dependent not found
 *       500:
 *         description: Error updating dependent
 */
router.put('/Dependent_UpdateDependent', updateDependent);
/**
 * @openapi
 * /api/Dependent/Dependent_DeleteDependent/{id}:
 *   delete:
 *     tags:
 *       - Dependents
 *     summary: Delete a dependent
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: Dependent ID
 *     responses:
 *       204:
 *         description: Dependent deleted
 *       404:
 *         description: Dependent not found
 *       500:
 *         description: Error deleting dependent
 */
router.delete('/Dependent_DeleteDependent/:id', deleteDependent);

export default router;
