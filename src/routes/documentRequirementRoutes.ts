
import { Router, Response } from 'express';
import { RequestWithTenant } from '../middleware/tenantMiddleware';
import { documentRequirementService } from '../services/documentRequirementService';

const getRequiredDocuments = async (req: RequestWithTenant, res: Response) => {
  try {
    const { memberId } = req.params as { memberId: string };
    const tenantId = req.tenant?.id as string;

    const requirements = await documentRequirementService.getRequiredDocumentsForMemberAsync(
      memberId,
      tenantId
    );

    res.json({
      memberId,
      requirements,
      message: 'Required documents retrieved successfully',
    });
  } catch (error) {
    console.error('Error retrieving required documents:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: (error as any).message,
    });
  }
};

const getComplianceStatus = async (req: RequestWithTenant, res: Response) => {
  try {
    const { memberId } = req.params as { memberId: string };
    const tenantId = req.tenant?.id as string;

    const status = await documentRequirementService.checkMemberDocumentComplianceAsync(
      memberId,
      tenantId
    );

    res.json({
      memberId,
      ...status,
    });
  } catch (error) {
    console.error('Error checking compliance status:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: (error as any).message,
    });
  }
};

const getMissingDocuments = async (req: RequestWithTenant, res: Response) => {
  try {
    const { memberId } = req.params as { memberId: string };
    const tenantId = req.tenant?.id as string;

    const missingDocuments = await documentRequirementService.getMissingDocumentsAsync(
      memberId,
      tenantId
    );

    res.json({
      memberId,
      missingDocuments,
      count: missingDocuments.length,
    });
  } catch (error) {
    console.error('Error getting missing documents:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: (error as any).message,
    });
  }
};

const router = Router();

/**
 * @openapi
 * /api/DocumentRequirement/DocumentRequirement_GetRequiredDocuments/{memberId}:
 *   get:
 *     tags:
 *       - Document Requirements
 *     summary: Get required documents for a member
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
 *         description: List of required documents
 *       404:
 *         description: No documents found
 *       500:
 *         description: Error fetching documents
 */
router.get('/DocumentRequirement_GetRequiredDocuments/:memberId', getRequiredDocuments);
/**
 * @openapi
 * /api/DocumentRequirement/DocumentRequirement_GetComplianceStatus/{memberId}:
 *   get:
 *     tags:
 *       - Document Requirements
 *     summary: Get compliance status for a member
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
 *         description: Compliance status
 *       404:
 *         description: Member not found
 *       500:
 *         description: Error fetching compliance status
 */
router.get('/DocumentRequirement_GetComplianceStatus/:memberId', getComplianceStatus);
/**
 * @openapi
 * /api/DocumentRequirement/DocumentRequirement_GetMissingDocuments/{memberId}:
 *   get:
 *     tags:
 *       - Document Requirements
 *     summary: Get missing documents for a member
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
 *         description: List of missing documents
 *       404:
 *         description: No documents found
 *       500:
 *         description: Error fetching missing documents
 */
router.get('/DocumentRequirement_GetMissingDocuments/:memberId', getMissingDocuments);

export default router;
