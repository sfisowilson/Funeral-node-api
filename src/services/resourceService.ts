
import { Response } from 'express';
import { RequestWithTenant } from '../middleware/tenantMiddleware';
import Resource from '../models/resource';

export const createResource = async (req: RequestWithTenant, res: Response) => {
  try {
    const { name, description } = req.body;
    if (!req.tenant) {
      return res.status(400).json({ error: 'Tenant not found' });
    }
    const resource = await Resource.create({ name, description, tenantId: req.tenant.id });
    res.status(201).json(resource);
  } catch (error) {
    res.status(500).json({ error: 'Error creating resource' });
  }
};

export const getResourceById = async (req: RequestWithTenant, res: Response) => {
  try {
    if (!req.tenant) {
      return res.status(400).json({ error: 'Tenant not found' });
    }
    const { id } = req.params;
    const resource = await Resource.findOne({ where: { id, tenantId: req.tenant.id } });
    if (resource) {
      res.json(resource);
    } else {
      res.status(404).json({ error: 'Resource not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error getting resource' });
  }
};

export const getAllResources = async (req: RequestWithTenant, res: Response) => {
  try {
    if (!req.tenant) {
      return res.status(400).json({ error: 'Tenant not found' });
    }
    const resources = await Resource.findAll({ where: { tenantId: req.tenant.id } });
    res.json(resources);
  } catch (error) {
    res.status(500).json({ error: 'Error getting resources' });
  }
};

export const updateResource = async (req: RequestWithTenant, res: Response) => {
  try {
    if (!req.tenant) {
      return res.status(400).json({ error: 'Tenant not found' });
    }
    const { id } = req.params;
    const { name, description } = req.body;
    const [updated] = await Resource.update({ name, description }, { where: { id, tenantId: req.tenant.id } });
    if (updated) {
      const updatedResource = await Resource.findOne({ where: { id } });
      res.json(updatedResource);
    } else {
      res.status(404).json({ error: 'Resource not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error updating resource' });
  }
};

export const deleteResource = async (req: RequestWithTenant, res: Response) => {
  try {
    if (!req.tenant) {
      return res.status(400).json({ error: 'Tenant not found' });
    }
    const { id } = req.params;
    const deleted = await Resource.destroy({ where: { id, tenantId: req.tenant.id } });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Resource not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error deleting resource' });
  }
};


import ResourceBooking from '../models/resourceBooking';
import { Op } from 'sequelize';

// POST: BookResource
export const bookResource = async (req: RequestWithTenant, res: Response) => {
  try {
    const tenantId = req.tenant?.id;
    const { resourceId, startTime, endTime } = req.body;
    if (!tenantId || !resourceId || !startTime || !endTime) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    // Check if resource is available for the requested time
    const overlapping = await ResourceBooking.findOne({
      where: {
        resourceId,
        tenantId,
        [Op.or]: [
          {
            startTime: { [Op.between]: [startTime, endTime] }
          },
          {
            endTime: { [Op.between]: [startTime, endTime] }
          },
          {
            startTime: { [Op.lte]: startTime }, endTime: { [Op.gte]: endTime }
          }
        ]
      }
    });
    if (overlapping) {
      return res.status(409).json({ message: 'Resource is already booked for the selected time' });
    }
    const booking = await ResourceBooking.create({
      resourceId,
      tenantId,
      startTime,
      endTime
    });
    res.status(201).json(booking);
  } catch (error) {
    console.error('Error booking resource:', error);
    res.status(500).json({ message: 'An error occurred while booking the resource' });
  }
};

// POST: CancelResourceBooking
export const cancelResourceBooking = async (req: RequestWithTenant, res: Response) => {
  try {
    const tenantId = req.tenant?.id;
    const { bookingId } = req.body;
    if (!tenantId || !bookingId) {
      return res.status(400).json({ message: 'Missing bookingId or tenantId' });
    }
    const booking = await ResourceBooking.findOne({ where: { id: bookingId, tenantId } });
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    await booking.destroy();
    res.status(200).json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling resource booking:', error);
    res.status(500).json({ message: 'An error occurred while cancelling the booking' });
  }
};

// GET: GetResourceBookings
export const getResourceBookings = async (req: RequestWithTenant, res: Response) => {
  try {
    const tenantId = req.tenant?.id;
    const { resourceId } = req.query;
    if (!tenantId) {
      return res.status(400).json({ message: 'Missing tenantId' });
    }
    const where: any = { tenantId };
    if (resourceId && typeof resourceId === 'string') {
      where.resourceId = resourceId;
    }
    const bookings = await ResourceBooking.findAll({ where });
    res.json(bookings);
  } catch (error) {
    console.error('Error getting resource bookings:', error);
    res.status(500).json({ message: 'An error occurred while retrieving bookings' });
  }
};
