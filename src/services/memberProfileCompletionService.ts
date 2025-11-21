

import { Response } from 'express';
import { RequestWithTenant } from '../middleware/tenantMiddleware';
import MemberProfileCompletion from '../models/memberProfileCompletion';

export const getStatus = async (req: RequestWithTenant, res: Response) => { res.status(501).send('Not Implemented'); };

export const getMyStatus = async (req: RequestWithTenant, res: Response) => {
	try {
		const { Member, Dependent, Beneficiary, FileMetadata, RequiredDocument } = require('../models');
		const userId = req.user?.id;
		const tenantId = req.tenant?.id;
		if (!userId || !tenantId) {
			return res.status(401).json({ error: 'Invalid user or tenant context' });
		}

		// Get member and related entities
		const member = await Member.findOne({
			where: { id: userId, tenantId },
		});
		if (!member) {
			return res.status(404).json({ error: 'Member not found' });
		}

		// Dependents
		const dependentsCount = await Dependent.count({ where: { memberId: userId, tenantId } });
		const hasDependents = dependentsCount > 0;

		// Beneficiaries
		const beneficiariesCount = await Beneficiary.count({ where: { memberId: userId, tenantId } });
		const hasBeneficiaries = beneficiariesCount > 0;

		// ID Document
		const idDocUploaded = await FileMetadata.findOne({
			where: {
				entityType: 'Member',
				entityId: userId,
				tenantId,
				[require('sequelize').Op.or]: [
					{ description: { [require('sequelize').Op.like]: '%Id%' } },
					{ fileName: { [require('sequelize').Op.like]: '%id%' } },
				],
			},
		});
		const hasUploadedIdDocument = !!idDocUploaded;

		// Terms acceptance (stub: always true, replace with real check if available)
		const hasAcceptedTerms = true;

		// Custom forms (stub: always true, replace with real check if available)
		const hasCompletedCustomForms = true;

		// Required documents
		const requiredDocsCount = await RequiredDocument.count({
			where: { tenantId, isActive: true, isRequired: true },
		});
		const uploadedDocsCount = await FileMetadata.count({
			where: { entityType: 'Member', entityId: userId, tenantId },
		});
		const hasUploadedRequiredDocuments = requiredDocsCount === 0 || uploadedDocsCount >= requiredDocsCount;

		// Completion logic
		const isProfileComplete = hasDependents && hasBeneficiaries && hasUploadedIdDocument && hasAcceptedTerms && hasCompletedCustomForms && hasUploadedRequiredDocuments;

		// Completion percentage
		const totalSteps = 6;
		let completedSteps = 0;
		if (hasDependents) completedSteps++;
		if (hasBeneficiaries) completedSteps++;
		if (hasUploadedIdDocument) completedSteps++;
		if (hasAcceptedTerms) completedSteps++;
		if (hasCompletedCustomForms) completedSteps++;
		if (hasUploadedRequiredDocuments) completedSteps++;
		const completionPercentage = Math.round((completedSteps / totalSteps) * 100);

		// Next step recommendation
		let nextStep = null;
		if (!hasDependents) nextStep = 'Add at least one dependent';
		else if (!hasBeneficiaries) nextStep = 'Add at least one beneficiary';
		else if (!hasUploadedIdDocument) nextStep = 'Upload your ID document';
		else if (!hasAcceptedTerms) nextStep = 'Accept terms and conditions';
		else if (!hasCompletedCustomForms) nextStep = 'Complete custom forms';
		else if (!hasUploadedRequiredDocuments) nextStep = 'Upload required documents';

		// Response DTO
		const status = {
			isProfileComplete,
			dependentsCount,
			beneficiariesCount,
			hasUploadedIdDocument,
			hasAcceptedTerms,
			hasCompletedCustomForms,
			hasUploadedRequiredDocuments,
			completionPercentage,
			nextStepRecommendation: nextStep,
			requiredDocumentsCount: requiredDocsCount,
			uploadedDocumentsCount: uploadedDocsCount,
		};
		return res.json(status);
	} catch (err) {
		console.error('Error getting profile completion status:', err);
		return res.status(500).json({ error: 'An error occurred while retrieving profile completion status' });
	}
};

export const initialize = async (req: RequestWithTenant, res: Response) => { res.status(501).send('Not Implemented'); };

export const updateStep = async (req: RequestWithTenant, res: Response) => { res.status(501).send('Not Implemented'); };

export const recalculate = async (req: RequestWithTenant, res: Response) => { res.status(501).send('Not Implemented'); };

export const recalculateMy = async (req: RequestWithTenant, res: Response) => { res.status(501).send('Not Implemented'); };

export const getIncompleteMembers = async (req: RequestWithTenant, res: Response) => { res.status(501).send('Not Implemented'); };
