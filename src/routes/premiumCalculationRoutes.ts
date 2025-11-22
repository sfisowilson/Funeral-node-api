import { Router, Request, Response } from 'express';
import { RequestWithTenant } from '../middleware/tenantMiddleware';
import { premiumCalculationService } from '../services/premiumCalculationService';

const router = Router();

/**
 * @openapi
 * /api/PremiumCalculation/PremiumCalculation_GetSettings:
 *   get:
 *     tags:
 *       - Premium Calculation
 *     summary: Get premium calculation settings (public endpoint)
 *     description: Get premium settings for the current tenant. No authentication required - accessible from landing pages.
 *     responses:
 *       200:
 *         description: Premium settings retrieved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PremiumCalculationSettingsDto'
 *       404:
 *         description: Premium settings not found for tenant
 *       500:
 *         description: Error retrieving settings
 */
router.get('/PremiumCalculation_GetSettings', async (req: RequestWithTenant, res: Response) => {
    try {
        const tenantId = req.tenant?.id;
        
        if (!tenantId) {
            return res.status(400).json({ error: 'Tenant context required. Pass X-Tenant-ID header or use subdomain.' });
        }
        
        const settings = await premiumCalculationService.getPremiumSettingsAsync(tenantId);
        res.json(settings);
    } catch (error) {
        console.error('Error getting premium settings:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
