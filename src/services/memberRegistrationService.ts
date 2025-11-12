
import { Response } from 'express';
import { RequestWithTenant } from '../middleware/tenantMiddleware';
import Member from '../models/member';
import User from '../models/user';
import Policy from '../models/policy';
import Role from '../models/role';
import UserRole from '../models/userRole';
import PolicyEnrollment from '../models/policyEnrollment';
import MemberProfileCompletion from '../models/memberProfileCompletion';

export const checkIdNumber = async (req: RequestWithTenant, res: Response) => {
  try {
    if (!req.tenant) return res.status(400).json({ error: 'Tenant not found' });
    const { idNumber } = req.body;
    if (!idNumber || typeof idNumber !== 'string' || idNumber.length !== 13) {
      return res.status(400).json({ error: 'Invalid ID number' });
    }
    const member = await Member.findOne({ where: { identificationNumber: idNumber, tenantId: req.tenant.id } });
    if (!member) {
      return res.json({ exists: false, isMainMember: false, message: 'ID number not found. You can proceed with new member registration.' });
    }
    const existingUser = await User.findOne({ where: { idNumber, tenantId: req.tenant.id } });
    if (existingUser) {
      return res.json({
        exists: true,
        isMainMember: true,
        hasUserAccount: true,
        memberId: member.id,
        memberName: `${member.firstNames || ''} ${member.surname || ''}`.trim(),
        message: 'This ID number already has a user account. Please login instead.'
      });
    }
    // ID exists as member but no user account - can create account
    return res.json({
      exists: true,
      isMainMember: true,
      hasUserAccount: false,
      memberId: member.id,
  memberName: `${member.firstNames || ''} ${member.surname || ''}`.trim(),
  // contactEmail/contactPhone not available in Member model
      message: "ID number found. We'll send you an OTP to verify your identity and create your account."
    });
  } catch (error) {
    res.status(500).json({ error: 'Error checking ID number' });
  }
};

// Get available policy options for new member registration
export const getPolicyOptions = async (req: RequestWithTenant, res: Response) => {
  try {
    if (!req.tenant) return res.status(400).json({ error: 'Tenant not found' });
    const policies = await Policy.findAll({
      where: { tenantId: req.tenant.id },
      order: [['coverageAmount', 'ASC']]
    });
    const options = policies.map((p: any) => ({
      coverAmount: p.coverageAmount,
      monthlyPremium: p.monthlyPremium,
      description: `R${Number(p.coverageAmount).toLocaleString()} Funeral Cover`,
      isRecommended: Number(p.coverageAmount) === 10000
    }));
    res.json(options);
  } catch (error) {
    res.status(500).json({ error: 'Error getting policy options' });
  }
};

