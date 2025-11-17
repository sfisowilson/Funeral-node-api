import { Router, Response } from 'express';
import { RequestWithTenant } from '../middleware/tenantMiddleware';
import { authMiddleware } from '../middleware/authMiddleware';
import * as termsService from '../services/termsService';

const router = Router();

/**
 * @openapi
 * /api/Terms/Terms_GetActive:
 *   get:
 *     tags:
 *       - Terms
 *     summary: Get active terms and conditions (public endpoint)
 *     responses:
 *       200:
 *         description: Active terms retrieved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TermsAndConditionsDto'
 *       404:
 *         description: No active terms found
 *       500:
 *         description: Error retrieving terms
 */
router.get('/Terms_GetActive', async (req: RequestWithTenant, res: Response) => {
  try {
    const tenantId = req.tenant?.id;
    if (!tenantId) return res.status(400).json({ error: 'Tenant context required' });

    const terms = await termsService.getActiveTermsAsync(tenantId);
    
    if (!terms) {
      return res.status(404).json({ message: 'No active terms and conditions found' });
    }

    res.json(terms);
  } catch (error) {
    console.error('Error getting active terms:', error);
    res.status(500).json({ error: 'An error occurred while retrieving terms' });
  }
});

/**
 * @openapi
 * /api/Terms/Terms_GetAll:
 *   get:
 *     tags:
 *       - Terms
 *     summary: Get all terms and conditions
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of terms retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TermsAndConditionsDto'
 *       500:
 *         description: Error retrieving terms
 */
router.get('/Terms_GetAll', authMiddleware, async (req: RequestWithTenant, res: Response) => {
  try {
    const tenantId = req.tenant?.id;
    if (!tenantId) return res.status(400).json({ error: 'Tenant context required' });

    const terms = await termsService.getAllTermsAsync(tenantId);
    res.json(terms);
  } catch (error) {
    console.error('Error getting all terms:', error);
    res.status(500).json({ error: 'An error occurred while retrieving terms' });
  }
});

/**
 * @openapi
 * /api/Terms/Terms_Create:
 *   post:
 *     tags:
 *       - Terms
 *     summary: Create new terms and conditions
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TermsAndConditionsDto'
 *     responses:
 *       200:
 *         description: Terms created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TermsAndConditionsDto'
 *       500:
 *         description: Error creating terms
 */
router.post('/Terms_Create', authMiddleware, async (req: RequestWithTenant, res: Response) => {
  try {
    const tenantId = req.tenant?.id;
    if (!tenantId) return res.status(400).json({ error: 'Tenant context required' });

    const userId = (req as any).user?.id;
    const result = await termsService.createTermsAsync(req.body, tenantId, userId);
    res.json(result);
  } catch (error) {
    console.error('Error creating terms:', error);
    res.status(500).json({ error: 'An error occurred while creating terms' });
  }
});

/**
 * @openapi
 * /api/Terms/Terms_Accept:
 *   post:
 *     tags:
 *       - Terms
 *     summary: Accept terms and conditions
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AcceptTermsDto'
 *     responses:
 *       200:
 *         description: Terms accepted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: boolean
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Error accepting terms
 */
router.post('/Terms_Accept', authMiddleware, async (req: RequestWithTenant, res: Response) => {
  try {
    const tenantId = req.tenant?.id;
    if (!tenantId) return res.status(400).json({ error: 'Tenant context required' });

    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Invalid user token' });
    }

    // Set member ID from authenticated user
    const dto = {
      ...req.body,
      memberId: userId,
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.headers['user-agent']
    };

    const result = await termsService.acceptTermsAsync(dto, tenantId);
    res.json(result);
  } catch (error) {
    console.error('Error accepting terms:', error);
    res.status(500).json({ error: 'An error occurred while accepting terms' });
  }
});

/**
 * @openapi
 * /api/Terms/Terms_HasAcceptedLatest/{memberId}:
 *   get:
 *     tags:
 *       - Terms
 *     summary: Check if member has accepted latest terms
 *     security:
 *       - bearerAuth: []
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
 *         description: Acceptance status
 *         content:
 *           application/json:
 *             schema:
 *               type: boolean
 *       500:
 *         description: Error checking terms acceptance
 */
router.get('/Terms_HasAcceptedLatest/:memberId', authMiddleware, async (req: RequestWithTenant, res: Response) => {
  try {
    const tenantId = req.tenant?.id;
    if (!tenantId) return res.status(400).json({ error: 'Tenant context required' });

    const { memberId } = req.params;
    if (!memberId) return res.status(400).json({ error: 'Member ID is required' });

    const result = await termsService.hasAcceptedLatestTermsAsync(memberId, tenantId);
    res.json(result);
  } catch (error) {
    console.error('Error checking terms acceptance:', error);
    res.status(500).json({ error: 'An error occurred while checking terms acceptance' });
  }
});

/**
 * @openapi
 * /api/Terms/Terms_GetMemberAcceptance/{memberId}:
 *   get:
 *     tags:
 *       - Terms
 *     summary: Get member's terms acceptance record
 *     security:
 *       - bearerAuth: []
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
 *         description: Terms acceptance record
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TermsAcceptanceDto'
 *       404:
 *         description: No acceptance found
 *       500:
 *         description: Error retrieving acceptance
 */
router.get('/Terms_GetMemberAcceptance/:memberId', authMiddleware, async (req: RequestWithTenant, res: Response) => {
  try {
    const tenantId = req.tenant?.id;
    if (!tenantId) return res.status(400).json({ error: 'Tenant context required' });

    const { memberId } = req.params;
    if (!memberId) return res.status(400).json({ error: 'Member ID is required' });

    const result = await termsService.getMemberTermsAcceptanceAsync(memberId, tenantId);
    
    if (!result) {
      return res.status(404).json({ message: 'No terms acceptance found for member' });
    }

    res.json(result);
  } catch (error) {
    console.error('Error getting terms acceptance:', error);
    res.status(500).json({ error: 'An error occurred while retrieving terms acceptance' });
  }
});

export default router;
