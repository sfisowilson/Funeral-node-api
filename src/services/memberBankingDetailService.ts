
import { Response } from 'express';
import { RequestWithTenant } from '../middleware/tenantMiddleware';

import MemberBankingDetail from '../models/memberBankingDetail';
import { Op } from 'sequelize';

// GET: MemberBankingDetail_GetMyBankingDetails
export const getMyBankingDetails = async (req: RequestWithTenant, res: Response) => {
  try {
    const memberId = req.user?.id;
    const tenantId = req.tenant?.id;
    if (!memberId || !tenantId) {
      return res.status(401).json({ message: 'Invalid or missing user/tenant' });
    }
    const bankingDetail = await MemberBankingDetail.findOne({
      where: {
        memberId,
        tenantId
      }
    });
    if (!bankingDetail) {
      return res.status(404).json({ message: 'Banking details not found for this member' });
    }
    res.json(bankingDetail);
  } catch (error) {
    console.error('Error retrieving banking details:', error);
    res.status(500).json({ message: 'An error occurred while retrieving banking details' });
  }
};

// GET: MemberBankingDetail_GetBankingDetailsByMemberId
export const getBankingDetailsByMemberId = async (req: RequestWithTenant, res: Response) => {
  try {
    const { memberId } = req.params;
    const tenantId = req.tenant?.id;
    if (!memberId || !tenantId) {
      return res.status(400).json({ message: 'Missing memberId or tenantId' });
    }
    const bankingDetail = await MemberBankingDetail.findOne({
      where: {
        memberId,
        tenantId
      }
    });
    if (!bankingDetail) {
      return res.status(404).json({ message: 'Banking details not found for this member' });
    }
    res.json(bankingDetail);
  } catch (error) {
    console.error('Error retrieving banking details by memberId:', error);
    res.status(500).json({ message: 'An error occurred while retrieving banking details' });
  }
};

// GET: MemberBankingDetail_HasBankingDetails
export const hasBankingDetails = async (req: RequestWithTenant, res: Response) => {
  try {
    const { memberId } = req.params;
    const tenantId = req.tenant?.id;
    if (!memberId || !tenantId) {
      return res.status(400).json({ message: 'Missing memberId or tenantId' });
    }
    const exists = await MemberBankingDetail.findOne({
      where: {
        memberId,
        tenantId
      }
    });
    res.json({ hasBankingDetails: !!exists });
  } catch (error) {
    console.error('Error checking banking details existence:', error);
    res.status(500).json({ message: 'An error occurred while checking banking details' });
  }
};

export const createBankingDetails = async (req: RequestWithTenant, res: Response) => {
  try {
    const {
      bankName,
      accountNumber,
      accountType,
      branchCode,
      branchName,
      accountHolderName,
      debitDay,
      paymentMethod,
      memberId,
    } = req.body;

    if (!req.tenant) {
      return res.status(400).json({ error: 'Tenant not found' });
    }

    const memberBankingDetail = await MemberBankingDetail.create({
      bankName,
      accountNumber,
      accountType,
      branchCode,
      branchName,
      accountHolderName,
      debitDay,
      paymentMethod,
      memberId,
      tenantId: req.tenant.id,
    });

    res.status(201).json(memberBankingDetail);
  } catch (error) {
    res.status(500).json({ error: 'Error creating member banking detail', details: (error as any).message });
  }
};

export const updateBankingDetails = async (req: RequestWithTenant, res: Response) => {
  try {
    if (!req.tenant) {
      return res.status(400).json({ error: 'Tenant not found' });
    }
    const { id } = req.params;
    const {
      bankName,
      accountNumber,
      accountType,
      branchCode,
      branchName,
      accountHolderName,
      debitDay,
      paymentMethod,
      isVerified,
    } = req.body;

    const [updated] = await MemberBankingDetail.update(
      {
        bankName,
        accountNumber,
        accountType,
        branchCode,
        branchName,
        accountHolderName,
        debitDay,
        paymentMethod,
        isVerified,
      },
      { where: { id, tenantId: req.tenant.id } }
    );

    if (updated) {
      const updatedMemberBankingDetail = await MemberBankingDetail.findOne({ where: { id, tenantId: req.tenant.id } });
      res.json(updatedMemberBankingDetail);
    } else {
      res.status(404).json({ error: 'Member banking detail not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error updating member banking detail', details: (error as any).message });
  }
};

export const deleteBankingDetails = async (req: RequestWithTenant, res: Response) => {
  try {
    if (!req.tenant) {
      return res.status(400).json({ error: 'Tenant not found' });
    }
    const { id } = req.params;
    const deleted = await MemberBankingDetail.destroy({ where: { id, tenantId: req.tenant.id } });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Member banking detail not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error deleting member banking detail' });
  }
};
