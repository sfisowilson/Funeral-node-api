// ...existing code...

import { LandingPageComponent, LandingPageLayout, TenantSetting } from './models';

import express, { Response } from 'express';
import cors from 'cors';
// Swagger UI now handled by swagger-jsdoc and src/swagger.ts
import { tenantMiddleware, RequestWithTenant } from './middleware/tenantMiddleware';
import { authMiddleware } from './middleware/authMiddleware';
import { connectToDatabase } from './db/database';
import tenantRoutes from './routes/tenantRoutes';
import authRoutes from './routes/authRoutes';
import memberRoutes from './routes/memberRoutes';
import policyRoutes from './routes/policyRoutes';
import claimRoutes from './routes/claimRoutes';
import beneficiaryRoutes from './routes/beneficiaryRoutes';
import dependentRoutes from './routes/dependentRoutes';
import memberBankingDetailRoutes from './routes/memberBankingDetailRoutes';
import funeralEventRoutes from './routes/funeralEventRoutes';
import resourceRoutes from './routes/resourceRoutes';
import assetRoutes from './routes/assetRoutes';
import assetManagementRoutes from './routes/assetManagementRoutes';
import dashboardWidgetRoutes from './routes/dashboardWidgetRoutes';
import tenantSettingRoutes from './routes/tenantSettingRoutes';
import documentRequirementRoutes from './routes/documentRequirementRoutes';
import fileUploadRoutes from './routes/fileUploadRoutes';
import premiumCalculationRoutes from './routes/premiumCalculationRoutes';

import lookupRoutes from './routes/lookupRoutes';
import memberProfileCompletionRoutes from './routes/memberProfileCompletionRoutes';
import memberRegistrationRoutes from './routes/memberRegistrationRoutes';





const app = express();

// Dynamic CORS configuration - validate against registered tenant domains
const dynamicCorsOrigins = new Set<string>();

// Function to load tenant domains from database
const loadTenantDomainsForCors = async () => {
  try {
    const Tenant = (await import('./models/tenant')).default;
    const tenants = await Tenant.findAll({ attributes: ['domain'] });
    
    // Clear existing origins
    dynamicCorsOrigins.clear();
    
    // Add localhost for development
    dynamicCorsOrigins.add('http://localhost:4200');
    dynamicCorsOrigins.add('http://localhost:3000');
    dynamicCorsOrigins.add('http://127.0.0.1:4200');
    dynamicCorsOrigins.add('http://127.0.0.1:3000');
    
    // Add all tenant domains
    tenants.forEach(tenant => {
      if (tenant.domain) {
        dynamicCorsOrigins.add(`http://${tenant.domain}.funeral.com:4200`);
        dynamicCorsOrigins.add(`https://${tenant.domain}.funeral.com:4200`);
        dynamicCorsOrigins.add(`http://${tenant.domain}.funeral.com`);
        dynamicCorsOrigins.add(`https://${tenant.domain}.funeral.com`);
      }
    });
    
    console.log('Loaded CORS origins for', dynamicCorsOrigins.size, 'domains');
  } catch (error) {
    console.error('Error loading tenant domains for CORS:', error);
  }
};

// CORS configuration with dynamic origin validation
app.use(cors({
  origin: async (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      return callback(null, true);
    }
    
    // Check if origin is in the allowed list
    if (dynamicCorsOrigins.has(origin)) {
      return callback(null, true);
    }
    
    // For development, also allow any localhost
    if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
      return callback(null, true);
    }
    
    console.warn(`CORS blocked origin: ${origin}`);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Tenant-ID']
}));

const port = process.env.PORT || 3000;

// Health check endpoint
app.get('/health', (req, res) => res.send('OK'));

app.use(express.json());
app.use(tenantMiddleware);

import swaggerRouter from './swagger';
app.use('/api-docs', swaggerRouter);

app.use('/api/Tenant', tenantRoutes);
app.use('/api/Auth', authRoutes);

