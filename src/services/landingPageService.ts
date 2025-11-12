

import { Response } from 'express';
import { RequestWithTenant } from '../middleware/tenantMiddleware';
import LandingPageLayout from '../models/landingPageLayout';
import LandingPageComponent from '../models/landingPageComponent';
import { Op } from 'sequelize';

// GET: LandingPage_GetLandingPage
export const getLandingPage = async (req: RequestWithTenant, res: Response) => {
	try {
		const tenantId = req.tenant?.id;
		if (!tenantId) return res.status(401).json({ message: 'Invalid Tenant' });

		// Fetch layouts for this tenant
		const layouts = await LandingPageLayout.findAll({
			where: { tenantId }
		});

		// Fetch components for this tenant
		const components = await LandingPageComponent.findAll({
			where: { tenantId }
		});

		// Build DTO structure
		const landingPageDto = {
			layouts: layouts.map(layout => ({
				id: layout.id,
				name: layout.name,
				layoutJson: layout.layoutJson,
				components: components.map(component => ({
					id: component.id,
					title: component.title,
					componentType: component.componentType,
					content: component.content ? JSON.parse(component.content) : undefined
				}))
			}))
		};

		res.json(landingPageDto);
	} catch (error) {
		console.error('Error getting landing page:', error);
		res.status(500).json({ message: 'Internal server error' });
	}
};

// POST: LandingPage_CreateOrUpdateLandingPage
export const createOrUpdateLandingPage = async (req: RequestWithTenant, res: Response) => {
	try {
		const tenantId = req.tenant?.id;
		if (!tenantId) return res.status(401).json({ message: 'Invalid Tenant' });
		const { layouts } = req.body;
		if (!Array.isArray(layouts)) return res.status(400).json({ message: 'Invalid payload' });

		// Remove all existing layouts and components for this tenant
		await LandingPageComponent.destroy({ where: { tenantId } });
		await LandingPageLayout.destroy({ where: { tenantId } });

		// Create new layouts and components
		for (const layoutDto of layouts) {
			const layout = await LandingPageLayout.create({
				tenantId,
				name: layoutDto.name,
				layoutJson: layoutDto.layoutJson
			});
			if (Array.isArray(layoutDto.components)) {
				for (const componentDto of layoutDto.components) {
					const componentData: any = {
						tenantId,
						title: componentDto.title,
						sortOrder: componentDto.sortOrder,
						componentType: componentDto.componentType
					};
					if (componentDto.content) {
						componentData.content = JSON.stringify(componentDto.content);
					}
					await LandingPageComponent.create(componentData);
				}
			}
		}

		res.status(204).send();
	} catch (error) {
		console.error('Error creating/updating landing page:', error);
		res.status(500).json({ message: 'Internal server error' });
	}
};
