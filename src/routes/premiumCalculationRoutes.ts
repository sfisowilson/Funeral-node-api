import { Router } from 'express';
import { RequestWithTenant } from '../middleware/tenantMiddleware';
import { Response } from 'express';
import PremiumSetting from '../models/premiumSetting';

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
 *       404:
 *         description: Premium settings not found for tenant
 *       500:
 *         description: Error retrieving settings
 */
router.get('/PremiumCalculation_GetSettings', async (req: RequestWithTenant, res: Response) => {
    try {
        const tenantId = req.tenant?.id;
        
        console.log(`📊 Get premium settings request: tenantId=${tenantId}`);
        
        if (!tenantId) {
            console.log(`❌ No tenant context available`);
            return res.status(400).json({ error: 'Tenant context required. Pass X-Tenant-ID header or use subdomain.' });
        }
        
        const settings = await PremiumSetting.findOne({ 
            where: { tenantId },
            attributes: ['id', 'tenantId', 'minPremium', 'maxPremium', 'defaultCover', 'premiumRates', 'settings', 'createdAt', 'updatedAt']
        });
        
        if (!settings) {
            console.log(`❌ Premium settings not found for tenant: ${tenantId}`);
            return res.status(404).json({ error: 'Premium settings not found for this tenant.' });
        }
        
        console.log(`✅ Premium settings retrieved for tenant: ${tenantId}`);
        res.json(settings);
    } catch (error) {
        console.error('Error getting premium settings:', error);
        res.status(500).json({ error: 'Internal server error', details: (error as any).message });
    }
});

export default router;
