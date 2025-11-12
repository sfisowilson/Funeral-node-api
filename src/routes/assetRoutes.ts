
import { Router } from 'express';
import { 
  createAsset, getAssets, getAssetById, updateAsset, deleteAsset
} from '../services/assetService';

const router = Router();

/**
 * @openapi
 * /api/Asset/Asset_CreateAsset:
 *   post:
 *     tags:
 *       - Assets
 *     summary: Create a new asset
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AssetDto'
 *     responses:
 *       201:
 *         description: Asset created
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Error creating asset
 */
router.post('/Asset_CreateAsset', createAsset);
/**
 * @openapi
 * /api/Asset/Asset_GetAllAssets:
 *   get:
 *     tags:
 *       - Assets
 *     summary: Get all assets
 *     responses:
 *       200:
 *         description: List of assets
 *       500:
 *         description: Error fetching assets
 */
router.get('/Asset_GetAllAssets', getAssets);
/**
 * @openapi
 * /api/Asset/Asset_GetAssetById/{id}:
 *   get:
 *     tags:
 *       - Assets
 *     summary: Get asset by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: Asset ID
 *     responses:
 *       200:
 *         description: Asset details
 *       404:
 *         description: Asset not found
 *       500:
 *         description: Error fetching asset
 */
router.get('/Asset_GetAssetById/:id', getAssetById);
/**
 * @openapi
 * /api/Asset/Asset_UpdateAsset/{id}:
 *   put:
 *     tags:
 *       - Assets
 *     summary: Update an asset
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: Asset ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AssetDto'
 *     responses:
 *       200:
 *         description: Asset updated
 *       404:
 *         description: Asset not found
 *       500:
 *         description: Error updating asset
 */
router.put('/Asset_UpdateAsset/:id', updateAsset);
/**
 * @openapi
 * /api/Asset/Asset_DeleteAsset/{id}:
 *   delete:
 *     tags:
 *       - Assets
 *     summary: Delete an asset
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: Asset ID
 *     responses:
 *       204:
 *         description: Asset deleted
 *       404:
 *         description: Asset not found
 *       500:
 *         description: Error deleting asset
 */
router.delete('/Asset_DeleteAsset/:id', deleteAsset);

export default router;
