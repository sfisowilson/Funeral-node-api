
import { Router } from 'express';
import { registerTenant, register, testIdentity, debugClaims, login, refresh, revoke, forgotPassword, resetPassword, changePassword } from '../services/authService';

const router = Router();

/**
 * @openapi
 * /api/Auth/Auth_RegisterTenant:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Register a new tenant
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Tenant registered successfully
 *       400:
 *         description: Invalid request
 *       500:
 *         description: Internal server error
 */
router.post('/Auth_RegisterTenant', registerTenant);
/**
 * @openapi
 * /api/Auth/Auth_Register:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: User registered successfully
 *       400:
 *         description: Invalid request
 *       500:
 *         description: Internal server error
 */
router.post('/Auth_Register', register);
/**
 * @openapi
 * /api/Auth/Auth_TestIdentity:
 *   get:
 *     tags:
 *       - Auth
 *     summary: Test identity of the current user
 *     responses:
 *       200:
 *         description: Identity test result
 *       401:
 *         description: Unauthorized
 */
router.get('/Auth_TestIdentity', testIdentity);
/**
 * @openapi
 * /api/Auth/Auth_DebugClaims:
 *   get:
 *     tags:
 *       - Auth
 *     summary: Debug claims for the current user
 *     responses:
 *       200:
 *         description: Claims debug info
 *       401:
 *         description: Unauthorized
 */
router.get('/Auth_DebugClaims', debugClaims);
/**
 * @openapi
 * /api/Auth/Auth_Login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Login and obtain JWT token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Login successful, returns JWT
 *       400:
 *         description: Invalid credentials
 *       500:
 *         description: Internal server error
 */
router.post('/Auth_Login', login);
/**
 * @openapi
 * /api/Auth/Auth_Refresh:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Refresh JWT token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Token refreshed
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 */
router.post('/Auth_Refresh', refresh);
/**
 * @openapi
 * /api/Auth/Auth_Revoke:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Revoke JWT token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Token revoked
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 */
router.post('/Auth_Revoke', revoke);
/**
 * @openapi
 * /api/Auth/Auth_ForgotPassword:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Request password reset
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Password reset requested
 *       400:
 *         description: Invalid request
 *       404:
 *         description: User not found
 */
router.post('/Auth_ForgotPassword', forgotPassword);
/**
 * @openapi
 * /api/Auth/Auth_ResetPassword:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Reset user password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Password reset successful
 *       400:
 *         description: Invalid request
 *       404:
 *         description: User not found
 */
router.post('/Auth_ResetPassword', resetPassword);
/**
 * @openapi
 * /api/Auth/Auth_ChangePassword:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Change user password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 */
router.post('/Auth_ChangePassword', changePassword);

export default router;