// Step 2a: Register new main member with selected policy
export const registerNewMember = async (req: RequestWithTenant, res: Response) => {
  try {
    if (!req.tenant) return res.status(400).json({ error: 'Tenant not found' });
    const dto = req.body;
    if (!dto.idNumber || typeof dto.idNumber !== 'string' || dto.idNumber.length !== 13) return res.status(400).json({ error: 'Invalid ID number' });
    if (!dto.email || typeof dto.email !== 'string') return res.status(400).json({ error: 'Invalid email' });
    if (!dto.password || typeof dto.password !== 'string' || dto.password.length < 6) return res.status(400).json({ error: 'Invalid password' });
    if (!dto.firstNames || !dto.surname || !dto.phoneNumber || !dto.selectedCoverAmount) return res.status(400).json({ error: 'Missing required fields' });
    if (await Member.findOne({ where: { identificationNumber: dto.idNumber, tenantId: req.tenant.id } })) {
      return res.json({ succeeded: false, message: 'This ID number is already registered.' });
    }
    if (await User.findOne({ where: { email: dto.email } })) {
      return res.json({ succeeded: false, message: 'Email already registered.' });
    }
    let policy = await Policy.findOne({ where: { tenantId: req.tenant.id, status: 'Active' } });
    if (!policy) {
      policy = await Policy.create({
        policyNumber: `POL${Date.now()}`,
        description: `Funeral Cover - R${dto.selectedCoverAmount.toLocaleString()}`,
        payoutAmount: dto.selectedCoverAmount,
        premiumAmount: dto.selectedCoverAmount,
        status: 'Active',
        tenantId: req.tenant.id,
        startDate: new Date()
      });
    }
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const newUser = await User.create({
      email: dto.email,
      firstName: dto.firstNames,
      lastName: dto.surname,
      phoneNumber: dto.phoneNumber,
      idNumber: dto.idNumber,
      passwordHash: hashedPassword,
      tenantId: req.tenant.id,
      isIdVerified: false
    });
    let memberRole = await Role.findOne({ where: { name: 'Member', tenantId: req.tenant.id } });
    if (!memberRole) {
      memberRole = await Role.create({ name: 'Member', tenantId: req.tenant.id });
    }
    await UserRole.create({ userId: newUser.id, roleId: memberRole.id });
    const newMember = await Member.create({
      id: newUser.id,
      firstNames: dto.firstNames,
      surname: dto.surname,
      email: dto.email,
      phone1: dto.phoneNumber,
      identificationNumber: dto.idNumber,
      dateOfBirth: dto.dateOfBirth,
      tenantId: req.tenant.id
    });
    await PolicyEnrollment.create({
      memberId: newMember.id,
      policyId: policy.id,
      enrollmentDate: new Date(),
      tenantId: req.tenant.id
    });
    await MemberProfileCompletion.create({
      memberId: newMember.id,
      tenantId: req.tenant.id,
      hasDependents: false,
      hasBeneficiaries: false,
      hasUploadedIdDocument: false,
      hasUploadedRequiredDocuments: false,
      hasAcceptedTerms: false,
      hasCompletedCustomForms: false,
      isProfileComplete: false,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    res.json({ succeeded: true, message: 'Registration successful! Welcome to the platform.' });
  } catch (error) {
    res.status(500).json({ error: 'Error registering new member' });
  }
};

// Step 2b: Send OTP to existing member (dependent account creation)
interface OtpCache {
  [key: string]: { otpCode: string; expiresAt: number; contactMethod: string; memberId: string; contactValue: string };
}
declare global {
  // eslint-disable-next-line no-var
  var _otpCache: OtpCache | undefined;
}
export const sendDependentOtp = async (req: RequestWithTenant, res: Response) => {
  try {
    if (!req.tenant) return res.status(400).json({ error: 'Tenant not found' });
    const { idNumber, contactMethod } = req.body;
    if (!idNumber || typeof idNumber !== 'string' || idNumber.length !== 13) return res.status(400).json({ error: 'Invalid ID number' });
    if (!contactMethod || !['email', 'sms'].includes(contactMethod)) return res.status(400).json({ error: 'Invalid contact method' });
    const member = await Member.findOne({ where: { identificationNumber: idNumber, tenantId: req.tenant.id } });
    if (!member) return res.status(404).json({ error: 'Member not found with this ID number.' });
    const existingUser = await User.findOne({ where: { idNumber, tenantId: req.tenant.id } });
    if (existingUser) return res.status(400).json({ error: 'This member already has a user account. Please login instead.' });
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 15 * 60 * 1000;
  // No phone1/email fields on Member model; cannot send OTP without contact info
  const contactValue = null;
  if (!contactValue) return res.status(400).json({ error: `No ${contactMethod} address available for this member.` });
    if (!global._otpCache) global._otpCache = {};
    if (global._otpCache) {
      global._otpCache[`OTP_${idNumber}_${req.tenant.id}`] = { otpCode, expiresAt, contactMethod, memberId: member.id, contactValue };
    }
    console.log(`OTP for ${contactMethod} to ${contactValue}: ${otpCode}`);
    res.json({ message: `OTP sent successfully via ${contactMethod}.` });
  } catch (error) {
    res.status(500).json({ error: 'Error sending OTP' });
  }
};

// Step 3: Verify OTP and create user account for dependent
export const verifyOtpAndCreateAccount = async (req: RequestWithTenant, res: Response) => {
  try {
    if (!req.tenant) return res.status(400).json({ error: 'Tenant not found' });
    const dto = req.body;
    if (!dto.idNumber || typeof dto.idNumber !== 'string' || dto.idNumber.length !== 13) return res.status(400).json({ error: 'Invalid ID number' });
    if (!dto.otpCode || typeof dto.otpCode !== 'string' || dto.otpCode.length !== 6) return res.status(400).json({ error: 'Invalid OTP code' });
    if (!dto.email || typeof dto.email !== 'string') return res.status(400).json({ error: 'Invalid email' });
    if (!dto.password || typeof dto.password !== 'string' || dto.password.length < 6) return res.status(400).json({ error: 'Invalid password' });
    const cacheKey = `OTP_${dto.idNumber}_${req.tenant.id}`;
    const otpData = global._otpCache ? global._otpCache[cacheKey] : null;
    if (!otpData) return res.json({ succeeded: false, message: 'OTP not found or has expired.' });
    if (otpData.otpCode !== dto.otpCode) return res.json({ succeeded: false, message: 'Invalid OTP code.' });
    if (Date.now() > otpData.expiresAt) {
      if (global._otpCache) delete global._otpCache[cacheKey];
      return res.json({ succeeded: false, message: 'OTP has expired.' });
    }
    if (await User.findOne({ where: { email: dto.email, tenantId: req.tenant.id } })) {
      return res.json({ succeeded: false, message: 'Email already registered.' });
    }
    const member = await Member.findOne({ where: { identificationNumber: dto.idNumber, tenantId: req.tenant.id } });
    if (!member) return res.json({ succeeded: false, message: 'Member not found.' });
    const existingUser = await User.findOne({ where: { idNumber: dto.idNumber, tenantId: req.tenant.id } });
    if (existingUser) return res.json({ succeeded: false, message: 'User account already exists for this member.' });
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const newUser = await User.create({
      email: dto.email,
      firstName: (member as any).firstNames,
      lastName: (member as any).surname,
      phoneNumber: (member as any).phone1,
      idNumber: dto.idNumber,
      passwordHash: hashedPassword,
      tenantId: req.tenant.id,
      isIdVerified: true,
      idVerifiedAt: new Date()
    });
    let memberRole = await Role.findOne({ where: { name: 'Member', tenantId: req.tenant.id } });
    if (memberRole) {
      await UserRole.create({ userId: newUser.id, roleId: memberRole.id });
    }
  if (global._otpCache) delete global._otpCache[cacheKey];
    res.json({ succeeded: true, message: 'Account created successfully! You can now access your profile.' });
  } catch (error) {
    res.status(500).json({ error: 'Error verifying OTP and creating account' });
  }
};
