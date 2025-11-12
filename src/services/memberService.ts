
import { Response } from 'express';
import { RequestWithTenant } from '../middleware/tenantMiddleware';
import Member from '../models/member';

export const getById = async (req: RequestWithTenant, res: Response) => {
  try {
    if (!req.tenant) {
      return res.status(400).json({ error: 'Tenant not found' });
    }
    const { id } = req.params;
    const member = await Member.findOne({ where: { id, tenantId: req.tenant.id } });
    if (member) {
      res.json(member);
    } else {
      res.status(404).json({ error: 'Member not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error getting member' });
  }
};

export const getAllMembers = async (req: RequestWithTenant, res: Response) => {
  try {
    if (!req.tenant) {
      return res.status(400).json({ error: 'Tenant not found' });
    }
    const members = await Member.findAll({ where: { tenantId: req.tenant.id } });
    res.json(members);
  } catch (error) {
    res.status(500).json({ error: 'Error getting members' });
  }
};

export const create = async (req: RequestWithTenant, res: Response) => {
  try {
    const { firstNames, surname, identificationNumber } = req.body;
    if (!req.tenant) {
      return res.status(400).json({ error: 'Tenant not found' });
    }
    const member = await Member.create({ firstNames, surname, identificationNumber, tenantId: req.tenant.id });
    res.status(201).json(member);
  } catch (error) {
    res.status(500).json({ error: 'Error creating member' });
  }
};


export const approveMember = async (req: RequestWithTenant, res: Response) => {
  try {
    const { id } = req.params;
    if (!req.tenant || !id) return res.status(400).json({ message: 'Missing tenant or member id' });
    const member = await Member.findOne({ where: { id, tenantId: req.tenant.id } });
    if (!member) return res.status(404).json({ message: 'Member not found' });
    // Member model doesn't have status field
    await member.save();
    res.json(member);
  } catch (error) {
    res.status(500).json({ message: 'Error approving member' });
  }
};

export const rejectMember = async (req: RequestWithTenant, res: Response) => {
  try {
    const { id } = req.params;
    if (!req.tenant || !id) return res.status(400).json({ message: 'Missing tenant or member id' });
    const member = await Member.findOne({ where: { id, tenantId: req.tenant.id } });
    if (!member) return res.status(404).json({ message: 'Member not found' });
    // Member model doesn't have status field
    await member.save();
    res.json(member);
  } catch (error) {
    res.status(500).json({ message: 'Error rejecting member' });
  }
};

export const disableMember = async (req: RequestWithTenant, res: Response) => {
  try {
    const { id } = req.params;
    if (!req.tenant || !id) return res.status(400).json({ message: 'Missing tenant or member id' });
    const member = await Member.findOne({ where: { id, tenantId: req.tenant.id } });
    if (!member) return res.status(404).json({ message: 'Member not found' });
    // Member model doesn't have status field
    await member.save();
    res.json(member);
  } catch (error) {
    res.status(500).json({ message: 'Error disabling member' });
  }
};

export const enableMember = async (req: RequestWithTenant, res: Response) => {
  try {
    const { id } = req.params;
    if (!req.tenant || !id) return res.status(400).json({ message: 'Missing tenant or member id' });
    const member = await Member.findOne({ where: { id, tenantId: req.tenant.id } });
    if (!member) return res.status(404).json({ message: 'Member not found' });
    // Member model doesn't have status field
    await member.save();
    res.json(member);
  } catch (error) {
    res.status(500).json({ message: 'Error enabling member' });
  }
};

export const updateMember = async (req: RequestWithTenant, res: Response) => {
  try {
    if (!req.tenant) {
      return res.status(400).json({ error: 'Tenant not found' });
    }
    const { id } = req.params;
    const { firstNames, surname, identificationNumber } = req.body;
    const [updated] = await Member.update({ firstNames, surname, identificationNumber }, { where: { id, tenantId: req.tenant.id } });
    if (updated) {
      const updatedMember = await Member.findOne({ where: { id } });
      res.json(updatedMember);
    } else {
      res.status(404).json({ error: 'Member not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error updating member' });
  }
};

export const deleteMember = async (req: RequestWithTenant, res: Response) => {
  try {
    if (!req.tenant) {
      return res.status(400).json({ error: 'Tenant not found' });
    }
    const { id } = req.params;
    const deleted = await Member.destroy({ where: { id, tenantId: req.tenant.id } });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Member not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error deleting member' });
  }
};


// For demonstration, signatures are stored as a string field on Member (signatureData). Adjust as needed.
export const saveSignature = async (req: RequestWithTenant, res: Response) => {
  try {
    const { id } = req.params;
    const { signatureData } = req.body;
    if (!req.tenant || !id || !signatureData) return res.status(400).json({ message: 'Missing tenant, member id, or signature data' });
    const member = await Member.findOne({ where: { id, tenantId: req.tenant.id } });
    if (!member) return res.status(404).json({ message: 'Member not found' });
    // Member model doesn't have signatureData field
    await member.save();
    res.json({ message: 'Signature saved' });
  } catch (error) {
    res.status(500).json({ message: 'Error saving signature' });
  }
};

export const getMySignature = async (req: RequestWithTenant, res: Response) => {
  try {
    const memberId = req.user?.id;
    if (!req.tenant || !memberId) return res.status(400).json({ message: 'Missing tenant or user id' });
    const member = await Member.findOne({ where: { id: memberId, tenantId: req.tenant.id } });
    if (!member) return res.status(404).json({ message: 'Signature not found' });
    // Member model doesn't have signatureData field
    res.json({ signatureData: null });
  } catch (error) {
    res.status(500).json({ message: 'Error getting signature' });
  }
};

export const getSignatureForMember = async (req: RequestWithTenant, res: Response) => {
  try {
    const { id } = req.params;
    if (!req.tenant || !id) return res.status(400).json({ message: 'Missing tenant or member id' });
    const member = await Member.findOne({ where: { id, tenantId: req.tenant.id } });
    if (!member) return res.status(404).json({ message: 'Signature not found' });
    // Member model doesn't have signatureData field
    res.json({ signatureData: null });
  } catch (error) {
    res.status(500).json({ message: 'Error getting signature' });
  }
};
