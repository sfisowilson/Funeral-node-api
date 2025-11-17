/**
 * @openapi
 * components:
 *   schemas:
 *     TenantSettingDto:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         settings:
 *           type: string
 *         ozowApiKey:
 *           type: string
 *         ozowSiteCode:
 *           type: string
 *         ozowPrivateKey:
 *           type: string
 *         logo:
 *           type: string
 *         favicon:
 *           type: string
 *         tenantName:
 *           type: string
 *         tenantDomain:
 *           type: string
 *       required:
 *         - id
 *         - settings
 *         - ozowApiKey
 *         - ozowSiteCode
 *         - ozowPrivateKey
 *         - logo
 *         - favicon
 *         - tenantName
 *         - tenantDomain
 *     BeneficiaryDto:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         tenantId:
 *           type: string
 *           format: uuid
 *         memberId:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         address:
 *           type: string
 *         phone1:
 *           type: string
 *         phone2:
 *           type: string
 *         identificationNumber:
 *           type: string
 *         relationship:
 *           type: string
 *         benefitPercentage:
 *           type: number
 *         isVerified:
 *           type: boolean
 *         verifiedAt:
 *           type: string
 *           format: date-time
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         createdBy:
 *           type: string
 *           format: uuid
 *         updatedBy:
 *           type: string
 *           format: uuid
 *       required:
 *         - id
 *         - tenantId
 *         - memberId
 *         - name
 *         - email
 *         - address
 *         - phone1
 *         - phone2
 *         - identificationNumber
 *         - relationship
 *         - benefitPercentage
 *         - isVerified
 *         - verifiedAt
 *         - createdAt
 *         - updatedAt
 *         - createdBy
 *         - updatedBy
 *     DependentDto:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         tenantId:
 *           type: string
 *           format: uuid
 *         memberId:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         address:
 *           type: string
 *         phone1:
 *           type: string
 *         phone2:
 *           type: string
 *         identificationNumber:
 *           type: string
 *         dependentType:
 *           type: string
 *         dateOfBirth:
 *           type: string
 *           format: date-time
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         createdBy:
 *           type: string
 *           format: uuid
 *         updatedBy:
 *           type: string
 *           format: uuid
 *       required:
 *         - id
 *         - tenantId
 *         - memberId
 *         - name
 *         - email
 *         - address
 *         - phone1
 *         - phone2
 *         - identificationNumber
 *         - dependentType
 *         - dateOfBirth
 *         - createdAt
 *         - updatedAt
 *         - createdBy
 *         - updatedBy
 *     MemberDto:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         tenantId:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         address:
 *           type: string
 *         title:
 *           type: string
 *         firstNames:
 *           type: string
 *         surname:
 *           type: string
 *         dateOfBirth:
 *           type: string
 *           format: date-time
 *         email:
 *           type: string
 *         phone1:
 *           type: string
 *         phone2:
 *           type: string
 *         identificationNumber:
 *           type: string
 *         sourceOfIncome:
 *           type: string
 *         sourceOfIncomeOther:
 *           type: string
 *         streetAddress:
 *           type: string
 *         city:
 *           type: string
 *         province:
 *           type: string
 *         postalCode:
 *           type: string
 *         country:
 *           type: string
 *         isReplacingExistingPolicy:
 *           type: boolean
 *         existingPolicyNumber:
 *           type: string
 *         existingInsurerName:
 *           type: string
 *         existingPolicyPaidUpToDate:
 *           type: boolean
 *         existingPolicyWaitingPeriodExpired:
 *           type: boolean
 *         sameBenefitAsExistingPolicy:
 *           type: boolean
 *         benefitDifferenceNotes:
 *           type: string
 *         occupation:
 *           type: string
 *         workPhoneNumber:
 *           type: string
 *         passportNumber:
 *           type: string
 *         countryOfBirth:
 *           type: string
 *         countryOfResidence:
 *           type: string
 *         citizenship:
 *           type: string
 *         nationality:
 *           type: string
 *         isForeigner:
 *           type: boolean
 *         workPermitNumber:
 *           type: string
 *         status:
 *           type: string
 *         paymentStatus:
 *           type: string
 *         nextPaymentDate:
 *           type: string
 *           format: date-time
 *         isIdVerified:
 *           type: boolean
 *         idVerifiedAt:
 *           type: string
 *           format: date-time
 *         isLifeVerified:
 *           type: boolean
 *         lifeVerifiedAt:
 *           type: string
 *           format: date-time
 *         signatureDataUrl:
 *           type: string
 *         signedAt:
 *           type: string
 *           format: date-time
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         createdBy:
 *           type: string
 *           format: uuid
 *         updatedBy:
 *           type: string
 *           format: uuid
 *       required:
 *         - id
 *         - tenantId
 *         - name
 *         - address
 *         - title
 *         - firstNames
 *         - surname
 *         - dateOfBirth
 *         - email
 *         - phone1
 *         - phone2
 *         - identificationNumber
 *         - sourceOfIncome
 *         - sourceOfIncomeOther
 *         - streetAddress
 *         - city
 *         - province
 *         - postalCode
 *         - country
 *         - isReplacingExistingPolicy
 *         - existingPolicyNumber
 *         - existingInsurerName
 *         - existingPolicyPaidUpToDate
 *         - existingPolicyWaitingPeriodExpired
 *         - sameBenefitAsExistingPolicy
 *         - benefitDifferenceNotes
 *         - occupation
 *         - workPhoneNumber
 *         - passportNumber
 *         - countryOfBirth
 *         - countryOfResidence
 *         - citizenship
 *         - nationality
 *         - isForeigner
 *         - workPermitNumber
 *         - status
 *         - paymentStatus
 *         - nextPaymentDate
 *         - isIdVerified
 *         - idVerifiedAt
 *         - isLifeVerified
 *         - lifeVerifiedAt
 *         - signatureDataUrl
 *         - signedAt
 *         - createdAt
 *         - updatedAt
 *         - createdBy
 *         - updatedBy
 *     CreateMemberDto:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         address:
 *           type: string
 *         title:
 *           type: string
 *         firstNames:
 *           type: string
 *         surname:
 *           type: string
 *         dateOfBirth:
 *           type: string
 *           format: date-time
 *         email:
 *           type: string
 *         phone1:
 *           type: string
 *         phone2:
 *           type: string
 *         identificationNumber:
 *           type: string
 *         sourceOfIncome:
 *           type: number
 *         sourceOfIncomeOther:
 *           type: string
 *         streetAddress:
 *           type: string
 *         city:
 *           type: string
 *         province:
 *           type: number
 *         postalCode:
 *           type: string
 *         isReplacingExistingPolicy:
 *           type: boolean
 *         existingPolicyNumber:
 *           type: string
 *         existingInsurerName:
 *           type: string
 *         existingPolicyPaidUpToDate:
 *           type: boolean
 *         existingPolicyWaitingPeriodExpired:
 *           type: boolean
 *         sameBenefitAsExistingPolicy:
 *           type: boolean
 *         benefitDifferenceNotes:
 *           type: string
 *         occupation:
 *           type: string
 *         workPhoneNumber:
 *           type: string
 *         passportNumber:
 *           type: string
 *         countryOfBirth:
 *           type: string
 *         countryOfResidence:
 *           type: string
 *         citizenship:
 *           type: string
 *         nationality:
 *           type: string
 *         isForeigner:
 *           type: boolean
 *         workPermitNumber:
 *           type: string
 *         policyId:
 *           type: string
 *           format: uuid
 *       required:
 *         - id
 *         - name
 *         - address
 *         - title
 *         - firstNames
 *         - surname
 *         - dateOfBirth
 *         - email
 *         - phone1
 *         - phone2
 *         - identificationNumber
 *         - sourceOfIncome
 *         - sourceOfIncomeOther
 *         - streetAddress
 *         - city
 *         - province
 *         - postalCode
 *         - isReplacingExistingPolicy
 *         - existingPolicyNumber
 *         - existingInsurerName
 *         - existingPolicyPaidUpToDate
 *         - existingPolicyWaitingPeriodExpired
 *         - sameBenefitAsExistingPolicy
 *         - benefitDifferenceNotes
 *         - occupation
 *         - workPhoneNumber
 *         - passportNumber
 *         - countryOfBirth
 *         - countryOfResidence
 *         - citizenship
 *         - nationality
 *         - isForeigner
 *         - workPermitNumber
 *         - policyId
 *     MemberBankingDetailDto:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         memberId:
 *           type: string
 *           format: uuid
 *         bankName:
 *           type: string
 *         accountNumber:
 *           type: string
 *         accountType:
 *           type: string
 *         branchCode:
 *           type: string
 *         branchName:
 *           type: string
 *         accountHolderName:
 *           type: string
 *         debitDay:
 *           type: number
 *         paymentMethod:
 *           type: number
 *         isVerified:
 *           type: boolean
 *         createdAt:
 *           type: string
 *           format: date-time
 *       required:
 *         - id
 *         - memberId
 *         - bankName
 *         - accountNumber
 *         - accountType
 *         - branchCode
 *         - branchName
 *         - accountHolderName
 *         - debitDay
 *         - paymentMethod
 *         - isVerified
 *         - createdAt
 *     CreateMemberBankingDetailDto:
 *       type: object
 *       properties:
 *         bankName:
 *           type: string
 *         accountNumber:
 *           type: string
 *         accountType:
 *           type: string
 *         branchCode:
 *           type: string
 *         branchName:
 *           type: string
 *         accountHolderName:
 *           type: string
 *         debitDay:
 *           type: number
 *         paymentMethod:
 *           type: number
 *       required:
 *         - bankName
 *         - accountNumber
 *         - accountType
 *         - branchCode
 *         - branchName
 *         - accountHolderName
 *         - debitDay
 *         - paymentMethod
 *     CheckIdNumberDto:
 *       type: object
 *       properties:
 *         IdNumber:
 *           type: string
 *       required:
 *         - IdNumber
 *     CheckIdNumberResponseDto:
 *       type: object
 *       properties:
 *         Exists:
 *           type: boolean
 *         IsMainMember:
 *           type: boolean
 *         HasUserAccount:
 *           type: boolean
 *         MemberId:
 *           type: string
 *           format: uuid
 *         MemberName:
 *           type: string
 *         ContactEmail:
 *           type: string
 *         ContactPhone:
 *           type: string
 *         Message:
 *           type: string
 *       required:
 *         - Exists
 *         - IsMainMember
 *         - HasUserAccount
 *         - MemberId
 *         - MemberName
 *         - ContactEmail
 *         - ContactPhone
 *         - Message
 *     RegisterNewMemberDto:
 *       type: object
 *       properties:
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         idNumber:
 *           type: string
 *         email:
 *           type: string
 *         phone:
 *           type: string
 *         dateOfBirth:
 *           type: string
 *           format: date-time
 *         address:
 *           type: string
 *       required:
 *         - firstName
 *         - lastName
 *         - idNumber
 *         - email
 *         - phone
 *         - dateOfBirth
 *         - address
 *     RequestDependentOtpDto:
 *       type: object
 *       properties:
 *         IdNumber:
 *           type: string
 *         ContactMethod:
 *           type: string
 *       required:
 *         - IdNumber
 *         - ContactMethod
 *     VerifyDependentOtpDto:
 *       type: object
 *       properties:
 *         IdNumber:
 *           type: string
 *         OtpCode:
 *           type: string
 *         Email:
 *           type: string
 *         Password:
 *           type: string
 *       required:
 *         - IdNumber
 *         - OtpCode
 *         - Email
 *         - Password
 *     PolicyOptionDto:
 *       type: object
 *       properties:
 *         coverAmount:
 *           type: number
 *         monthlyPremium:
 *           type: number
 *         description:
 *           type: string
 *         isRecommended:
 *           type: boolean
 *       required:
 *         - coverAmount
 *         - monthlyPremium
 *         - description
 *         - isRecommended
 *     DependentOtpRecord:
 *       type: object
 *       properties:
 *         Id:
 *           type: string
 *           format: uuid
 *         MainMemberId:
 *           type: string
 *           format: uuid
 *         IdNumber:
 *           type: string
 *         OtpCode:
 *           type: string
 *         ContactMethod:
 *           type: string
 *         ContactValue:
 *           type: string
 *         CreatedAt:
 *           type: string
 *           format: date-time
 *         ExpiresAt:
 *           type: string
 *           format: date-time
 *         IsUsed:
 *           type: boolean
 *       required:
 *         - Id
 *         - MainMemberId
 *         - IdNumber
 *         - OtpCode
 *         - ContactMethod
 *         - ContactValue
 *         - CreatedAt
 *         - ExpiresAt
 *         - IsUsed
 *     PolicyDto:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         tenantId:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         policyNumber:
 *           type: string
 *         description:
 *           type: string
 *         payoutAmount:
 *           type: number
 *         coverageAmount:
 *           type: number
 *         price:
 *           type: number
 *         waitingPeriodDays:
 *           type: number
 *         maxClaimAmount:
 *           type: number
 *         isActive:
 *           type: boolean
 *         status:
 *           type: string
 *         startDate:
 *           type: string
 *           format: date-time
 *         endDate:
 *           type: string
 *           format: date-time
 *         premiumAmount:
 *           type: number
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         createdBy:
 *           type: string
 *           format: uuid
 *         updatedBy:
 *           type: string
 *           format: uuid
 *       required:
 *         - id
 *         - tenantId
 *         - name
 *         - policyNumber
 *         - description
 *         - payoutAmount
 *         - coverageAmount
 *         - price
 *         - waitingPeriodDays
 *         - maxClaimAmount
 *         - isActive
 *         - status
 *         - startDate
 *         - endDate
 *         - premiumAmount
 *         - createdAt
 *         - updatedAt
 *         - createdBy
 *         - updatedBy
 *     ClaimDto:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         policyId:
 *           type: string
 *           format: uuid
 *         claimNumber:
 *           type: string
 *         claimDate:
 *           type: string
 *           format: date-time
 *         claimAmount:
 *           type: number
 *         status:
 *           type: string
 *         deceasedName:
 *           type: string
 *       required:
 *         - id
 *         - policyId
 *         - claimNumber
 *         - claimDate
 *         - claimAmount
 *         - status
 *         - deceasedName
 *     EnhancedClaimDto:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         policyId:
 *           type: string
 *           format: uuid
 *         claimNumber:
 *           type: string
 *         claimDate:
 *           type: string
 *           format: date-time
 *         claimAmount:
 *           type: number
 *         status:
 *           type: string
 *       required:
 *         - id
 *         - policyId
 *         - claimNumber
 *         - claimDate
 *         - claimAmount
 *         - status
 *     DashboardWidgetDto:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         type:
 *           type: string
 *         configuration:
 *           type: string
 *         isEnabled:
 *           type: boolean
 *         order:
 *           type: number
 *       required:
 *         - id
 *         - name
 *         - type
 *         - configuration
 *         - isEnabled
 *         - order
 *     ResourceDto:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         type:
 *           type: string
 *         description:
 *           type: string
 *         isAvailable:
 *           type: boolean
 *       required:
 *         - id
 *         - name
 *         - type
 *         - description
 *         - isAvailable
 *     FuneralEventDto:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         eventName:
 *           type: string
 *         eventDate:
 *           type: string
 *           format: date-time
 *         location:
 *           type: string
 *         description:
 *           type: string
 *       required:
 *         - id
 *         - eventName
 *         - eventDate
 *         - location
 *         - description
 *     TenantDto:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         domain:
 *           type: string
 *         email:
 *           type: string
 *         address:
 *           type: string
 *         phone1:
 *           type: string
 *         phone2:
 *           type: string
 *         registrationNumber:
 *           type: string
 *         type:
 *           type: string
 *       required:
 *         - id
 *         - name
 *         - domain
 *         - email
 *         - address
 *         - phone1
 *         - phone2
 *         - registrationNumber
 *         - type
 *     FileMetadataDto:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         fileName:
 *           type: string
 *         filePath:
 *           type: string
 *         contentType:
 *           type: string
 *         size:
 *           type: number
 *         uploadDate:
 *           type: string
 *           format: date-time
 *         tenantId:
 *           type: string
 *           format: uuid
 *       required:
 *         - id
 *         - fileName
 *         - filePath
 *         - contentType
 *         - size
 *         - uploadDate
 *         - tenantId
 *     RoleDto:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         permissions:
 *           type: array
 *           items:
 *             type: object
 *       required:
 *         - id
 *         - name
 *         - permissions
 *     PermissionDto:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *       required:
 *         - id
 *         - name
 *     DocumentRequirement:
 *       type: object
 *       properties:
 *         documentType:
 *           type: string
 *         documentName:
 *           type: string
 *         requirementReason:
 *           type: string
 *         isRequired:
 *           type: boolean
 *         isUploaded:
 *           type: boolean
 *         fileMetadataId:
 *           type: string
 *           format: uuid
 *         verificationStatus:
 *           type: string
 *       required:
 *         - documentType
 *         - documentName
 *         - requirementReason
 *         - isRequired
 *         - isUploaded
 *         - fileMetadataId
 *         - verificationStatus
 *     DocumentComplianceStatus:
 *       type: object
 *       properties:
 *         isCompliant:
 *           type: boolean
 *         totalRequired:
 *           type: number
 *         totalUploaded:
 *           type: number
 *         totalApproved:
 *           type: number
 *         missingDocuments:
 *           type: array
 *           items:
 *             type: object
 *         pendingVerification:
 *           type: array
 *           items:
 *             type: object
 *         rejectedDocuments:
 *           type: array
 *           items:
 *             type: object
 *       required:
 *         - isCompliant
 *         - totalRequired
 *         - totalUploaded
 *         - totalApproved
 *         - missingDocuments
 *         - pendingVerification
 *         - rejectedDocuments
 *     PolicyCoverAgeBracketDto:
 *       type: object
 *       properties:
 *         maxAge:
 *           type: number
 *         label:
 *           type: string
 *         premium:
 *           type: number
 *       required:
 *         - maxAge
 *         - label
 *         - premium
 *     DependentCountTierDto:
 *       type: object
 *       properties:
 *         minDependents:
 *           type: number
 *         maxDependents:
 *           type: number
 *         label:
 *           type: string
 *         ageBrackets:
 *           type: object
 *       required:
 *         - minDependents
 *         - maxDependents
 *         - label
 *         - ageBrackets
 *     PolicyCoverRowDto:
 *       type: object
 *       properties:
 *         coverAmount:
 *           type: number
 *         dependentCountTiers:
 *           type: array
 *           items:
 *             type: object
 *         ageBrackets:
 *           type: object
 *         premium_1To5Dependents_Under65:
 *           type: number
 *         premium_1To5Dependents_Under70:
 *           type: number
 *         premium_1To5Dependents_Under75:
 *           type: number
 *         premium_1To5Dependents_75Plus:
 *           type: number
 *       required:
 *         - coverAmount
 *         - dependentCountTiers
 *         - ageBrackets
 *         - premium_1To5Dependents_Under65
 *         - premium_1To5Dependents_Under70
 *         - premium_1To5Dependents_Under75
 *         - premium_1To5Dependents_75Plus
 *     PolicyCoverPremiumTableDto:
 *       type: object
 *       properties:
 *         rows:
 *           type: array
 *           items:
 *             type: object
 *       required:
 *         - rows
 *     ExtendedFamilyBenefitRowDto:
 *       type: object
 *       properties:
 *         minAge:
 *           type: number
 *         maxAge:
 *           type: number
 *         ageRange:
 *           type: string
 *         premium_5000_Cover:
 *           type: number
 *         premium_10000_Cover:
 *           type: number
 *         premium_15000_Cover:
 *           type: number
 *         premium_20000_Cover:
 *           type: number
 *         premium_25000_Cover:
 *           type: number
 *       required:
 *         - minAge
 *         - maxAge
 *         - ageRange
 *         - premium_5000_Cover
 *         - premium_10000_Cover
 *         - premium_15000_Cover
 *         - premium_20000_Cover
 *         - premium_25000_Cover
 *     ExtendedFamilyBenefitTableDto:
 *       type: object
 *       properties:
 *         rows:
 *           type: array
 *           items:
 *             type: object
 *       required:
 *         - rows
 *     PremiumCalculationSettingsDto:
 *       type: object
 *       properties:
 *         policyCoverTable:
 *           type: object
 *         extendedFamilyTable:
 *           type: object
 *         maxExtendedFamilyMembers:
 *           type: number
 *       required:
 *         - policyCoverTable
 *         - extendedFamilyTable
 *         - maxExtendedFamilyMembers
 *     DependentInfoDto:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         age:
 *           type: number
 *         dateOfBirth:
 *           type: string
 *           format: date-time
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *       required:
 *         - id
 *         - age
 *         - dateOfBirth
 *         - firstName
 *         - lastName
 *     BeneficiaryInfoDto:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         age:
 *           type: number
 *         dateOfBirth:
 *           type: string
 *           format: date-time
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *       required:
 *         - id
 *         - age
 *         - dateOfBirth
 *         - firstName
 *         - lastName
 *     CalculatePremiumRequestDto:
 *       type: object
 *       properties:
 *         coverAmount:
 *           type: number
 *         dependents:
 *           type: array
 *           items:
 *             type: object
 *         beneficiaries:
 *           type: array
 *           items:
 *             type: object
 *       required:
 *         - coverAmount
 *         - dependents
 *         - beneficiaries
 *     PremiumBreakdownItemDto:
 *       type: object
 *       properties:
 *         description:
 *           type: string
 *         amount:
 *           type: number
 *         category:
 *           type: string
 *         details:
 *           type: string
 *       required:
 *         - description
 *         - amount
 *         - category
 *         - details
 *     PremiumCalculationResultDto:
 *       type: object
 *       properties:
 *         basePremium:
 *           type: number
 *         extendedFamilyPremium:
 *           type: number
 *         totalMonthlyPremium:
 *           type: number
 *         breakdown:
 *           type: array
 *           items:
 *             type: object
 *         message:
 *           type: string
 *       required:
 *         - basePremium
 *         - extendedFamilyPremium
 *         - totalMonthlyPremium
 *         - breakdown
 *         - message
 *     RegisterRequest:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *         password:
 *           type: string
 *       required:
 *         - email
 *         - password
 *     TenantCreateUpdateDto:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         email:
 *           type: string
 *         password:
 *           type: string
 *         name:
 *           type: string
 *         domain:
 *           type: string
 *         address:
 *           type: string
 *         phone1:
 *           type: string
 *         phone2:
 *           type: string
 *         registrationNumber:
 *           type: string
 *         type:
 *           type: string
 *         subscriptionPlanId:
 *           type: string
 *           format: uuid
 *       required:
 *         - id
 *         - email
 *         - password
 *         - name
 *         - domain
 *         - address
 *         - phone1
 *         - phone2
 *         - registrationNumber
 *         - type
 *         - subscriptionPlanId
 *     LoginRequest:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *         password:
 *           type: string
 *       required:
 *         - email
 *         - password
 *     AuthResult:
 *       type: object
 *       properties:
 *         succeeded:
 *           type: boolean
 *         token:
 *           type: string
 *         refreshToken:
 *           type: string
 *         expiresAt:
 *           type: string
 *           format: date-time
 *         mustChangePassword:
 *           type: boolean
 *       required:
 *         - succeeded
 *         - token
 *         - refreshToken
 *         - expiresAt
 *         - mustChangePassword
 *     RefreshTokenRequest:
 *       type: object
 *       properties:
 *         refreshToken:
 *           type: string
 *       required:
 *         - refreshToken
 *     RevokeTokenRequest:
 *       type: object
 *       properties:
 *         refreshToken:
 *           type: string
 *       required:
 *         - refreshToken
 *     ForgotPasswordRequest:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *       required:
 *         - email
 *     ResetPasswordRequest:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *         code:
 *           type: string
 *         newPassword:
 *           type: string
 *       required:
 *         - email
 *         - code
 *         - newPassword
 *     ChangePasswordRequest:
 *       type: object
 *       properties:
 *         currentPassword:
 *           type: string
 *         newPassword:
 *           type: string
 *       required:
 *         - currentPassword
 *         - newPassword
 *     TermsAndConditionsDto:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         tenantId:
 *           type: string
 *           format: uuid
 *         title:
 *           type: string
 *         content:
 *           type: string
 *         version:
 *           type: string
 *         isActive:
 *           type: boolean
 *         effectiveDate:
 *           type: string
 *           format: date-time
 *         expiryDate:
 *           type: string
 *           format: date-time
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       required:
 *         - id
 *         - tenantId
 *         - title
 *         - content
 *         - version
 *         - isActive
 *         - effectiveDate
 *         - expiryDate
 *         - createdAt
 *         - updatedAt
 *     AcceptTermsDto:
 *       type: object
 *       properties:
 *         memberId:
 *           type: string
 *           format: uuid
 *         termsAndConditionsId:
 *           type: string
 *           format: uuid
 *         ipAddress:
 *           type: string
 *         userAgent:
 *           type: string
 *       required:
 *         - memberId
 *         - termsAndConditionsId
 *         - ipAddress
 *         - userAgent
 *     TermsAcceptanceDto:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         memberId:
 *           type: string
 *           format: uuid
 *         termsAndConditionsId:
 *           type: string
 *           format: uuid
 *         tenantId:
 *           type: string
 *           format: uuid
 *         acceptedAt:
 *           type: string
 *           format: date-time
 *         ipAddress:
 *           type: string
 *         userAgent:
 *           type: string
 *         acceptedVersion:
 *           type: string
 *       required:
 *         - id
 *         - memberId
 *         - termsAndConditionsId
 *         - tenantId
 *         - acceptedAt
 *         - ipAddress
 *         - userAgent
 *         - acceptedVersion
 *     RequiredDocumentDto:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         tenantId:
 *           type: string
 *           format: uuid
 *         documentName:
 *           type: string
 *         description:
 *           type: string
 *         documentType:
 *           type: string
 *         entityType:
 *           type: string
 *         isRequired:
 *           type: boolean
 *         isActive:
 *           type: boolean
 *         allowedFileTypes:
 *           type: string
 *         maxFileSizeBytes:
 *           type: number
 *         createdBy:
 *           type: string
 *           format: uuid
 *         updatedBy:
 *           type: string
 *           format: uuid
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       required:
 *         - id
 *         - tenantId
 *         - documentName
 *         - description
 *         - documentType
 *         - entityType
 *         - isRequired
 *         - isActive
 *         - allowedFileTypes
 *         - maxFileSizeBytes
 *         - createdBy
 *         - updatedBy
 *         - createdAt
 *         - updatedAt
 *     MemberDocumentStatusDto:
 *       type: object
 *       properties:
 *         memberId:
 *           type: string
 *           format: uuid
 *         totalRequired:
 *           type: number
 *         totalUploaded:
 *           type: number
 *         documents:
 *           type: array
 *           items:
 *             type: object
 *       required:
 *         - memberId
 *         - totalRequired
 *         - totalUploaded
 *         - documents
 *     OnboardingFieldConfigurationDto:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         tenantId:
 *           type: string
 *           format: uuid
 *         fieldName:
 *           type: string
 *         displayLabel:
 *           type: string
 *         fieldType:
 *           type: string
 *         category:
 *           type: string
 *         displayOrder:
 *           type: number
 *         isRequired:
 *           type: boolean
 *         isEnabled:
 *           type: boolean
 *         placeholder:
 *           type: string
 *         helpText:
 *           type: string
 *         validationRules:
 *           type: string
 *         options:
 *           type: string
 *         defaultValue:
 *           type: string
 *       required:
 *         - id
 *         - tenantId
 *         - fieldName
 *         - displayLabel
 *         - fieldType
 *         - category
 *         - displayOrder
 *         - isRequired
 *         - isEnabled
 *         - placeholder
 *         - helpText
 *         - validationRules
 *         - options
 *         - defaultValue
 *     CreateOnboardingFieldConfigurationDto:
 *       type: object
 *       properties:
 *         fieldName:
 *           type: string
 *         displayLabel:
 *           type: string
 *         fieldType:
 *           type: string
 *         category:
 *           type: string
 *         displayOrder:
 *           type: number
 *         isRequired:
 *           type: boolean
 *         isEnabled:
 *           type: boolean
 *         placeholder:
 *           type: string
 *         helpText:
 *           type: string
 *         validationRules:
 *           type: string
 *         options:
 *           type: string
 *         defaultValue:
 *           type: string
 *       required:
 *         - fieldName
 *         - displayLabel
 *         - fieldType
 *         - category
 *         - displayOrder
 *         - isRequired
 *         - isEnabled
 *         - placeholder
 *         - helpText
 *         - validationRules
 *         - options
 *         - defaultValue
 *     UpdateOnboardingFieldConfigurationDto:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         fieldName:
 *           type: string
 *         displayLabel:
 *           type: string
 *         fieldType:
 *           type: string
 *         category:
 *           type: string
 *         displayOrder:
 *           type: number
 *         isRequired:
 *           type: boolean
 *         isEnabled:
 *           type: boolean
 *         placeholder:
 *           type: string
 *         helpText:
 *           type: string
 *         validationRules:
 *           type: string
 *         options:
 *           type: string
 *         defaultValue:
 *           type: string
 *       required:
 *         - id
 *         - fieldName
 *         - displayLabel
 *         - fieldType
 *         - category
 *         - displayOrder
 *         - isRequired
 *         - isEnabled
 *         - placeholder
 *         - helpText
 *         - validationRules
 *         - options
 *         - defaultValue
 *     UpdateFieldOrderDto:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         displayOrder:
 *           type: number
 *       required:
 *         - id
 *         - displayOrder
 *     SaveMemberOnboardingDataDto:
 *       type: object
 *       properties:
 *         data:
 *           type: object
 *       required:
 *         - data
 *     MemberOnboardingDataDto:
 *       type: object
 *       properties:
 *         memberId:
 *           type: string
 *           format: uuid
 *         data:
 *           type: object
 *       required:
 *         - memberId
 *         - data
 *     SubscriptionPlanDto:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         monthlyPrice:
 *           type: number
 *         allowedTenantType:
 *           type: string
 *         features:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         createdBy:
 *           type: string
 *           format: uuid
 *         updatedBy:
 *           type: string
 *           format: uuid
 *       required:
 *         - id
 *         - name
 *         - description
 *         - monthlyPrice
 *         - allowedTenantType
 *         - features
 *         - createdAt
 *         - updatedAt
 *         - createdBy
 *         - updatedBy
 *     UserDto:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         email:
 *           type: string
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         phoneNumber:
 *           type: string
 *         address:
 *           type: string
 *         idNumber:
 *           type: string
 *         tenantId:
 *           type: string
 *           format: uuid
 *         mustChangePassword:
 *           type: boolean
 *         isIdVerified:
 *           type: boolean
 *         idVerifiedAt:
 *           type: string
 *           format: date-time
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         createdBy:
 *           type: string
 *           format: uuid
 *         updatedBy:
 *           type: string
 *           format: uuid
 *       required:
 *         - id
 *         - email
 *         - firstName
 *         - lastName
 *         - phoneNumber
 *         - address
 *         - idNumber
 *         - tenantId
 *         - mustChangePassword
 *         - isIdVerified
 *         - idVerifiedAt
 *         - createdAt
 *         - updatedAt
 *         - createdBy
 *         - updatedBy
 *     UserProfileDto:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         email:
 *           type: string
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         phoneNumber:
 *           type: string
 *         tenantId:
 *           type: string
 *           format: uuid
 *         roles:
 *           type: array
 *           items:
 *             type: object
 *       required:
 *         - id
 *         - email
 *         - firstName
 *         - lastName
 *         - phoneNumber
 *         - tenantId
 *         - roles
 *     UpdateUserProfileDto:
 *       type: object
 *       properties:
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         phoneNumber:
 *           type: string
 *         address:
 *           type: string
 *         idNumber:
 *           type: string
 *         dateOfBirth:
 *           type: string
 *           format: date-time
 *       required:
 *         - firstName
 *         - lastName
 *         - phoneNumber
 *         - address
 *         - idNumber
 *         - dateOfBirth
 *     UserRoleDto:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         userId:
 *           type: string
 *           format: uuid
 *         roleId:
 *           type: string
 *           format: uuid
 *         roleName:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       required:
 *         - id
 *         - userId
 *         - roleId
 *         - roleName
 *         - createdAt
 *         - updatedAt
 *     UserRoleInputDto:
 *       type: object
 *       properties:
 *         userId:
 *           type: string
 *           format: uuid
 *         roleId:
 *           type: string
 *           format: uuid
 *       required:
 *         - userId
 *         - roleId
 *     CreateAssetDto:
 *       type: object
 *       properties:
 *         tenantId:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         assetType:
 *           type: string
 *         identificationNumber:
 *           type: string
 *         make:
 *           type: string
 *         model:
 *           type: string
 *         year:
 *           type: string
 *         quantity:
 *           type: string
 *         status:
 *           type: string
 *         currentLocation:
 *           type: string
 *         requiresInspection:
 *           type: boolean
 *         inspectionCheckpointsJson:
 *           type: string
 *         lastMaintenanceDate:
 *           type: string
 *           format: date-time
 *         nextMaintenanceDate:
 *           type: string
 *           format: date-time
 *         purchaseDate:
 *           type: string
 *           format: date-time
 *         purchaseCost:
 *           type: number
 *         conditionNotes:
 *           type: string
 *       required:
 *         - tenantId
 *         - name
 *         - description
 *         - assetType
 *         - identificationNumber
 *         - make
 *         - model
 *         - year
 *         - quantity
 *         - status
 *         - currentLocation
 *         - requiresInspection
 *         - inspectionCheckpointsJson
 *         - lastMaintenanceDate
 *         - nextMaintenanceDate
 *         - purchaseDate
 *         - purchaseCost
 *         - conditionNotes
 *     UpdateAssetDto:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         assetType:
 *           type: string
 *         identificationNumber:
 *           type: string
 *         make:
 *           type: string
 *         model:
 *           type: string
 *         year:
 *           type: string
 *         quantity:
 *           type: string
 *         status:
 *           type: string
 *         currentLocation:
 *           type: string
 *         requiresInspection:
 *           type: boolean
 *         inspectionCheckpointsJson:
 *           type: string
 *         lastMaintenanceDate:
 *           type: string
 *           format: date-time
 *         nextMaintenanceDate:
 *           type: string
 *           format: date-time
 *         purchaseDate:
 *           type: string
 *           format: date-time
 *         purchaseCost:
 *           type: number
 *         conditionNotes:
 *           type: string
 *       required:
 *         - id
 *         - name
 *         - description
 *         - assetType
 *         - identificationNumber
 *         - make
 *         - model
 *         - year
 *         - quantity
 *         - status
 *         - currentLocation
 *         - requiresInspection
 *         - inspectionCheckpointsJson
 *         - lastMaintenanceDate
 *         - nextMaintenanceDate
 *         - purchaseDate
 *         - purchaseCost
 *         - conditionNotes
 *     AssetCheckoutDto:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         tenantId:
 *           type: string
 *           format: uuid
 *         assetId:
 *           type: string
 *           format: uuid
 *         userId:
 *           type: string
 *           format: uuid
 *         checkoutDate:
 *           type: string
 *           format: date-time
 *         returnDate:
 *           type: string
 *           format: date-time
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         createdBy:
 *           type: string
 *           format: uuid
 *         updatedBy:
 *           type: string
 *           format: uuid
 *       required:
 *         - id
 *         - tenantId
 *         - assetId
 *         - userId
 *         - checkoutDate
 *         - returnDate
 *         - createdAt
 *         - updatedAt
 *         - createdBy
 *         - updatedBy
 *     CheckoutAssetDto:
 *       type: object
 *       properties:
 *         assetId:
 *           type: string
 *           format: uuid
 *         userId:
 *           type: string
 *           format: uuid
 *         checkoutDate:
 *           type: string
 *           format: date-time
 *         returnDate:
 *           type: string
 *           format: date-time
 *         purpose:
 *           type: string
 *         destination:
 *           type: string
 *         expectedReturnDate:
 *           type: string
 *           format: date-time
 *         startingOdometer:
 *           type: number
 *         fuelLevelCheckout:
 *           type: number
 *         checkoutNotes:
 *           type: string
 *       required:
 *         - assetId
 *         - userId
 *         - checkoutDate
 *         - returnDate
 *         - purpose
 *         - destination
 *         - expectedReturnDate
 *         - startingOdometer
 *         - fuelLevelCheckout
 *         - checkoutNotes
 *     CheckinAssetDto:
 *       type: object
 *       properties:
 *         assetId:
 *           type: string
 *           format: uuid
 *         userId:
 *           type: string
 *           format: uuid
 *         returnDate:
 *           type: string
 *           format: date-time
 *         conditionNotes:
 *           type: string
 *         endingOdometer:
 *           type: number
 *         fuelLevelCheckin:
 *           type: number
 *         returnedInGoodCondition:
 *           type: boolean
 *         damageReported:
 *           type: boolean
 *         checkinNotes:
 *           type: string
 *         checkoutId:
 *           type: string
 *           format: uuid
 *       required:
 *         - assetId
 *         - userId
 *         - returnDate
 *         - conditionNotes
 *         - endingOdometer
 *         - fuelLevelCheckin
 *         - returnedInGoodCondition
 *         - damageReported
 *         - checkinNotes
 *         - checkoutId
 *     AssetStatsDto:
 *       type: object
 *       properties:
 *         totalAssets:
 *           type: string
 *         availableAssets:
 *           type: string
 *         checkedOutAssets:
 *           type: string
 *         underMaintenanceAssets:
 *           type: string
 *         retiredAssets:
 *           type: string
 *         overdueCheckouts:
 *           type: string
 *       required:
 *         - totalAssets
 *         - availableAssets
 *         - checkedOutAssets
 *         - underMaintenanceAssets
 *         - retiredAssets
 *         - overdueCheckouts
 *     UpdateProfileCompletionStepDto:
 *       type: object
 *       properties:
 *         memberId:
 *           type: string
 *           format: uuid
 *         stepName:
 *           type: string
 *         isCompleted:
 *           type: boolean
 *       required:
 *         - memberId
 *         - stepName
 *         - isCompleted
 *     MemberProfileCompletionDto:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         memberId:
 *           type: string
 *           format: uuid
 *         hasDependents:
 *           type: boolean
 *         hasBeneficiaries:
 *           type: boolean
 *         hasUploadedIdDocument:
 *           type: boolean
 *         hasAcceptedTerms:
 *           type: boolean
 *         hasCompletedCustomForms:
 *           type: boolean
 *         hasUploadedRequiredDocuments:
 *           type: boolean
 *         isProfileComplete:
 *           type: boolean
 *         profileCompletedAt:
 *           type: string
 *           format: date-time
 *         completionPercentage:
 *           type: number
 *         nextStepRecommendation:
 *           type: string
 *       required:
 *         - id
 *         - memberId
 *         - hasDependents
 *         - hasBeneficiaries
 *         - hasUploadedIdDocument
 *         - hasAcceptedTerms
 *         - hasCompletedCustomForms
 *         - hasUploadedRequiredDocuments
 *         - isProfileComplete
 *         - profileCompletedAt
 *         - completionPercentage
 *         - nextStepRecommendation
 *     ProfileCompletionStatusDto:
 *       type: object
 *       properties:
 *         isComplete:
 *           type: boolean
 *         completionPercentage:
 *           type: number
 *         completedSteps:
 *           type: array
 *           items:
 *             type: object
 *         remainingSteps:
 *           type: array
 *           items:
 *             type: object
 *         nextStepRecommendation:
 *           type: string
 *         profileCompletion:
 *           type: object
 *         dependentsCount:
 *           type: number
 *         beneficiariesCount:
 *           type: number
 *         uploadedDocumentsCount:
 *           type: number
 *         requiredDocumentsCount:
 *           type: number
 *         hasAcceptedLatestTerms:
 *           type: boolean
 *       required:
 *         - isComplete
 *         - completionPercentage
 *         - completedSteps
 *         - remainingSteps
 *         - nextStepRecommendation
 *         - profileCompletion
 *         - dependentsCount
 *         - beneficiariesCount
 *         - uploadedDocumentsCount
 *         - requiredDocumentsCount
 *         - hasAcceptedLatestTerms
 *     MemberDocumentType:
 *       type: integer
 *       enum:
 *         - 1
 *         - 2
 *         - 3
 *         - 4
 *         - 5
 *         - 6
 *         - 7
 *         - 8
 *         - 99
 *       x-enum-varnames:
 *         - IdentificationDocument
 *         - ProofOfAddress
 *         - MarriageCertificate
 *         - Passport
 *         - WorkPermit
 *         - BirthCertificate
 *         - DeathCertificate
 *         - BankingDocument
 *         - Other
 *     DocumentVerificationStatus:
 *       type: integer
 *       enum:
 *         - 0
 *         - 1
 *         - 2
 *         - 3
 *       x-enum-varnames:
 *         - Pending
 *         - Approved
 *         - Rejected
 *         - RequiresResubmission
 *     MemberStatus:
 *       type: integer
 *       enum:
 *         - 0
 *         - 1
 *         - 2
 *         - 3
 *         - 4
 *       x-enum-varnames:
 *         - PendingApproval
 *         - Active
 *         - Suspended
 *         - Inactive
 *         - Rejected
 *     DependentType:
 *       type: integer
 *       enum:
 *         - 1
 *         - 2
 *         - 3
 *         - 4
 *         - 5
 *       x-enum-varnames:
 *         - Spouse
 *         - Child
 *         - ExtendedFamily
 *         - Parent
 *         - Other
 *     AssetType:
 *       type: integer
 *       enum:
 *         - 0
 *         - 1
 *         - 2
 *         - 3
 *         - 4
 *         - 5
 *         - 6
 *       x-enum-varnames:
 *         - Vehicle
 *         - Tent
 *         - Equipment
 *         - Refrigeration
 *         - Furniture
 *         - Tools
 *         - Other
 *     AssetStatus:
 *       type: integer
 *       enum:
 *         - 0
 *         - 1
 *         - 2
 *         - 3
 *         - 4
 *       x-enum-varnames:
 *         - Available
 *         - CheckedOut
 *         - UnderMaintenance
 *         - OutOfService
 *         - Retired
 *     CheckoutStatus:
 *       type: integer
 *       enum:
 *         - 0
 *         - 1
 *         - 2
 *         - 3
 *       x-enum-varnames:
 *         - Active
 *         - Returned
 *         - Overdue
 *         - Cancelled
 */
export {};
