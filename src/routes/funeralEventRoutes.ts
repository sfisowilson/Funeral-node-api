
import { Router } from 'express';
import { createFuneralEvent, getFuneralEventById, getAllFuneralEvents, updateFuneralEvent, updateFuneralEventStatus, deleteFuneralEvent } from '../services/funeralEventService';

const router = Router();

/**
 * @openapi
 * /api/FuneralEvent/FuneralEvent_CreateFuneralEvent:
 *   post:
 *     tags:
 *       - Funeral Events
 *     summary: Create a new funeral event
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FuneralEventDto'
 *     responses:
 *       201:
 *         description: Funeral event created
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Error creating funeral event
 */
router.post('/FuneralEvent_CreateFuneralEvent', createFuneralEvent);
/**
 * @openapi
 * /api/FuneralEvent/FuneralEvent_GetFuneralEventById/{id}:
 *   get:
 *     tags:
 *       - Funeral Events
 *     summary: Get funeral event by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: Funeral Event ID
 *     responses:
 *       200:
 *         description: Funeral event details
 *       404:
 *         description: Funeral event not found
 *       500:
 *         description: Error fetching funeral event
 */
router.get('/FuneralEvent_GetFuneralEventById/:id', getFuneralEventById);
/**
 * @openapi
 * /api/FuneralEvent/FuneralEvent_GetAllFuneralEvents:
 *   get:
 *     tags:
 *       - Funeral Events
 *     summary: Get all funeral events
 *     responses:
 *       200:
 *         description: List of funeral events
 *       500:
 *         description: Error fetching funeral events
 */
router.get('/FuneralEvent_GetAllFuneralEvents', getAllFuneralEvents);
/**
 * @openapi
 * /api/FuneralEvent/FuneralEvent_UpdateFuneralEvent/{id}:
 *   put:
 *     tags:
 *       - Funeral Events
 *     summary: Update a funeral event
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: Funeral Event ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FuneralEventDto'
 *     responses:
 *       200:
 *         description: Funeral event updated
 *       404:
 *         description: Funeral event not found
 *       500:
 *         description: Error updating funeral event
 */
router.put('/FuneralEvent_UpdateFuneralEvent/:id', updateFuneralEvent);
/**
 * @openapi
 * /api/FuneralEvent/FuneralEvent_UpdateFuneralEventStatus/{id}:
 *   put:
 *     tags:
 *       - Funeral Events
 *     summary: Update funeral event status
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: Funeral Event ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Funeral event status updated
 *       404:
 *         description: Funeral event not found
 *       500:
 *         description: Error updating status
 */
router.put('/FuneralEvent_UpdateFuneralEventStatus/:id', updateFuneralEventStatus);
/**
 * @openapi
 * /api/FuneralEvent/FuneralEvent_DeleteFuneralEvent/{id}:
 *   delete:
 *     tags:
 *       - Funeral Events
 *     summary: Delete a funeral event
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: Funeral Event ID
 *     responses:
 *       204:
 *         description: Funeral event deleted
 *       404:
 *         description: Funeral event not found
 *       500:
 *         description: Error deleting funeral event
 */
router.delete('/FuneralEvent_DeleteFuneralEvent/:id', deleteFuneralEvent);

export default router;
