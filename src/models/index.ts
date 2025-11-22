import Asset from './asset';
import AssetCheckout from './assetCheckout';
import AssetInspectionLog from './assetInspectionLog';
import Beneficiary from './beneficiary';
import Claim from './claim';
import ClaimDocument from './claimDocument';
import ClaimWorkflowHistory from './claimWorkflowHistory';
import DashboardWidgetSetting from './dashboardWidgetSetting';
import Dependent from './dependent';
import DependentOtp from './dependentOtp';
import DocumentRequirement from './documentRequirement';
import FileMetadata from './fileMetadata';
import FuneralEvent from './funeralEvent';
import Invoice from './invoice';
import LandingPageComponent from './landingPageComponent';
import LandingPageLayout from './landingPageLayout';
import Log from './log';
import Member from './member';
import MemberBankingDetail from './memberBankingDetail';
import MemberOnboardingData from './memberOnboardingData';
import MemberProfileCompletion from './memberProfileCompletion';
import NotificationTemplate from './notificationTemplate';
import OnboardingFieldConfiguration from './onboardingFieldConfiguration';
import PasswordResetCode from './passwordResetCode';
import Payment from './payment';
import Permission from './permission';
import Policy from './policy';
import PolicyEnrollment from './policyEnrollment';
import RefreshToken from './refreshToken';
import RequiredDocument from './requiredDocument';
import Resource from './resource';
import ResourceBooking from './resourceBooking';
import Role from './role';
import RolePermission from './rolePermission';
import SubscriptionPlan from './subscriptionPlan';
import Tenant from './tenant';
import { TenantSetting } from './tenantSetting';
import TermsAcceptance from './termsAcceptance';
import TermsAndConditions from './termsAndConditions';
import User from './user';
import UserRole from './userRole';
import VerificationRequest from './verificationRequest';

export {
  Asset,
  AssetCheckout,
  AssetInspectionLog,
  Beneficiary,
  Claim,
  ClaimDocument,
  ClaimWorkflowHistory,
  DashboardWidgetSetting,
  Dependent,
  DependentOtp,
  DocumentRequirement,
  FileMetadata,
  FuneralEvent,
  Invoice,
  LandingPageComponent,
  LandingPageLayout,
  Log,
  Member,
  MemberBankingDetail,
  MemberOnboardingData,
  MemberProfileCompletion,
  NotificationTemplate,
  OnboardingFieldConfiguration,
  PasswordResetCode,
  Payment,
  Permission,
  Policy,
  PolicyEnrollment,
  RefreshToken,
  RequiredDocument,
  Resource,
  ResourceBooking,
  Role,
  RolePermission,
  SubscriptionPlan,
  Tenant,
  TenantSetting,
  TermsAcceptance,
  TermsAndConditions,
  User,
  UserRole,
  VerificationRequest,
};

// Setup associations
Member.hasMany(Policy, { as: 'policies', foreignKey: 'memberId' });
