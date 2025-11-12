
import { Router } from 'express';
import { getAll, getVisibleByRoles, create, update, deleteWidget, initializeDefaults } from '../services/dashboardWidgetService';

const router = Router();

/**
 * @openapi
 * /api/DashboardWidget/DashboardWidget_GetAll:
 *   get:
 *     tags:
 *       - Dashboard Widgets
 *     summary: Get all dashboard widgets
 *     responses:
 *       200:
 *         description: List of dashboard widgets
 *       500:
 *         description: Error fetching widgets
 */
router.get('/DashboardWidget_GetAll', getAll);
/**
 * @openapi
 * /api/DashboardWidget/DashboardWidget_GetVisibleByRoles:
 *   post:
 *     tags:
 *       - Dashboard Widgets
 *     summary: Get visible widgets by roles
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: List of visible widgets
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Error fetching widgets
 */
router.post('/DashboardWidget_GetVisibleByRoles', getVisibleByRoles);
/**
 * @openapi
 * /api/DashboardWidget/DashboardWidget_Create:
 *   post:
 *     tags:
 *       - Dashboard Widgets
 *     summary: Create a new dashboard widget
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DashboardWidgetDto'
 *     responses:
 *       201:
 *         description: Widget created
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Error creating widget
 */
router.post('/DashboardWidget_Create', create);
/**
 * @openapi
 * /api/DashboardWidget/DashboardWidget_Update:
 *   put:
 *     tags:
 *       - Dashboard Widgets
 *     summary: Update a dashboard widget
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DashboardWidgetDto'
 *     responses:
 *       200:
 *         description: Widget updated
 *       404:
 *         description: Widget not found
 *       500:
 *         description: Error updating widget
 */
router.put('/DashboardWidget_Update', update);
/**
 * @openapi
 * /api/DashboardWidget/DashboardWidget_Delete/{id}:
 *   delete:
 *     tags:
 *       - Dashboard Widgets
 *     summary: Delete a dashboard widget
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: Widget ID
 *     responses:
 *       204:
 *         description: Widget deleted
 *       404:
 *         description: Widget not found
 *       500:
 *         description: Error deleting widget
 */
router.delete('/DashboardWidget_Delete/:id', deleteWidget);
/**
 * @openapi
 * /api/DashboardWidget/DashboardWidget_InitializeDefaults:
 *   post:
 *     tags:
 *       - Dashboard Widgets
 *     summary: Initialize default dashboard widgets for tenant
 *     responses:
 *       201:
 *         description: Defaults initialized
 *       500:
 *         description: Error initializing defaults
 */
router.post('/DashboardWidget_InitializeDefaults', initializeDefaults);

export default router;
