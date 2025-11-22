
import { Response } from 'express';
import { RequestWithTenant } from '../middleware/tenantMiddleware';
import Dependent from '../models/dependent';
import Member from '../models/member';

export const getById = async (req: RequestWithTenant, res: Response) => {
  try {
    if (!req.tenant) {
      return res.status(400).json({ error: 'Tenant not found' });
    }
    const { id } = req.params;
    const dependent = await Dependent.findOne({ where: { id, tenantId: req.tenant.id } });
    if (dependent) {
      res.json(dependent);
    } else {
      res.status(404).json({ error: 'Dependent not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error getting dependent' });
  }
};

export const getAllDependents = async (req: RequestWithTenant, res: Response) => {
  try {
    if (!req.tenant) {
      return res.status(400).json({ error: 'Tenant not found' });
    }
    const dependents = await Dependent.findAll({ where: { tenantId: req.tenant.id } });
    res.json(dependents);
  } catch (error) {
    res.status(500).json({ error: 'Error getting dependents' });
  }
};

export const getMyDependents = async (req: RequestWithTenant, res: Response) => {
  try {
    const userId = req.user?.id;
    const tenantId = req.tenant?.id;
    if (!userId || !tenantId) {
      return res.status(401).json({ error: 'Invalid user or tenant context' });
    }

    // Find dependents for this member and tenant
    const dependents = await Dependent.findAll({ where: { memberId: userId, tenantId } });
    return res.json(dependents);
  } catch (error) {
    console.error('Error getting my dependents:', error);
    return res.status(500).json({ message: 'An error occurred while retrieving dependents.' });
  }
};

export const getDependentsByMemberId = async (req: RequestWithTenant, res: Response) => { res.status(501).send('Not Implemented'); };

export const createDependent = async (req: RequestWithTenant, res: Response) => {
  try {
    const { name, email, phone1, phone2, identificationNumber, dependentType, dateOfBirth, memberId } = req.body;
    if (!req.tenant) {
      return res.status(400).json({ error: 'Tenant not found' });
    }

    let memberIdValue: string = memberId;

    const userEmail = req.user?.email;

    if (!memberIdValue) {
      const member = await Member.findOne({ where: { email: userEmail, tenantId: req.tenant.id } });
      if (member) {
        memberIdValue = member?.dataValues?.id;
      }
    }
    


    const dependent = await Dependent.create({ 
      name, 
      email, 
      phone1, 
      phone2, 
      identificationNumber, 
      dependentType, 
      dateOfBirth, 
      memberId : memberIdValue, 
      tenantId: req.tenant.id 
    });
    res.status(201).json(dependent);
  } catch (error) {
    res.status(500).json({ error: 'Error creating dependent', details: (error as any).message });
  }
};

export const updateDependent = async (req: RequestWithTenant, res: Response) => {
  try {
    if (!req.tenant) {
      return res.status(400).json({ error: 'Tenant not found' });
    }
    const { id, name, email, phone1, phone2, identificationNumber, dependentType, dateOfBirth } = req.body;
    
    if (!id) {
      return res.status(400).json({ error: 'Dependent ID is required' });
    }
    
    const [updated] = await Dependent.update(
      { name, email, phone1, phone2, identificationNumber, dependentType, dateOfBirth }, 
      { where: { id, tenantId: req.tenant.id } }
    );
    if (updated) {
      const updatedDependent = await Dependent.findOne({ where: { id, tenantId: req.tenant.id } });
      res.json(updatedDependent);
    } else {
      res.status(404).json({ error: 'Dependent not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error updating dependent', details: (error as any).message });
  }
};

export const deleteDependent = async (req: RequestWithTenant, res: Response) => {
  try {
    if (!req.tenant) {
      return res.status(400).json({ error: 'Tenant not found' });
    }
    const { id } = req.params;
    const deleted = await Dependent.destroy({ where: { id, tenantId: req.tenant.id } });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Dependent not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error deleting dependent' });
  }
};
