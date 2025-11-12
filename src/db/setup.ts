import sequelize, { createDatabaseIfNotExists } from './database';
import { dbConfig } from '../config/config';
import { seedHostTenant } from './seed';

// Import all models
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

async function setupDatabase() {
  try {
    console.log('\n🚀 Starting database setup...\n');

    // Step 1: Create database
    console.log('Step 1️⃣  Creating database if not exists...');
    await createDatabaseIfNotExists();
    console.log('   ✅ Done\n');

    // Step 2: Connect to database
    console.log('Step 2️⃣  Connecting to database...');
    await sequelize.authenticate();
    console.log('   ✅ Connected\n');

    // Step 3: Register models
    console.log('Step 3️⃣  Registering models...');
    const models = [
      Tenant, User, Role, UserRole, Permission, RolePermission, TenantSetting,
      Member, MemberProfileCompletion, Policy, PolicyEnrollment, Claim,
      Beneficiary, Dependent, MemberBankingDetail, FuneralEvent,
      Resource, ResourceBooking, Asset, AssetCheckout, AssetInspectionLog,
      DashboardWidgetSetting, DocumentRequirement, FileMetadata,
      LandingPageLayout, LandingPageComponent, Invoice, Payment, 
      ClaimDocument, ClaimWorkflowHistory, Log, PasswordResetCode, RefreshToken,
      NotificationTemplate, TermsAndConditions, TermsAcceptance, VerificationRequest,
      DependentOtp, RequiredDocument, MemberOnboardingData, SubscriptionPlan
    ];
    console.log(`   ✅ ${models.length} models registered\n`);

    // Step 4: Sync (create tables)
    console.log('Step 4️⃣  Creating database tables (force: true will drop existing tables)...');
    console.log('   ⏳ This may take a moment...\n');
    await sequelize.sync({ force: true });
    console.log('   ✅ All tables created\n');

    // Step 5: Verify tables exist
    console.log('Step 5️⃣  Verifying tables...');
    const [tables] = await sequelize.query(
      `SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = '${dbConfig.database}' ORDER BY TABLE_NAME`
    );
    
    const tableNames = (tables as any[]).map(t => t.TABLE_NAME).sort();
    console.log(`   ✅ Found ${tableNames.length} tables:\n`);
    
    tableNames.forEach((table: string) => {
      console.log(`      ✓ ${table}`);
    });
    console.log();

    // Summary
    console.log('🎉 Database setup complete!\n');
    console.log('📊 Summary:');
    console.log(`   Database: ${dbConfig.database}`);
    console.log(`   Host: ${dbConfig.host}`);
    console.log(`   User: ${dbConfig.user}`);
    console.log(`   Tables: ${tableNames.length}\n`);

    // Step 6: Seed Host Tenant
    console.log('Step 6️⃣  Seeding Host Tenant and System Administrator...\n');
    await seedHostTenant({ sequelize });
    console.log();

  } catch (error) {
    console.error('\n❌ Error setting up database:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

setupDatabase();
