
import sequelize, { createDatabaseIfNotExists } from './database';
import Tenant from '../models/tenant';
import User from '../models/user';
import Role from '../models/role';
import UserRole from '../models/userRole';
import Permission from '../models/permission';
import RolePermission from '../models/rolePermission';
import TenantSetting from '../models/tenantSetting';
import Member from '../models/member';
import MemberProfileCompletion from '../models/memberProfileCompletion';
import Policy from '../models/policy';
import PolicyEnrollment from '../models/policyEnrollment';
import Claim from '../models/claim';
import Beneficiary from '../models/beneficiary';
import Dependent from '../models/dependent';
import MemberBankingDetail from '../models/memberBankingDetail';
import FuneralEvent from '../models/funeralEvent';
import Resource from '../models/resource';
import ResourceBooking from '../models/resourceBooking';
import Asset from '../models/asset';
import AssetCheckout from '../models/assetCheckout';
import AssetInspectionLog from '../models/assetInspectionLog';
import DashboardWidgetSetting from '../models/dashboardWidgetSetting';
import DocumentRequirement from '../models/documentRequirement';
import FileMetadata from '../models/fileMetadata';
import LandingPageLayout from '../models/landingPageLayout';
import LandingPageComponent from '../models/landingPageComponent';
import Invoice from '../models/invoice';
import Payment from '../models/payment';
import ClaimDocument from '../models/claimDocument';
import ClaimWorkflowHistory from '../models/claimWorkflowHistory';
import Log from '../models/log';
import PasswordResetCode from '../models/passwordResetCode';
import RefreshToken from '../models/refreshToken';
import NotificationTemplate from '../models/notificationTemplate';
import TermsAndConditions from '../models/termsAndConditions';
import TermsAcceptance from '../models/termsAcceptance';
import VerificationRequest from '../models/verificationRequest';
import DependentOtp from '../models/dependentOtp';
import RequiredDocument from '../models/requiredDocument';
import MemberOnboardingData from '../models/memberOnboardingData';
import SubscriptionPlan from '../models/subscriptionPlan';

const syncDatabase = async () => {
  try {
    console.log('🚀 Starting database synchronization...\n');
    
    // Step 1: Create database if not exists
    console.log('📦 Creating database if not exists...');
    await createDatabaseIfNotExists();
    console.log('✅ Database ready\n');

    // Step 2: Ensure Policies.memberId column exists
    console.log('🔎 Checking for memberId column in Policies table...');
    const [columns] = await sequelize.query("SHOW COLUMNS FROM Policies LIKE 'memberId'");
    if (!Array.isArray(columns) || columns.length === 0) {
      console.log('➕ Adding memberId column to Policies table...');
      await sequelize.query("ALTER TABLE Policies ADD COLUMN memberId CHAR(36) NULL;");
      console.log('✅ memberId column added.');
    } else {
      console.log('✅ memberId column already exists.');
    }

    // Step 3: Sync all models
    console.log('🔄 Syncing all models with database...');
    await sequelize.sync({ force: true });
    console.log('✅ All models synced\n');

    // Summary
    console.log('📊 Database synchronization complete!');
    console.log('✅ Created 39 tables with GUID primary keys and multi-tenancy support\n');
    console.log('Tables created:');
    console.log('  ✅ Tenants');
    console.log('  ✅ Users');
    console.log('  ✅ Roles');
    console.log('  ✅ Permissions');
    console.log('  ✅ RolePermissions');
    console.log('  ✅ UserRoles');
    console.log('  ✅ TenantSettings');
    console.log('  ✅ Members');
    console.log('  ✅ MemberProfileCompletions');
    console.log('  ✅ Policies');
    console.log('  ✅ PolicyEnrollments');
    console.log('  ✅ Claims');
    console.log('  ✅ Beneficiaries');
    console.log('  ✅ Dependents');
    console.log('  ✅ MemberBankingDetails');
    console.log('  ✅ FuneralEvents');
    console.log('  ✅ Resources');
    console.log('  ✅ ResourceBookings');
    console.log('  ✅ Assets');
    console.log('  ✅ AssetCheckouts');
    console.log('  ✅ AssetInspectionLogs');
    console.log('  ✅ DashboardWidgetSettings');
    console.log('  ✅ DocumentRequirements');
    console.log('  ✅ FileMetadata');
    console.log('  ✅ LandingPageLayouts');
    console.log('  ✅ LandingPageComponents');
    console.log('  ✅ Invoices');
    console.log('  ✅ Payments');
    console.log('  ✅ ClaimDocuments');
    console.log('  ✅ ClaimWorkflowHistories');
    console.log('  ✅ Logs');
    console.log('  ✅ PasswordResetCodes');
    console.log('  ✅ RefreshTokens');
    console.log('  ✅ NotificationTemplates');
    console.log('  ✅ TermsAndConditions');
    console.log('  ✅ TermsAcceptances');
    console.log('  ✅ VerificationRequests');
    console.log('  ✅ DependentOtps');
    console.log('  ✅ RequiredDocuments');
    console.log('  ✅ MemberOnboardingDatas');
    console.log('  ✅ SubscriptionPlans\n');
    
    console.log('🎉 Database is ready for use!\n');
  } catch (error) {
    console.error('❌ Error synchronizing the database:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
};

syncDatabase();
