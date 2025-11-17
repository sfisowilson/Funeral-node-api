import express from 'express';
import {
  getRequiredDocumentsAsync,
  getMemberDocumentStatusAsync,
  createRequiredDocumentAsync,
  updateRequiredDocumentAsync,
  deleteRequiredDocumentAsync
} from '../services/requiredDocumentService';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

/**
 * @openapi
 * /RequiredDocument/RequiredDocument_GetAll:
 *   get:
 *     summary: Get all required documents
 *     tags: [RequiredDocument]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of required documents
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/RequiredDocumentDto'
 */
router.get('/RequiredDocument_GetAll', authMiddleware, async (req: any, res) => {
  try {
    const tenantId = req.user?.tenantId;
    if (!tenantId) return res.status(401).json({ message: 'Tenant not found' });

    const documents = await getRequiredDocumentsAsync(tenantId);
    res.json(documents);
  } catch (error) {
    console.error('Error getting required documents:', error);
    res.status(500).json({ message: 'Error retrieving required documents' });
  }
});

/**
 * @openapi
 * /RequiredDocument/RequiredDocument_GetMemberStatus/{memberId}:
 *   get:
 *     summary: Get document upload status for a member
 *     tags: [RequiredDocument]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: memberId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Member document status
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MemberDocumentStatusDto'
 */
router.get('/RequiredDocument_GetMemberStatus/:memberId', authMiddleware, async (req: any, res) => {
  try {
    const tenantId = req.user?.tenantId;
    if (!tenantId) return res.status(401).json({ message: 'Tenant not found' });

    const { memberId } = req.params;
    const status = await getMemberDocumentStatusAsync(memberId, tenantId);
    res.json(status);
  } catch (error) {
    console.error('Error getting member document status:', error);
    res.status(500).json({ message: 'Error retrieving member document status' });
  }
});

/**
 * @openapi
 * /RequiredDocument/RequiredDocument_Create:
 *   post:
 *     summary: Create a new required document configuration
 *     tags: [RequiredDocument]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RequiredDocumentDto'
 *     responses:
 *       200:
 *         description: Created document configuration
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RequiredDocumentDto'
 */
router.post('/RequiredDocument_Create', authMiddleware, async (req: any, res) => {
  try {
    const tenantId = req.user?.tenantId;
    const userId = req.user?.userId;
    if (!tenantId) return res.status(401).json({ message: 'Tenant not found' });

    const document = await createRequiredDocumentAsync(req.body, tenantId, userId);
    res.json(document);
  } catch (error) {
    console.error('Error creating required document:', error);
    res.status(500).json({ message: 'Error creating required document' });
  }
});

/**
 * @openapi
 * /RequiredDocument/RequiredDocument_Update:
 *   put:
 *     summary: Update an existing required document configuration
 *     tags: [RequiredDocument]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RequiredDocumentDto'
 *     responses:
 *       200:
 *         description: Update successful
 *         content:
 *           application/json:
 *             schema:
 *               type: boolean
 */
router.put('/RequiredDocument_Update', authMiddleware, async (req: any, res) => {
  try {
    const tenantId = req.user?.tenantId;
    const userId = req.user?.userId;
    if (!tenantId) return res.status(401).json({ message: 'Tenant not found' });

    const success = await updateRequiredDocumentAsync(req.body, tenantId, userId);
    res.json(success);
  } catch (error) {
    console.error('Error updating required document:', error);
    res.status(500).json({ message: 'Error updating required document' });
  }
});

/**
 * @openapi
 * /RequiredDocument/RequiredDocument_Delete/{id}:
 *   delete:
 *     summary: Delete a required document configuration
 *     tags: [RequiredDocument]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Delete successful
 *         content:
 *           application/json:
 *             schema:
 *               type: boolean
 */
router.delete('/RequiredDocument_Delete/:id', authMiddleware, async (req: any, res) => {
  try {
    const tenantId = req.user?.tenantId;
    if (!tenantId) return res.status(401).json({ message: 'Tenant not found' });

    const { id } = req.params;
    const success = await deleteRequiredDocumentAsync(id, tenantId);
    res.json(success);
  } catch (error) {
    console.error('Error deleting required document:', error);
    res.status(500).json({ message: 'Error deleting required document' });
  }
});

export default router;
