import { Response } from 'express';
import { RequestWithTenant } from '../middleware/tenantMiddleware';
import Invoice from '../models/invoice';

export const createInvoice = async (req: RequestWithTenant, res: Response) => {
  try {
    const { memberId, amountDue, dueDate, issueDate, invoiceNumber } = req.body;
    if (!req.tenant) {
      return res.status(400).json({ error: 'Tenant not found' });
    }
    const invoice = await Invoice.create({ 
      memberId, 
      amountDue, 
      dueDate, 
      issueDate, 
      invoiceNumber,
      isPaid: false,
      tenantId: req.tenant.id 
    });
    res.status(201).json(invoice);
  } catch (error) {
    res.status(500).json({ error: 'Error creating invoice' });
  }
};

export const getInvoiceById = async (req: RequestWithTenant, res: Response) => {
  try {
    if (!req.tenant) {
      return res.status(400).json({ error: 'Tenant not found' });
    }
    const { id } = req.params;
    const invoice = await Invoice.findOne({ where: { id, tenantId: req.tenant.id } });
    if (invoice) {
      res.json(invoice);
    } else {
      res.status(404).json({ error: 'Invoice not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error getting invoice' });
  }
};

export const getInvoicesByMember = async (req: RequestWithTenant, res: Response) => {
  try {
    if (!req.tenant) {
      return res.status(400).json({ error: 'Tenant not found' });
    }
    const { memberId } = req.params;
    const invoices = await Invoice.findAll({ where: { memberId, tenantId: req.tenant.id } });
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ error: 'Error getting invoices' });
  }
};

export const getAllInvoices = async (req: RequestWithTenant, res: Response) => {
  try {
    if (!req.tenant) {
      return res.status(400).json({ error: 'Tenant not found' });
    }
    const invoices = await Invoice.findAll({ where: { tenantId: req.tenant.id } });
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ error: 'Error getting invoices' });
  }
};

export const updateInvoice = async (req: RequestWithTenant, res: Response) => {
  try {
    if (!req.tenant) {
      return res.status(400).json({ error: 'Tenant not found' });
    }
    const { id } = req.params;
    const { amountDue, dueDate, issueDate, isPaid, invoiceNumber } = req.body;
    const [updated] = await Invoice.update(
      { amountDue, dueDate, issueDate, isPaid, invoiceNumber }, 
      { where: { id, tenantId: req.tenant.id } }
    );
    if (updated) {
      const updatedInvoice = await Invoice.findOne({ where: { id } });
      res.json(updatedInvoice);
    } else {
      res.status(404).json({ error: 'Invoice not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error updating invoice' });
  }
};

export const deleteInvoice = async (req: RequestWithTenant, res: Response) => {
  try {
    if (!req.tenant) {
      return res.status(400).json({ error: 'Tenant not found' });
    }
    const { id } = req.params;
    const deleted = await Invoice.destroy({ where: { id, tenantId: req.tenant.id } });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Invoice not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error deleting invoice' });
  }
};
