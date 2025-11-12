
import { Response } from 'express';
import { RequestWithTenant } from '../middleware/tenantMiddleware';
import FuneralEvent from '../models/funeralEvent';

export const createFuneralEvent = async (req: RequestWithTenant, res: Response) => {
  try {
    const { eventDate, location } = req.body;
    if (!req.tenant) {
      return res.status(400).json({ error: 'Tenant not found' });
    }
    const funeralEvent = await FuneralEvent.create({ eventDate, location, tenantId: req.tenant.id });
    res.status(201).json(funeralEvent);
  } catch (error) {
    res.status(500).json({ error: 'Error creating funeral event' });
  }
};

export const getFuneralEventById = async (req: RequestWithTenant, res: Response) => {
  try {
    if (!req.tenant) {
      return res.status(400).json({ error: 'Tenant not found' });
    }
    const { id } = req.params;
    const funeralEvent = await FuneralEvent.findOne({ where: { id, tenantId: req.tenant.id } });
    if (funeralEvent) {
      res.json(funeralEvent);
    } else {
      res.status(404).json({ error: 'Funeral event not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error getting funeral event' });
  }
};

export const getAllFuneralEvents = async (req: RequestWithTenant, res: Response) => {
  try {
    if (!req.tenant) {
      return res.status(400).json({ error: 'Tenant not found' });
    }
    const funeralEvents = await FuneralEvent.findAll({ where: { tenantId: req.tenant.id } });
    res.json(funeralEvents);
  } catch (error) {
    res.status(500).json({ error: 'Error getting funeral events' });
  }
};

export const updateFuneralEvent = async (req: RequestWithTenant, res: Response) => {
  try {
    if (!req.tenant) {
      return res.status(400).json({ error: 'Tenant not found' });
    }
    const { id } = req.params;
    const { eventDate, location } = req.body;
    const [updated] = await FuneralEvent.update({ eventDate, location }, { where: { id, tenantId: req.tenant.id } });
    if (updated) {
      const updatedFuneralEvent = await FuneralEvent.findOne({ where: { id } });
      res.json(updatedFuneralEvent);
    } else {
      res.status(404).json({ error: 'Funeral event not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error updating funeral event' });
  }
};

export const updateFuneralEventStatus = async (req: RequestWithTenant, res: Response) => { res.status(501).send('Not Implemented'); };

export const deleteFuneralEvent = async (req: RequestWithTenant, res: Response) => {
  try {
    if (!req.tenant) {
      return res.status(400).json({ error: 'Tenant not found' });
    }
    const { id } = req.params;
    const deleted = await FuneralEvent.destroy({ where: { id, tenantId: req.tenant.id } });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Funeral event not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error deleting funeral event' });
  }
};
