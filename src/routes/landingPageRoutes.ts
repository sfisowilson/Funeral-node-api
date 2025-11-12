import { Router } from 'express';
import { getLandingPage, createOrUpdateLandingPage } from '../services/landingPageService';

const router = Router();

/**
 * @openapi
 * /api/LandingPage/LandingPage_GetLandingPage:
 *   get:
 *     tags:
 *       - LandingPage
 *     summary: Get the landing page layout and components for the current tenant (public)
 *     description: Returns the landing page layout and components for the current tenant. No authentication required.
 *     responses:
 *       200:
 *         description: Landing page layout and components
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 layouts:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       sortOrder:
 *                         type: integer
 *                       sectionType:
 *                         type: string
 *                       components:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: integer
 *                             sortOrder:
 *                               type: integer
 *                             componentType:
 *                               type: string
 *                             content:
 *                               type: object
 *                               nullable: true
 *       401:
 *         description: Invalid Tenant
 *       500:
 *         description: Internal server error
 */
router.get('/LandingPage_GetLandingPage', getLandingPage);

/**
 * @openapi
 * /api/LandingPage/LandingPage_CreateOrUpdateLandingPage:
 *   post:
 *     tags:
 *       - LandingPage
 *     summary: Create or update the landing page layout and components for the current tenant
 *     description: Removes all existing layouts and components for the tenant, then creates new ones as specified in the payload. Requires authentication.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               layouts:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     sortOrder:
 *                       type: integer
 *                     sectionType:
 *                       type: string
 *                     components:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           sortOrder:
 *                             type: integer
 *                           componentType:
 *                             type: string
 *                           content:
 *                             type: object
 *                             nullable: true
 *     responses:
 *       200:
 *         description: Landing page created or updated successfully
 *       400:
 *         description: Invalid payload
 *       401:
 *         description: Invalid Tenant
 *       500:
 *         description: Internal server error
 */
router.post('/LandingPage_CreateOrUpdateLandingPage', createOrUpdateLandingPage);

export default router;
