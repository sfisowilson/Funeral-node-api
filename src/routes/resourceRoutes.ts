
import { Router } from 'express';
import { createResource, getResourceById, getAllResources, updateResource, deleteResource, bookResource, cancelResourceBooking, getResourceBookings } from '../services/resourceService';

const router = Router();

/**
 * @openapi
 * /api/Resource/Resource_CreateResource:
 *   post:
 *     tags:
 *       - Resources
 *     summary: Create a new resource
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResourceDto'
 *     responses:
 *       201:
 *         description: Resource created
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Error creating resource
 */
router.post('/Resource_CreateResource', createResource);
/**
 * @openapi
 * /api/Resource/Resource_GetResourceById/{id}:
 *   get:
 *     tags:
 *       - Resources
 *     summary: Get resource by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: Resource ID
 *     responses:
 *       200:
 *         description: Resource details
 *       404:
 *         description: Resource not found
 *       500:
 *         description: Error fetching resource
 */
router.get('/Resource_GetResourceById/:id', getResourceById);
/**
 * @openapi
 * /api/Resource/Resource_GetAllResources:
 *   get:
 *     tags:
 *       - Resources
 *     summary: Get all resources
 *     responses:
 *       200:
 *         description: List of resources
 *       500:
 *         description: Error fetching resources
 */
router.get('/Resource_GetAllResources', getAllResources);
/**
 * @openapi
 * /api/Resource/Resource_UpdateResource/{id}:
 *   put:
 *     tags:
 *       - Resources
 *     summary: Update a resource
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: Resource ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResourceDto'
 *     responses:
 *       200:
 *         description: Resource updated
 *       404:
 *         description: Resource not found
 *       500:
 *         description: Error updating resource
 */
router.put('/Resource_UpdateResource/:id', updateResource);
/**
 * @openapi
 * /api/Resource/Resource_DeleteResource/{id}:
 *   delete:
 *     tags:
 *       - Resources
 *     summary: Delete a resource
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: Resource ID
 *     responses:
 *       204:
 *         description: Resource deleted
 *       404:
 *         description: Resource not found
 *       500:
 *         description: Error deleting resource
 */
router.delete('/Resource_DeleteResource/:id', deleteResource);
/**
 * @openapi
 * /api/Resource/Resource_BookResource:
 *   post:
 *     tags:
 *       - Resources
 *     summary: Book a resource
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Resource booked
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Error booking resource
 */
router.post('/Resource_BookResource', bookResource);
/**
 * @openapi
 * /api/Resource/Resource_CancelResourceBooking/{id}:
 *   delete:
 *     tags:
 *       - Resources
 *     summary: Cancel a resource booking
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: Booking ID
 *     responses:
 *       204:
 *         description: Booking cancelled
 *       404:
 *         description: Booking not found
 *       500:
 *         description: Error cancelling booking
 */
router.delete('/Resource_CancelResourceBooking/:id', cancelResourceBooking);
/**
 * @openapi
 * /api/Resource/Resource_GetResourceBookings/{funeralEventId}:
 *   get:
 *     tags:
 *       - Resources
 *     summary: Get resource bookings for a funeral event
 *     parameters:
 *       - in: path
 *         name: funeralEventId
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: Funeral Event ID
 *     responses:
 *       200:
 *         description: List of bookings
 *       404:
 *         description: No bookings found
 *       500:
 *         description: Error fetching bookings
 */
router.get('/Resource_GetResourceBookings/:funeralEventId', getResourceBookings);

export default router;
