/**
 * @openapi
 * components:
 *   schemas:
 *     AssetDto:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         assetType:
 *           type: string
 *         purchaseDate:
 *           type: string
 *           format: date-time
 *         purchasePrice:
 *           type: number
 *         currentValue:
 *           type: number
 *         location:
 *           type: string
 *         serialNumber:
 *           type: string
 *         status:
 *           type: string
 *         tenantId:
 *           type: string
 *           format: uuid
 */
export {};
