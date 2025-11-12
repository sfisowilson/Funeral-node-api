
import { Response } from 'express';
import { RequestWithTenant } from '../middleware/tenantMiddleware';

export const getStatus = async (req: RequestWithTenant, res: Response) => { res.status(501).send('Not Implemented'); };

export const getMyStatus = async (req: RequestWithTenant, res: Response) => { res.status(501).send('Not Implemented'); };

export const initialize = async (req: RequestWithTenant, res: Response) => { res.status(501).send('Not Implemented'); };

export const updateStep = async (req: RequestWithTenant, res: Response) => { res.status(501).send('Not Implemented'); };

export const recalculate = async (req: RequestWithTenant, res: Response) => { res.status(501).send('Not Implemented'); };

export const recalculateMy = async (req: RequestWithTenant, res: Response) => { res.status(501).send('Not Implemented'); };

export const getIncompleteMembers = async (req: RequestWithTenant, res: Response) => { res.status(501).send('Not Implemented'); };
