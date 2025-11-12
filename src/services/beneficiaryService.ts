
import { Response } from 'express';
import { RequestWithTenant } from '../middleware/tenantMiddleware';
import Beneficiary from '../models/beneficiary';

export const getById = async (req: RequestWithTenant, res: Response) => {
  try {
    if (!req.tenant) {
      return res.status(400).json({ error: 'Tenant not found' });
    }
    const { id } = req.params;
    const beneficiary = await Beneficiary.findOne({ where: { id, tenantId: req.tenant.id } });
    if (beneficiary) {
      res.json(beneficiary);
    } else {
      res.status(404).json({ error: 'Beneficiary not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error getting beneficiary' });
  }
};

export const getAllBeneficiaries = async (req: RequestWithTenant, res: Response) => {
  try {
    if (!req.tenant) {
      return res.status(400).json({ error: 'Tenant not found' });
    }
    const beneficiaries = await Beneficiary.findAll({ where: { tenantId: req.tenant.id } });
    res.json(beneficiaries);
  } catch (error) {
    res.status(500).json({ error: 'Error getting beneficiaries' });
  }
};

export const getMyBeneficiaries = async (req: RequestWithTenant, res: Response) => { res.status(501).send('Not Implemented'); };

export const getBeneficiariesByMemberId = async (req: RequestWithTenant, res: Response) => { res.status(501).send('Not Implemented'); };

export const createBeneficiary = async (req: RequestWithTenant, res: Response) => {
  try {
    const { name, email, address, phone1, phone2, identificationNumber, relationship, benefitPercentage, memberId } = req.body;
    if (!req.tenant) {
      return res.status(400).json({ error: 'Tenant not found' });
    }
    const beneficiary = await Beneficiary.create({ 
      name, 
      email, 
      address, 
      phone1, 
      phone2, 
      identificationNumber, 
      relationship, 
      benefitPercentage, 
      memberId, 
      tenantId: req.tenant.id 
    });
    res.status(201).json(beneficiary);
  } catch (error) {
    res.status(500).json({ error: 'Error creating beneficiary', details: (error as any).message });
  }
};

export const updateBeneficiary = async (req: RequestWithTenant, res: Response) => {
  try {
    if (!req.tenant) {
      return res.status(400).json({ error: 'Tenant not found' });
    }
    const { id } = req.params;
    const { name, email, address, phone1, phone2, identificationNumber, relationship, benefitPercentage, isVerified } = req.body;
    const [updated] = await Beneficiary.update(
      { name, email, address, phone1, phone2, identificationNumber, relationship, benefitPercentage, isVerified }, 
      { where: { id, tenantId: req.tenant.id } }
    );
    if (updated) {
      const updatedBeneficiary = await Beneficiary.findOne({ where: { id, tenantId: req.tenant.id } });
      res.json(updatedBeneficiary);
    } else {
      res.status(404).json({ error: 'Beneficiary not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error updating beneficiary', details: (error as any).message });
  }
};

export const deleteBeneficiary = async (req: RequestWithTenant, res: Response) => {
  try {
    if (!req.tenant) {
      return res.status(400).json({ error: 'Tenant not found' });
    }
    const { id } = req.params;
    const deleted = await Beneficiary.destroy({ where: { id, tenantId: req.tenant.id } });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Beneficiary not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error deleting beneficiary' });
  }
};
