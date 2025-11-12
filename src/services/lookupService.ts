import { Response } from 'express';
import { RequestWithTenant } from '../middleware/tenantMiddleware';
import SubscriptionPlan from '../models/subscriptionPlan';

// Define enum values that match the C# backend
const ENUMS = {
  TenantType: [
    { value: 'Basic', name: 'Basic' },
    { value: 'Standard', name: 'Standard' },
    { value: 'Premium', name: 'Premium' },
  ],
  ClaimStatus: [
    { value: 'Pending', name: 'Pending' },
    { value: 'Approved', name: 'Approved' },
    { value: 'Rejected', name: 'Rejected' },
    { value: 'Paid', name: 'Paid' },
  ],
  ResourceStatus: [
    { value: 'Available', name: 'Available' },
    { value: 'InUse', name: 'In Use' },
    { value: 'Maintenance', name: 'Maintenance' },
    { value: 'Unavailable', name: 'Unavailable' },
  ],
};

export const getEnumValues = async (req: RequestWithTenant, res: Response) => {
	try {
		const { enumTypeName } = req.params;

		if (!enumTypeName) {
			return res.status(400).json({ message: 'enumTypeName parameter is required' });
		}

		const enumValues = ENUMS[enumTypeName as keyof typeof ENUMS];

		if (!enumValues) {
			return res.status(404).json({
				message: `Enum '${enumTypeName}' not found`,
				availableEnums: Object.keys(ENUMS),
			});
		}

		res.json(enumValues);
	} catch (error) {
		console.error('Error retrieving enum values:', error);
		res.status(500).json({ message: 'Error retrieving enum values' });
	}
};
