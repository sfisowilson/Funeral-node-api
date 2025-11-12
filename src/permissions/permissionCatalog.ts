/**
 * Permission Catalog - Matches C# PermissionCatalog
 */
export const PERMISSION_CATALOG = [
  // Tenant permissions
  'Permission.tenant.view',
  'Permission.tenant.create',
  'Permission.tenant.update',
  
  // Role permissions
  'Permission.role.view',
  'Permission.role.create',
  'Permission.role.update',
  
  // User permissions
  'Permission.user.view',
  'Permission.user.create',
  'Permission.user.update',
  
  // Policy permissions
  'Permission.policy.view',
  'Permission.policy.create',
  'Permission.policy.update',
  
  // Policy Attributes permissions
  'Permission.policyAttributes.view',
  'Permission.policyAttributes.create',
  'Permission.policyAttributes.update',
  
  // Member permissions
  'Permission.member.delete',
  'Permission.member.approve',
  'Permission.member.reject',
  'Permission.member.create',
  'Permission.member.update',
  'Permission.member.disable',
  'Permission.member.enable',
  'Permission.member.view',
  
  // Beneficiary permissions
  'Permission.beneficiary.delete',
  'Permission.beneficiary.approve',
  'Permission.beneficiary.reject',
  'Permission.beneficiary.create',
  'Permission.beneficiary.update',
  
  // Dependent permissions
  'Permission.dependent.delete',
  'Permission.dependent.approve',
  'Permission.dependent.reject',
  'Permission.dependent.create',
  'Permission.dependent.update',
  
  // Claim permissions
  'Permission.claim.create',
  'Permission.claim.view',
  'Permission.claim.updateStatus',
  'Permission.claim.delete',
  'Permission.claim.history.view',
  
  // Funeral Event permissions
  'Permission.funeralEvent.create',
  'Permission.funeralEvent.view',
  'Permission.funeralEvent.update',
  'Permission.funeralEvent.delete',
  'Permission.funeralEvent.updateStatus',
  
  // Resource permissions
  'Permission.resource.create',
  'Permission.resource.view',
  'Permission.resource.update',
  'Permission.resource.delete',
  'Permission.resource.book',
  'Permission.resource.cancelBooking',
  
  // Asset permissions
  'Permission.asset.create',
  'Permission.asset.view',
  'Permission.asset.update',
  'Permission.asset.delete',
  
  // Timesheet permissions
  'Permission.timesheet.create',
  'Permission.timesheet.view',
  'Permission.timesheet.update',
  'Permission.timesheet.delete',
  
  // Subscription permissions
  'Permission.subscription.create',
  'Permission.subscription.view',
  'Permission.subscription.update',
  'Permission.subscription.delete',
  
  // User Profile permissions
  'Permission.UserProfile.View',
  'Permission.UserProfile.Update',
  
  // Onboarding permissions
  'Permission.onboardingFieldConfiguration.view',
  'Permission.onboardingFieldConfiguration.create',
  'Permission.onboardingFieldConfiguration.update',
  'Permission.onboardingFieldConfiguration.delete',
  'Permission.onboardingFieldConfiguration.initialize',
  
  // Reporting permissions
  'Permission.reporting.dashboard.view',
  
  // Role template permissions
  'Permission.roleTemplate.apply',
  
  // Admin
  'Admin',
];
