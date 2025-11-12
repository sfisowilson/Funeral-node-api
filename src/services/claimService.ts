
import { Response } from 'express';
import { RequestWithTenant } from '../middleware/tenantMiddleware';
import Claim from '../models/claim';

export const checkEligibility = async (req: RequestWithTenant, res: Response) => { res.status(501).send('Not Implemented'); };

export const createEnhancedClaim = async (req: RequestWithTenant, res: Response) => { res.status(501).send('Not Implemented'); };

export const getProcessTracking = async (req: RequestWithTenant, res: Response) => { res.status(501).send('Not Implemented'); };

export const getByBeneficiary = async (req: RequestWithTenant, res: Response) => { res.status(501).send('Not Implemented'); };

export const getByMember = async (req: RequestWithTenant, res: Response) => { res.status(501).send('Not Implemented'); };

export const updateClaimDocuments = async (req: RequestWithTenant, res: Response) => { res.status(501).send('Not Implemented'); };

export const createClaim = async (req: RequestWithTenant, res: Response) => {
  try {
    const {
      memberId,
      policyId,
      claimAmount,
      claimDate,
      dateOfDeath,
      causeOfDeath,
      placeOfDeath,
      status,
      description,
      claimType,
      claimantType,
      claimantId,
      claimantName,
      claimantEmail,
      claimantPhone,
      claimantIdNumber,
      claimantAddress,
      deceasedPersonId,
      deceasedPersonName,
      deceasedPersonIdNumber,
      relationshipToDeceased,
      beneficiaryId,
      dependentId,
      bankName,
      accountNumber,
      branchCode,
      accountHolderName,
      funeralServiceProvider,
      estimatedFuneralCosts,
      proposedFuneralDate,
      funeralLocation,
    } = req.body;

    if (!req.tenant) {
      return res.status(400).json({ error: 'Tenant not found' });
    }

    const claim = await Claim.create({
      memberId,
      policyId,
      claimAmount,
      claimDate,
      dateOfDeath,
      causeOfDeath,
      placeOfDeath,
      status: status || 'Pending',
      description,
      claimType,
      claimantType,
      claimantId,
      claimantName,
      claimantEmail,
      claimantPhone,
      claimantIdNumber,
      claimantAddress,
      deceasedPersonId,
      deceasedPersonName,
      deceasedPersonIdNumber,
      relationshipToDeceased,
      beneficiaryId,
      dependentId,
      bankName,
      accountNumber,
      branchCode,
      accountHolderName,
      funeralServiceProvider,
      estimatedFuneralCosts,
      proposedFuneralDate,
      funeralLocation,
      tenantId: req.tenant.id,
    });

    res.status(201).json(claim);
  } catch (error) {
    res.status(500).json({ error: 'Error creating claim', details: (error as any).message });
  }
};

export const getClaimById = async (req: RequestWithTenant, res: Response) => {
  try {
    if (!req.tenant) {
      return res.status(400).json({ error: 'Tenant not found' });
    }
    const { id } = req.params;
    const claim = await Claim.findOne({ where: { id, tenantId: req.tenant.id } });
    if (claim) {
      res.json(claim);
    } else {
      res.status(404).json({ error: 'Claim not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error getting claim' });
  }
};

export const getAllClaims = async (req: RequestWithTenant, res: Response) => {
  try {
    if (!req.tenant) {
      return res.status(400).json({ error: 'Tenant not found' });
    }
    const claims = await Claim.findAll({ where: { tenantId: req.tenant.id } });
    res.json(claims);
  } catch (error) {
    res.status(500).json({ error: 'Error getting claims' });
  }
};

export const updateClaimStatus = async (req: RequestWithTenant, res: Response) => {
  try {
    if (!req.tenant) {
      return res.status(400).json({ error: 'Tenant not found' });
    }
    const { id } = req.params;
    const {
      status,
      claimAmount,
      assessedAmount,
      assessmentNotes,
      assessedBy,
      assessedAt,
      approvedAmount,
      approvalNotes,
      approvedBy,
      approvedAt,
      isIdentityVerified,
      isDeathVerified,
      isPolicyVerified,
      isRelationshipVerified,
      hasDeathCertificate,
      hasIdentityDocuments,
      hasMedicalReports,
      hasPoliceReport,
      hasProofOfRelationship,
      hasBankingDetails,
      paymentReference,
      paymentDate,
      paidAmount,
      processedBy,
      rejectionReason,
      nextActionRequired,
      nextFollowUpDate,
    } = req.body;

    const [updated] = await Claim.update(
      {
        status,
        claimAmount,
        assessedAmount,
        assessmentNotes,
        assessedBy,
        assessedAt,
        approvedAmount,
        approvalNotes,
        approvedBy,
        approvedAt,
        isIdentityVerified,
        isDeathVerified,
        isPolicyVerified,
        isRelationshipVerified,
        hasDeathCertificate,
        hasIdentityDocuments,
        hasMedicalReports,
        hasPoliceReport,
        hasProofOfRelationship,
        hasBankingDetails,
        paymentReference,
        paymentDate,
        paidAmount,
        processedBy,
        rejectionReason,
        nextActionRequired,
        nextFollowUpDate,
      },
      { where: { id, tenantId: req.tenant.id } }
    );

    if (updated) {
      const updatedClaim = await Claim.findOne({ where: { id, tenantId: req.tenant.id } });
      res.json(updatedClaim);
    } else {
      res.status(404).json({ error: 'Claim not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error updating claim', details: (error as any).message });
  }
};

export const deleteClaim = async (req: RequestWithTenant, res: Response) => {
  try {
    if (!req.tenant) {
      return res.status(400).json({ error: 'Tenant not found' });
    }
    const { id } = req.params;
    const deleted = await Claim.destroy({ where: { id, tenantId: req.tenant.id } });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Claim not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error deleting claim' });
  }
};