// Public TenantSetting routes (before authMiddleware)
// Only the GetCurrentTenantSettings endpoint is public for landing page access
import { Router } from 'express';
const tenantSettingPublicRouter = Router();
const tenantSettingGetCurrentHandler = async (req: RequestWithTenant, res: Response) => {
  try {
    const tenantSettingService = (await import('./services/tenantSettingService')).default;
    const tenantId = req.tenant?.id;
    if (!tenantId) return res.status(400).json({ message: 'Tenant context missing' });
    const setting = await tenantSettingService.getCurrentTenantSettings(tenantId);
    if (!setting) return res.status(404).json({ message: 'Tenant settings not found for the current tenant.' });
    res.json(setting);
  } catch (err) {
    res.status(500).json({ message: 'An error occurred', error: err });
  }
};
tenantSettingPublicRouter.get('/TenantSetting_GetCurrentTenantSettings', tenantSettingGetCurrentHandler);
app.use('/api/TenantSetting', tenantSettingPublicRouter);

// Public LandingPage routes (before authMiddleware)
import { getLandingPage } from './services/landingPageService';
const landingPagePublicRouter = express.Router();
landingPagePublicRouter.get('/LandingPage_GetLandingPage', getLandingPage);
app.use('/api/LandingPage', landingPagePublicRouter);

// Public Lookup routes (before authMiddleware) - needed for tenant registration form
app.use('/api/Lookup', lookupRoutes);

// Public PremiumCalculation routes (before authMiddleware) - needed for landing pages
app.use('/api/PremiumCalculation', premiumCalculationRoutes);

// File Upload routes (before authMiddleware) - public download endpoint needs to be accessible
// Individual routes handle their own auth requirements
app.use('/api/FileUpload', fileUploadRoutes);

// Apply authMiddleware to all routes after this point
app.use(authMiddleware);

app.use('/api/Member', memberRoutes);
app.use('/api/Policy', policyRoutes);
app.use('/api/Claim', claimRoutes);
app.use('/api/Beneficiary', beneficiaryRoutes);
app.use('/api/Dependent', dependentRoutes);
app.use('/api/MemberBankingDetail', memberBankingDetailRoutes);
app.use('/api/FuneralEvent', funeralEventRoutes);
app.use('/api/Resource', resourceRoutes);
app.use('/api/Asset', assetRoutes);
app.use('/api/AssetManagement', assetManagementRoutes);
app.use('/api/DashboardWidget', dashboardWidgetRoutes);
app.use('/api/DocumentRequirement', documentRequirementRoutes);

// Protected TenantSetting routes (after authMiddleware)
app.use('/api/TenantSetting', tenantSettingRoutes);

app.use('/api/MemberProfileCompletion', memberProfileCompletionRoutes);
app.use('/api/MemberRegistration', memberRegistrationRoutes);

// Register the protected POST endpoint for LandingPage (after authMiddleware)
import { createOrUpdateLandingPage } from './services/landingPageService';
const landingPageProtectedRouter = express.Router();
landingPageProtectedRouter.post('/LandingPage_CreateOrUpdateLandingPage', createOrUpdateLandingPage);
app.use('/api/LandingPage', landingPageProtectedRouter);

/**
 * @openapi
 * /:
 *   get:
 *     tags:
 *       - Root
 *     summary: Root endpoint, returns greeting and tenant info if available
 *     responses:
 *       200:
 *         description: Greeting message
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 */
app.get('/', (req: RequestWithTenant, res: Response) => {
  if (req.tenant) {
    res.send(`Hello, ${req.tenant.name}!`);
  } else {
    res.send('Hello, World!');
  }
});

/**
 * @openapi
 * /tenant:
 *   get:
 *     tags:
 *       - Root
 *     summary: Get current tenant context for the request
 *     responses:
 *       200:
 *         description: Tenant context
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TenantDto'
 *       404:
 *         description: No tenant found for this domain
 */
app.get('/tenant', (req: RequestWithTenant, res: Response) => {
  if (req.tenant) {
    res.json(req.tenant);
  } else {
    res.status(404).send('No tenant found for this domain');
  }
});

// Export app with attached CORS reloader for backward compatibility
(app as any).loadTenantDomainsForCors = loadTenantDomainsForCors;
module.exports = app;

// Initialize CORS origins when database is ready
connectToDatabase().then(() => {
  console.log('Database connected, loading tenant domains for CORS...');
  loadTenantDomainsForCors();
  
  // Reload CORS origins every 5 minutes to pick up new tenants
  setInterval(loadTenantDomainsForCors, 5 * 60 * 1000);
  
  console.log('CORS origins initialized');
}).catch((error) => {
  console.error('Error connecting to database:', error);
  process.exit(1);
});
