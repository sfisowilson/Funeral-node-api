import { Response } from 'express';
import { RequestWithTenant } from '../middleware/tenantMiddleware';
import Payment from '../models/payment';

export const createPayment = async (req: RequestWithTenant, res: Response) => {
  try {
    const { memberId, amount, paymentDate, paymentMethod, transactionId } = req.body;
    if (!req.tenant) {
      return res.status(400).json({ error: 'Tenant not found' });
    }
    const payment = await Payment.create({ 
      memberId, 
      amount, 
      paymentDate, 
      paymentMethod,
      transactionId,
      tenantId: req.tenant.id 
    });
    res.status(201).json(payment);
  } catch (error) {
    res.status(500).json({ error: 'Error creating payment' });
  }
};

export const getPaymentById = async (req: RequestWithTenant, res: Response) => {
  try {
    if (!req.tenant) {
      return res.status(400).json({ error: 'Tenant not found' });
    }
    const { id } = req.params;
    const payment = await Payment.findOne({ where: { id, tenantId: req.tenant.id } });
    if (payment) {
      res.json(payment);
    } else {
      res.status(404).json({ error: 'Payment not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error getting payment' });
  }
};

export const getPaymentsByMember = async (req: RequestWithTenant, res: Response) => {
  try {
    if (!req.tenant) {
      return res.status(400).json({ error: 'Tenant not found' });
    }
    const { memberId } = req.params;
    const payments = await Payment.findAll({ where: { memberId, tenantId: req.tenant.id } });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: 'Error getting payments' });
  }
};

export const getAllPayments = async (req: RequestWithTenant, res: Response) => {
  try {
    if (!req.tenant) {
      return res.status(400).json({ error: 'Tenant not found' });
    }
    const payments = await Payment.findAll({ where: { tenantId: req.tenant.id } });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: 'Error getting payments' });
  }
};

export const updatePayment = async (req: RequestWithTenant, res: Response) => {
  try {
    if (!req.tenant) {
      return res.status(400).json({ error: 'Tenant not found' });
    }
    const { id } = req.params;
    const { amount, paymentDate, paymentMethod, transactionId } = req.body;
    const [updated] = await Payment.update(
      { amount, paymentDate, paymentMethod, transactionId }, 
      { where: { id, tenantId: req.tenant.id } }
    );
    if (updated) {
      const updatedPayment = await Payment.findOne({ where: { id } });
      res.json(updatedPayment);
    } else {
      res.status(404).json({ error: 'Payment not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error updating payment' });
  }
};

export const deletePayment = async (req: RequestWithTenant, res: Response) => {
  try {
    if (!req.tenant) {
      return res.status(400).json({ error: 'Tenant not found' });
    }
    const { id } = req.params;
    const deleted = await Payment.destroy({ where: { id, tenantId: req.tenant.id } });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Payment not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error deleting payment' });
  }
};
