
import { Router } from 'express';
import { checkIdNumber, getPolicyOptions, registerNewMember, sendDependentOtp, verifyOtpAndCreateAccount } from '../services/memberRegistrationService';

const router = Router();

/**
 * @openapi
 * /api/MemberRegistration/MemberRegistration_CheckIdNumber:
 *   post:
 *     tags:
 *       - Member Registration
 *     summary: Check if an ID number is valid and not already registered
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idNumber:
 *                 type: string
 *     responses:
 *       200:
 *         description: ID check result
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Error checking ID
 */
router.post('/MemberRegistration_CheckIdNumber', checkIdNumber);
/**
 * @openapi
 * /api/MemberRegistration/MemberRegistration_GetPolicyOptions:
 *   get:
 *     tags:
 *       - Member Registration
 *     summary: Get available policy options for registration
 *     responses:
 *       200:
 *         description: List of policy options
 *       500:
 *         description: Error fetching policy options
 */
router.get('/MemberRegistration_GetPolicyOptions', getPolicyOptions);
/**
 * @openapi
 * /api/MemberRegistration/MemberRegistration_RegisterNewMember:
 *   post:
 *     tags:
 *       - Member Registration
 *     summary: Register a new member
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterNewMemberDto'
 *     responses:
 *       201:
 *         description: Member registered
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Error registering member
 */
router.post('/MemberRegistration_RegisterNewMember', registerNewMember);
/**
 * @openapi
 * /api/MemberRegistration/MemberRegistration_SendDependentOtp:
 *   post:
 *     tags:
 *       - Member Registration
 *     summary: Send OTP to dependent for verification
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dependentId:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP sent
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Error sending OTP
 */
router.post('/MemberRegistration_SendDependentOtp', sendDependentOtp);
/**
 * @openapi
 * /api/MemberRegistration/MemberRegistration_VerifyOtpAndCreateAccount:
 *   post:
 *     tags:
 *       - Member Registration
 *     summary: Verify OTP and create dependent account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dependentId:
 *                 type: string
 *               otp:
 *                 type: string
 *     responses:
 *       201:
 *         description: Dependent account created
 *       400:
 *         description: Invalid input or OTP
 *       500:
 *         description: Error verifying OTP or creating account
 */
router.post('/MemberRegistration_VerifyOtpAndCreateAccount', verifyOtpAndCreateAccount);

export default router;
