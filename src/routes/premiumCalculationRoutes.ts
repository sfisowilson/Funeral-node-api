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

/**
 * @openapi
 * /api/PremiumCalculation/PremiumCalculation_SaveSettings:
 *   post:
 *     tags:
 *       - Premium Calculation
 *     summary: Save premium calculation settings
 *     description: Save premium settings for the current tenant (requires authentication)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PremiumCalculationSettingsDto'
 *     responses:
 *       200:
 *         description: Premium settings saved successfully
 *       500:
 *         description: Error saving settings
 */
router.post('/PremiumCalculation_SaveSettings', async (req: RequestWithTenant, res: Response) => {
    try {
        const tenantId = req.tenant?.id;
        
        if (!tenantId) {
            return res.status(400).json({ error: 'Tenant context required' });
        }
        
        await premiumCalculationService.savePremiumSettingsAsync(tenantId, req.body);
        res.json({ message: 'Premium settings saved successfully' });
    } catch (error) {
        console.error('Error saving premium settings:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * @openapi
 * /api/PremiumCalculation/PremiumCalculation_Calculate:
 *   post:
 *     tags:
 *       - Premium Calculation
 *     summary: Calculate premium based on request
 *     description: Calculate premium for given cover amount and dependents
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CalculatePremiumRequestDto'
 *     responses:
 *       200:
 *         description: Premium calculated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PremiumCalculationResultDto'
 *       500:
 *         description: Error calculating premium
 */
router.post('/PremiumCalculation_Calculate', async (req: RequestWithTenant, res: Response) => {
    try {
        const tenantId = req.tenant?.id;
        
        if (!tenantId) {
            return res.status(400).json({ error: 'Tenant context required' });
        }
        
        const result = await premiumCalculationService.calculatePremiumAsync(tenantId, req.body);
        res.json(result);
    } catch (error) {
        console.error('Error calculating premium:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * @openapi
 * /api/PremiumCalculation/PremiumCalculation_CalculateForMember/{memberId}:
 *   get:
 *     tags:
 *       - Premium Calculation
 *     summary: Calculate premium for a specific member
 *     description: Calculate premium based on member's policy and dependents
 *     parameters:
 *       - in: path
 *         name: memberId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Member ID
 *     responses:
 *       200:
 *         description: Premium calculated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PremiumCalculationResultDto'
 *       404:
 *         description: Member not found
 *       500:
 *         description: Error calculating premium
 */
router.get('/PremiumCalculation_CalculateForMember/:memberId', async (req: RequestWithTenant, res: Response) => {
    try {
        const tenantId = req.tenant?.id;
        const memberId = req.params.memberId;
        
        if (!tenantId) {
            return res.status(400).json({ error: 'Tenant context required' });
        }
        
        if (!memberId) {
            return res.status(400).json({ error: 'Member ID is required' });
        }
        
        const result = await premiumCalculationService.calculateMemberPremiumAsync(tenantId, memberId);
        res.json(result);
    } catch (error) {
        console.error('Error calculating member premium:', error);
        const message = (error as Error).message;
        if (message.includes('not found')) {
            return res.status(404).json({ error: message });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * @openapi
 * /api/PremiumCalculation/PremiumCalculation_GetMyPremium:
 *   get:
 *     tags:
 *       - Premium Calculation
 *     summary: Get premium for current authenticated user
 *     description: Calculate premium based on current user's policy and dependents
 *     responses:
 *       200:
 *         description: Premium calculated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PremiumCalculationResultDto'
 *       400:
 *         description: Member ID not found in token
 *       404:
 *         description: Member not found
 *       500:
 *         description: Error calculating premium
 */
router.get('/PremiumCalculation_GetMyPremium', async (req: RequestWithTenant, res: Response) => {
    try {
        const tenantId = req.tenant?.id;
        const userId = (req as any).user?.id;
        
        if (!tenantId) {
            return res.status(400).json({ error: 'Tenant context required' });
        }
        
        if (!userId) {
            return res.status(400).json({ error: 'User ID not found in token' });
        }
        
        // Use userId as memberId (same in this system)
        const result = await premiumCalculationService.calculateMemberPremiumAsync(tenantId, userId);
        res.json(result);
    } catch (error) {
        console.error('Error calculating user premium:', error);
        const message = (error as Error).message;
        if (message.includes('not found')) {
            return res.status(404).json({ error: message });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
