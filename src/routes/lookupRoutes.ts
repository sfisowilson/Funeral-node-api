
import { Router } from 'express';
import { getEnumValues } from '../services/lookupService';

const router = Router();

/**
 * @openapi
 * /api/Lookup/GetEnumValues/{enumTypeName}:
 *   get:
 *     tags:
 *       - Lookup
 *     summary: Get enum values by type name
 *     parameters:
 *       - in: path
 *         name: enumTypeName
 *         required: true
 *         schema:
 *           type: string
 *         description: Name of the enum type
 *     responses:
 *       200:
 *         description: Enum values
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *       404:
 *         description: Enum type not found
 */
router.get('/GetEnumValues/:enumTypeName', getEnumValues);

export default router;
