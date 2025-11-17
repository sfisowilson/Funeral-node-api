
import { Router } from 'express';
import { 
  getAll, getById, getByType, getByStatus, getAvailable, create, update, deleteAsset, getStats,
  checkout, checkin, getAllCheckouts, getActiveCheckouts, getOverdueCheckouts, getMyCheckouts,
  getCheckoutsByUser, getCheckoutsByAsset, getCheckoutById, cancelCheckout,
  createInspection, getInspectionsByAsset, getInspectionsByCheckout, getInspectionById,
  scheduleMaintenance, completeMaintenance, getAssetsNeedingMaintenance
} from '../services/assetManagementService';

const router = Router();

// Asset Management Endpoints
/**
 * @openapi
 * /api/AssetManagement/AssetManagement_GetAll:
 *   get:
 *     tags:
 *       - Asset Management
 *     summary: Get all assets
 *     responses:
 *       200:
 *         description: List of assets
 *       500:
 *         description: Error fetching assets
 */
router.get('/AssetManagement_GetAll', getAll);
/**
 * @openapi
 * /api/AssetManagement/AssetManagement_GetById/{id}:
 *   get:
 *     tags:
 *       - Asset Management
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
router.get('/AssetManagement_GetById/:id', getById);
/**
 * @openapi
 * /api/AssetManagement/AssetManagement_GetByType/{assetType}:
 *   get:
 *     tags:
 *       - Asset Management
 *     summary: Get assets by type
 *     parameters:
 *       - in: path
 *         name: assetType
 *         schema:
 *           type: string
 *         required: true
 *         description: Asset type
 *     responses:
 *       200:
 *         description: List of assets
 *       404:
 *         description: No assets found
 *       500:
 *         description: Error fetching assets
 */
router.get('/AssetManagement_GetByType/:assetType', getByType);
/**
 * @openapi
 * /api/AssetManagement/AssetManagement_GetByStatus/{status}:
 *   get:
 *     tags:
 *       - Asset Management
 *     summary: Get assets by status
 *     parameters:
 *       - in: path
 *         name: status
 *         schema:
 *           type: string
 *         required: true
 *         description: Asset status
 *     responses:
 *       200:
 *         description: List of assets
 *       404:
 *         description: No assets found
 *       500:
 *         description: Error fetching assets
 */
router.get('/AssetManagement_GetByStatus/:status', getByStatus);
/**
 * @openapi
 * /api/AssetManagement/AssetManagement_GetAvailable:
 *   get:
 *     tags:
 *       - Asset Management
 *     summary: Get available assets
 *     responses:
 *       200:
 *         description: List of available assets
 *       500:
 *         description: Error fetching assets
 */
router.get('/AssetManagement_GetAvailable', getAvailable);
/**
 * @openapi
 * /api/AssetManagement/AssetManagement_Create:
 *   post:
 *     tags:
 *       - Asset Management
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
router.post('/AssetManagement_Create', create);
/**
 * @openapi
 * /api/AssetManagement/AssetManagement_Update:
 *   put:
 *     tags:
 *       - Asset Management
 *     summary: Update an asset
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
router.put('/AssetManagement_Update', update);
/**
 * @openapi
 * /api/AssetManagement/AssetManagement_Delete/{id}:
 *   delete:
 *     tags:
 *       - Asset Management
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
router.delete('/AssetManagement_Delete/:id', deleteAsset);

/**
 * @openapi
 * /api/AssetManagement/AssetManagement_GetStats:
 *   get:
 *     tags:
 *       - Asset Management
 *     summary: Get asset statistics
 *     responses:
 *       200:
 *         description: Asset statistics
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AssetStatsDto'
 *       500:
 *         description: Error fetching stats
 */
router.get('/AssetManagement_GetStats', getStats);

// Checkout/Checkin Routes
/**
 * @openapi
 * /api/AssetManagement/AssetManagement_Checkout:
 *   post:
 *     tags:
 *       - Asset Management
 *     summary: Checkout an asset
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CheckoutAssetDto'
 *     responses:
 *       200:
 *         description: Asset checked out successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AssetCheckoutDto'
 *       400:
 *         description: Invalid request
 *       500:
 *         description: Error checking out asset
 */
router.post('/AssetManagement_Checkout', checkout);

/**
 * @openapi
 * /api/AssetManagement/AssetManagement_Checkin:
 *   post:
 *     tags:
 *       - Asset Management
 *     summary: Check in an asset
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CheckinAssetDto'
 *     responses:
 *       200:
 *         description: Asset checked in successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AssetCheckoutDto'
 *       400:
 *         description: Invalid request
 *       500:
 *         description: Error checking in asset
 */
router.post('/AssetManagement_Checkin', checkin);
router.get('/AssetManagement_GetAllCheckouts', getAllCheckouts);

/**
 * @openapi
 * /api/AssetManagement/AssetManagement_GetActiveCheckouts:
 *   get:
 *     tags:
 *       - Asset Management
 *     summary: Get active asset checkouts
 *     responses:
 *       200:
 *         description: List of active checkouts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AssetCheckoutDto'
 *       500:
 *         description: Error fetching active checkouts
 */
router.get('/AssetManagement_GetActiveCheckouts', getActiveCheckouts);
router.get('/AssetManagement_GetOverdueCheckouts', getOverdueCheckouts);
router.get('/AssetManagement_GetMyCheckouts', getMyCheckouts);
router.get('/AssetManagement_GetCheckoutsByUser/:userId', getCheckoutsByUser);
router.get('/AssetManagement_GetCheckoutsByAsset/:assetId', getCheckoutsByAsset);
router.get('/AssetManagement_GetCheckoutById/:id', getCheckoutById);
router.post('/AssetManagement_CancelCheckout/:checkoutId', cancelCheckout);

// Inspection Log Routes
router.post('/AssetManagement_CreateInspection/:assetId', createInspection);
router.get('/AssetManagement_GetInspectionsByAsset/:assetId', getInspectionsByAsset);
router.get('/AssetManagement_GetInspectionsByCheckout/:checkoutId', getInspectionsByCheckout);
router.get('/AssetManagement_GetInspectionById/:id', getInspectionById);

// Maintenance Routes
router.post('/AssetManagement_ScheduleMaintenance', scheduleMaintenance);
router.post('/AssetManagement_CompleteMaintenance', completeMaintenance);
router.get('/AssetManagement_GetAssetsNeedingMaintenance', getAssetsNeedingMaintenance);

export default router;
