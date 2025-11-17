const fs = require('fs');
const path = require('path');

// Read all C# DTO files
const csharpDtosDir = path.join(__dirname, '../Funeral/Dtos');
const outputDir = path.join(__dirname, 'src/schemas');

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Generate a basic schema for all DTOs
const allSchemas = {
    'TenantSettingDto': {
        id: 'string (uuid)',
        settings: 'string',
        ozowApiKey: 'string',
        ozowSiteCode: 'string',
        ozowPrivateKey: 'string',
        logo: 'string',
        favicon: 'string',
        tenantName: 'string',
        tenantDomain: 'string'
    },
    'BeneficiaryDto': {
        id: 'string (uuid)',
        tenantId: 'string (uuid)',
        memberId: 'string (uuid)',
        name: 'string',
        email: 'string',
        address: 'string',
        phone1: 'string',
        phone2: 'string',
        identificationNumber: 'string',
        relationship: 'string',
        benefitPercentage: 'number',
        isVerified: 'boolean',
        verifiedAt: 'string (date-time)',
        createdAt: 'string (date-time)',
        updatedAt: 'string (date-time)',
        createdBy: 'string (uuid)',
        updatedBy: 'string (uuid)'
    },
    'DependentDto': {
        id: 'string (uuid)',
        tenantId: 'string (uuid)',
        memberId: 'string (uuid)',
        name: 'string',
        email: 'string',
        address: 'string',
        phone1: 'string',
        phone2: 'string',
        identificationNumber: 'string',
        dependentType: 'string',
        dateOfBirth: 'string (date-time)',
        createdAt: 'string (date-time)',
        updatedAt: 'string (date-time)',
        createdBy: 'string (uuid)',
        updatedBy: 'string (uuid)'
    },
    'MemberDto': {
        id: 'string (uuid)',
        tenantId: 'string (uuid)',
        name: 'string',
        address: 'string',
        title: 'string',
        firstNames: 'string',
        surname: 'string',
        dateOfBirth: 'string (date-time)',
        email: 'string',
        phone1: 'string',
        phone2: 'string',
        identificationNumber: 'string',
        sourceOfIncome: 'string',
        sourceOfIncomeOther: 'string',
        streetAddress: 'string',
        city: 'string',
        province: 'string',
        postalCode: 'string',
        country: 'string',
        isReplacingExistingPolicy: 'boolean',
        existingPolicyNumber: 'string',
        existingInsurerName: 'string',
        existingPolicyPaidUpToDate: 'boolean',
        existingPolicyWaitingPeriodExpired: 'boolean',
        sameBenefitAsExistingPolicy: 'boolean',
        benefitDifferenceNotes: 'string',
        occupation: 'string',
        workPhoneNumber: 'string',
        passportNumber: 'string',
        countryOfBirth: 'string',
        countryOfResidence: 'string',
        citizenship: 'string',
        nationality: 'string',
        isForeigner: 'boolean',
        workPermitNumber: 'string',
        status: 'string',
        paymentStatus: 'string',
        nextPaymentDate: 'string (date-time)',
        isIdVerified: 'boolean',
        idVerifiedAt: 'string (date-time)',
        isLifeVerified: 'boolean',
        lifeVerifiedAt: 'string (date-time)',
        signatureDataUrl: 'string',
        signedAt: 'string (date-time)',
        createdAt: 'string (date-time)',
        updatedAt: 'string (date-time)',
        createdBy: 'string (uuid)',
        updatedBy: 'string (uuid)'
    },
    'CreateMemberDto': {
        id: 'string (uuid)',
        name: 'string',
        address: 'string',
        title: 'string',
        firstNames: 'string',
        surname: 'string',
        dateOfBirth: 'string (date-time)',
        email: 'string',
        phone1: 'string',
        phone2: 'string',
        identificationNumber: 'string',
        sourceOfIncome: 'number',
        sourceOfIncomeOther: 'string',
        streetAddress: 'string',
        city: 'string',
        province: 'number',
        postalCode: 'string',
        isReplacingExistingPolicy: 'boolean',
        existingPolicyNumber: 'string',
        existingInsurerName: 'string',
        existingPolicyPaidUpToDate: 'boolean',
        existingPolicyWaitingPeriodExpired: 'boolean',
        sameBenefitAsExistingPolicy: 'boolean',
        benefitDifferenceNotes: 'string',
        occupation: 'string',
        workPhoneNumber: 'string',
        passportNumber: 'string',
        countryOfBirth: 'string',
        countryOfResidence: 'string',
        citizenship: 'string',
        nationality: 'string',
        isForeigner: 'boolean',
        workPermitNumber: 'string',
        policyId: 'string (uuid)'
    },
    'MemberBankingDetailDto': {
        id: 'string (uuid)',
        memberId: 'string (uuid)',
        bankName: 'string',
        accountNumber: 'string',
        accountType: 'string',
        branchCode: 'string',
        branchName: 'string',
        accountHolderName: 'string',
        debitDay: 'number',
        paymentMethod: 'number',
        isVerified: 'boolean',
        createdAt: 'string (date-time)'
    },
    'CreateMemberBankingDetailDto': {
        bankName: 'string',
        accountNumber: 'string',
        accountType: 'string',
        branchCode: 'string',
        branchName: 'string',
        accountHolderName: 'string',
        debitDay: 'number',
        paymentMethod: 'number'
    },
    'CheckIdNumberDto': {
        IdNumber: 'string'
    },
    'CheckIdNumberResponseDto': {
        Exists: 'boolean',
        IsMainMember: 'boolean',
        HasUserAccount: 'boolean',
        MemberId: 'string (uuid)',
        MemberName: 'string',
        ContactEmail: 'string',
        ContactPhone: 'string',
        Message: 'string'
    },
    'RegisterNewMemberDto': {
        IdNumber: 'string',
        Email: 'string',
        Password: 'string',
        FirstNames: 'string',
        Surname: 'string',
        PhoneNumber: 'string',
        SelectedCoverAmount: 'number',
        DateOfBirth: 'string (date-time)'
    },
    'RequestDependentOtpDto': {
        IdNumber: 'string',
        ContactMethod: 'string'
    },
    'VerifyDependentOtpDto': {
        IdNumber: 'string',
        OtpCode: 'string',
        Email: 'string',
        Password: 'string'
    },
    'PolicyOptionDto': {
        CoverAmount: 'number',
        MonthlyPremium: 'number',
        Description: 'string',
        IsRecommended: 'boolean'
    },
    'DependentOtpRecord': {
        Id: 'string (uuid)',
        MainMemberId: 'string (uuid)',
        IdNumber: 'string',
        OtpCode: 'string',
        ContactMethod: 'string',
        ContactValue: 'string',
        CreatedAt: 'string (date-time)',
        ExpiresAt: 'string (date-time)',
        IsUsed: 'boolean'
    },
    'PolicyDto': {
        id: 'string (uuid)',
        tenantId: 'string (uuid)',
        name: 'string',
        policyNumber: 'string',
        description: 'string',
        payoutAmount: 'number',
        coverageAmount: 'number',
        price: 'number',
        waitingPeriodDays: 'number',
        maxClaimAmount: 'number',
        isActive: 'boolean',
        status: 'string',
        startDate: 'string (date-time)',
        endDate: 'string (date-time)',
        premiumAmount: 'number',
        createdAt: 'string (date-time)',
        updatedAt: 'string (date-time)',
        createdBy: 'string (uuid)',
        updatedBy: 'string (uuid)'
    },
    'ClaimDto': {
        id: 'string (uuid)',
        policyId: 'string (uuid)',
        claimNumber: 'string',
        claimDate: 'string (date-time)',
        claimAmount: 'number',
        status: 'string',
        deceasedName: 'string'
    },
    'EnhancedClaimDto': {
        id: 'string (uuid)',
        policyId: 'string (uuid)',
        claimNumber: 'string',
        claimDate: 'string (date-time)',
        claimAmount: 'number',
        status: 'string'
    },
    'DashboardWidgetDto': {
        id: 'string (uuid)',
        name: 'string',
        type: 'string',
        configuration: 'string',
        isEnabled: 'boolean',
        order: 'number'
    },
    'ResourceDto': {
        id: 'string (uuid)',
        name: 'string',
        type: 'string',
        description: 'string',
        isAvailable: 'boolean'
    },
    'FuneralEventDto': {
        id: 'string (uuid)',
        eventName: 'string',
        eventDate: 'string (date-time)',
        location: 'string',
        description: 'string'
    },
    'RegisterNewMemberDto': {
        firstName: 'string',
        lastName: 'string',
        idNumber: 'string',
        email: 'string',
        phone: 'string',
        dateOfBirth: 'string (date-time)',
        address: 'string'
    },
    'TenantDto': {
        id: 'string (uuid)',
        name: 'string',
        domain: 'string',
        email: 'string',
        address: 'string',
        phone1: 'string',
        phone2: 'string',
        registrationNumber: 'string',
        type: 'string'
    },
    'FileMetadataDto': {
        id: 'string (uuid)',
        fileName: 'string',
        filePath: 'string',
        contentType: 'string',
        size: 'number',
        uploadDate: 'string (date-time)',
        tenantId: 'string (uuid)'
    },
    'RoleDto': {
        id: 'string (uuid)',
        name: 'string',
        permissions: 'array'
    },
    'PermissionDto': {
        id: 'string (uuid)',
        name: 'string'
    },
    // Document Requirement DTOs
    'DocumentRequirement': {
        documentType: 'string',
        documentName: 'string',
        requirementReason: 'string',
        isRequired: 'boolean',
        isUploaded: 'boolean',
        fileMetadataId: 'string (uuid)',
        verificationStatus: 'string'
    },
    'DocumentComplianceStatus': {
        isCompliant: 'boolean',
        totalRequired: 'number',
        totalUploaded: 'number',
        totalApproved: 'number',
        missingDocuments: 'array',
        pendingVerification: 'array',
        rejectedDocuments: 'array'
    },
    // Premium Calculation DTOs
    'PolicyCoverAgeBracketDto': {
        maxAge: 'number',
        label: 'string',
        premium: 'number'
    },
    'DependentCountTierDto': {
        minDependents: 'number',
        maxDependents: 'number',
        label: 'string',
        ageBrackets: 'object'
    },
    'PolicyCoverRowDto': {
        coverAmount: 'number',
        dependentCountTiers: 'array',
        ageBrackets: 'object',
        premium_1To5Dependents_Under65: 'number',
        premium_1To5Dependents_Under70: 'number',
        premium_1To5Dependents_Under75: 'number',
        premium_1To5Dependents_75Plus: 'number'
    },
    'PolicyCoverPremiumTableDto': {
        rows: 'array'
    },
    'ExtendedFamilyBenefitRowDto': {
        minAge: 'number',
        maxAge: 'number',
        ageRange: 'string',
        premium_5000_Cover: 'number',
        premium_10000_Cover: 'number',
        premium_15000_Cover: 'number',
        premium_20000_Cover: 'number',
        premium_25000_Cover: 'number'
    },
    'ExtendedFamilyBenefitTableDto': {
        rows: 'array'
    },
    'PremiumCalculationSettingsDto': {
        policyCoverTable: 'object',
        extendedFamilyTable: 'object',
        maxExtendedFamilyMembers: 'number'
    },
    'DependentInfoDto': {
        id: 'string (uuid)',
        age: 'number',
        dateOfBirth: 'string (date-time)',
        firstName: 'string',
        lastName: 'string'
    },
    'BeneficiaryInfoDto': {
        id: 'string (uuid)',
        age: 'number',
        dateOfBirth: 'string (date-time)',
        firstName: 'string',
        lastName: 'string'
    },
    'CalculatePremiumRequestDto': {
        coverAmount: 'number',
        dependents: 'array',
        beneficiaries: 'array'
    },
    'PremiumBreakdownItemDto': {
        description: 'string',
        amount: 'number',
        category: 'string',
        details: 'string'
    },
    'PremiumCalculationResultDto': {
        basePremium: 'number',
        extendedFamilyPremium: 'number',
        totalMonthlyPremium: 'number',
        breakdown: 'array',
        message: 'string'
    },
    'PolicyOptionDto': {
        coverAmount: 'number',
        monthlyPremium: 'number',
        description: 'string',
        isRecommended: 'boolean'
    },
    // Auth DTOs
    'RegisterRequest': {
        email: 'string',
        password: 'string'
    },
    'TenantCreateUpdateDto': {
        id: 'string (uuid)',
        email: 'string',
        password: 'string',
        name: 'string',
        domain: 'string',
        address: 'string',
        phone1: 'string',
        phone2: 'string',
        registrationNumber: 'string',
        type: 'string',
        subscriptionPlanId: 'string (uuid)'
    },
    'LoginRequest': {
        email: 'string',
        password: 'string'
    },
    'AuthResult': {
        succeeded: 'boolean',
        token: 'string',
        refreshToken: 'string',
        expiresAt: 'string (date-time)',
        mustChangePassword: 'boolean'
    },
    'RefreshTokenRequest': {
        refreshToken: 'string'
    },
    'RevokeTokenRequest': {
        refreshToken: 'string'
    },
    'ForgotPasswordRequest': {
        email: 'string'
    },
    'ResetPasswordRequest': {
        email: 'string',
        code: 'string',
        newPassword: 'string'
    },
    'ChangePasswordRequest': {
        currentPassword: 'string',
        newPassword: 'string'
    },
    // Terms DTOs
    'TermsAndConditionsDto': {
        id: 'string (uuid)',
        tenantId: 'string (uuid)',
        title: 'string',
        content: 'string',
        version: 'string',
        isActive: 'boolean',
        effectiveDate: 'string (date-time)',
        expiryDate: 'string (date-time)',
        createdAt: 'string (date-time)',
        updatedAt: 'string (date-time)'
    },
    'AcceptTermsDto': {
        memberId: 'string (uuid)',
        termsAndConditionsId: 'string (uuid)',
        ipAddress: 'string',
        userAgent: 'string'
    },
    'TermsAcceptanceDto': {
        id: 'string (uuid)',
        memberId: 'string (uuid)',
        termsAndConditionsId: 'string (uuid)',
        tenantId: 'string (uuid)',
        acceptedAt: 'string (date-time)',
        ipAddress: 'string',
        userAgent: 'string',
        acceptedVersion: 'string'
    },
    'RequiredDocumentDto': {
        id: 'string (uuid)',
        tenantId: 'string (uuid)',
        documentName: 'string',
        description: 'string',
        documentType: 'string',
        entityType: 'string',
        isRequired: 'boolean',
        isActive: 'boolean',
        allowedFileTypes: 'string',
        maxFileSizeBytes: 'number',
        createdBy: 'string (uuid)',
        updatedBy: 'string (uuid)',
        createdAt: 'string (date-time)',
        updatedAt: 'string (date-time)'
    },
    'MemberDocumentStatusDto': {
        memberId: 'string (uuid)',
        totalRequired: 'number',
        totalUploaded: 'number',
        documents: 'array'
    },
    'OnboardingFieldConfigurationDto': {
        id: 'string (uuid)',
        tenantId: 'string (uuid)',
        fieldName: 'string',
        displayLabel: 'string',
        fieldType: 'string',
        category: 'string',
        displayOrder: 'number',
        isRequired: 'boolean',
        isEnabled: 'boolean',
        placeholder: 'string',
        helpText: 'string',
        validationRules: 'string',
        options: 'string',
        defaultValue: 'string'
    },
    'CreateOnboardingFieldConfigurationDto': {
        fieldName: 'string',
        displayLabel: 'string',
        fieldType: 'string',
        category: 'string',
        displayOrder: 'number',
        isRequired: 'boolean',
        isEnabled: 'boolean',
        placeholder: 'string',
        helpText: 'string',
        validationRules: 'string',
        options: 'string',
        defaultValue: 'string'
    },
    'UpdateOnboardingFieldConfigurationDto': {
        id: 'string (uuid)',
        fieldName: 'string',
        displayLabel: 'string',
        fieldType: 'string',
        category: 'string',
        displayOrder: 'number',
        isRequired: 'boolean',
        isEnabled: 'boolean',
        placeholder: 'string',
        helpText: 'string',
        validationRules: 'string',
        options: 'string',
        defaultValue: 'string'
    },
    'UpdateFieldOrderDto': {
        id: 'string (uuid)',
        displayOrder: 'number'
    },
    'SaveMemberOnboardingDataDto': {
        data: 'object'
    },
    'MemberOnboardingDataDto': {
        memberId: 'string (uuid)',
        data: 'object'
    },
    'SubscriptionPlanDto': {
        id: 'string (uuid)',
        name: 'string',
        description: 'string',
        monthlyPrice: 'number',
        allowedTenantType: 'string',
        features: 'string',
        createdAt: 'string (date-time)',
        updatedAt: 'string (date-time)',
        createdBy: 'string (uuid)',
        updatedBy: 'string (uuid)'
    },
    'UserDto': {
        id: 'string (uuid)',
        email: 'string',
        firstName: 'string',
        lastName: 'string',
        phoneNumber: 'string',
        address: 'string',
        idNumber: 'string',
        tenantId: 'string (uuid)',
        mustChangePassword: 'boolean',
        isIdVerified: 'boolean',
        idVerifiedAt: 'string (date-time)',
        createdAt: 'string (date-time)',
        updatedAt: 'string (date-time)',
        createdBy: 'string (uuid)',
        updatedBy: 'string (uuid)'
    },
    'UserProfileDto': {
        id: 'string (uuid)',
        email: 'string',
        firstName: 'string',
        lastName: 'string',
        phoneNumber: 'string',
        tenantId: 'string (uuid)',
        roles: 'array'
    },
    'UpdateUserProfileDto': {
        firstName: 'string',
        lastName: 'string',
        phoneNumber: 'string',
        address: 'string',
        idNumber: 'string',
        dateOfBirth: 'string (date-time)'
    },
    'UserRoleDto': {
        id: 'string (uuid)',
        userId: 'string (uuid)',
        roleId: 'string (uuid)',
        roleName: 'string',
        createdAt: 'string (date-time)',
        updatedAt: 'string (date-time)'
    },
    'UserRoleInputDto': {
        userId: 'string (uuid)',
        roleId: 'string (uuid)'
    },
    'CreateAssetDto': {
        tenantId: 'string (uuid)',
        name: 'string',
        description: 'string',
        assetType: 'string',
        identificationNumber: 'string',
        make: 'string',
        model: 'string',
        year: 'integer',
        quantity: 'integer',
        status: 'string',
        currentLocation: 'string',
        requiresInspection: 'boolean',
        inspectionCheckpointsJson: 'string',
        lastMaintenanceDate: 'string (date-time)',
        nextMaintenanceDate: 'string (date-time)',
        purchaseDate: 'string (date-time)',
        purchaseCost: 'number',
        conditionNotes: 'string'
    },
    'UpdateAssetDto': {
        id: 'string (uuid)',
        name: 'string',
        description: 'string',
        assetType: 'string',
        identificationNumber: 'string',
        make: 'string',
        model: 'string',
        year: 'integer',
        quantity: 'integer',
        status: 'string',
        currentLocation: 'string',
        requiresInspection: 'boolean',
        inspectionCheckpointsJson: 'string',
        lastMaintenanceDate: 'string (date-time)',
        nextMaintenanceDate: 'string (date-time)',
        purchaseDate: 'string (date-time)',
        purchaseCost: 'number',
        conditionNotes: 'string'
    },
    'AssetCheckoutDto': {
        id: 'string (uuid)',
        tenantId: 'string (uuid)',
        assetId: 'string (uuid)',
        userId: 'string (uuid)',
        checkoutDate: 'string (date-time)',
        returnDate: 'string (date-time)',
        createdAt: 'string (date-time)',
        updatedAt: 'string (date-time)',
        createdBy: 'string (uuid)',
        updatedBy: 'string (uuid)'
    },
    'CheckoutAssetDto': {
        assetId: 'string (uuid)',
        userId: 'string (uuid)',
        checkoutDate: 'string (date-time)',
        returnDate: 'string (date-time)',
        purpose: 'string',
        destination: 'string',
        expectedReturnDate: 'string (date-time)',
        startingOdometer: 'number',
        fuelLevelCheckout: 'number',
        checkoutNotes: 'string'
    },
    'CheckinAssetDto': {
        assetId: 'string (uuid)',
        userId: 'string (uuid)',
        returnDate: 'string (date-time)',
        conditionNotes: 'string',
        endingOdometer: 'number',
        fuelLevelCheckin: 'number',
        returnedInGoodCondition: 'boolean',
        damageReported: 'boolean',
        checkinNotes: 'string',
        checkoutId: 'string (uuid)'
    },
    'AssetStatsDto': {
        totalAssets: 'integer',
        availableAssets: 'integer',
        checkedOutAssets: 'integer',
        underMaintenanceAssets: 'integer',
        retiredAssets: 'integer',
        overdueCheckouts: 'integer'
    },
    'UpdateProfileCompletionStepDto': {
        memberId: 'string (uuid)',
        stepName: 'string',
        isCompleted: 'boolean'
    },
    'MemberProfileCompletionDto': {
        id: 'string (uuid)',
        memberId: 'string (uuid)',
        hasDependents: 'boolean',
        hasBeneficiaries: 'boolean',
        hasUploadedIdDocument: 'boolean',
        hasAcceptedTerms: 'boolean',
        hasCompletedCustomForms: 'boolean',
        hasUploadedRequiredDocuments: 'boolean',
        isProfileComplete: 'boolean',
        profileCompletedAt: 'string (date-time)',
        completionPercentage: 'number',
        nextStepRecommendation: 'string'
    },
    'ProfileCompletionStatusDto': {
        isComplete: 'boolean',
        completionPercentage: 'number',
        completedSteps: 'array',
        remainingSteps: 'array',
        nextStepRecommendation: 'string',
        profileCompletion: 'object',
        dependentsCount: 'number',
        beneficiariesCount: 'number',
        uploadedDocumentsCount: 'number',
        requiredDocumentsCount: 'number',
        hasAcceptedLatestTerms: 'boolean'
    },
    'MemberDocumentType': {
        type: 'enum',
        values: [
            { value: 1, name: 'IdentificationDocument' },
            { value: 2, name: 'ProofOfAddress' },
            { value: 3, name: 'MarriageCertificate' },
            { value: 4, name: 'Passport' },
            { value: 5, name: 'WorkPermit' },
            { value: 6, name: 'BirthCertificate' },
            { value: 7, name: 'DeathCertificate' },
            { value: 8, name: 'BankingDocument' },
            { value: 99, name: 'Other' }
        ]
    },
    'DocumentVerificationStatus': {
        type: 'enum',
        values: [
            { value: 0, name: 'Pending' },
            { value: 1, name: 'Approved' },
            { value: 2, name: 'Rejected' },
            { value: 3, name: 'RequiresResubmission' }
        ]
    },
    'MemberStatus': {
        type: 'enum',
        values: [
            { value: 0, name: 'PendingApproval' },
            { value: 1, name: 'Active' },
            { value: 2, name: 'Suspended' },
            { value: 3, name: 'Inactive' },
            { value: 4, name: 'Rejected' }
        ]
    },
    'DependentType': {
        type: 'enum',
        values: [
            { value: 1, name: 'Spouse' },
            { value: 2, name: 'Child' },
            { value: 3, name: 'ExtendedFamily' },
            { value: 4, name: 'Parent' },
            { value: 5, name: 'Other' }
        ]
    },
    'AssetType': {
        type: 'enum',
        values: [
            { value: 0, name: 'Vehicle' },
            { value: 1, name: 'Tent' },
            { value: 2, name: 'Equipment' },
            { value: 3, name: 'Refrigeration' },
            { value: 4, name: 'Furniture' },
            { value: 5, name: 'Tools' },
            { value: 6, name: 'Other' }
        ]
    },
    'AssetStatus': {
        type: 'enum',
        values: [
            { value: 0, name: 'Available' },
            { value: 1, name: 'CheckedOut' },
            { value: 2, name: 'UnderMaintenance' },
            { value: 3, name: 'OutOfService' },
            { value: 4, name: 'Retired' }
        ]
    },
    'CheckoutStatus': {
        type: 'enum',
        values: [
            { value: 0, name: 'Active' },
            { value: 1, name: 'Returned' },
            { value: 2, name: 'Overdue' },
            { value: 3, name: 'Cancelled' }
        ]
    }
};

function typeToSwagger(type) {
    if (type.includes('uuid')) {
        return { type: 'string', format: 'uuid' };
    } else if (type === 'string') {
        return { type: 'string' };
    } else if (type === 'number') {
        return { type: 'number' };
    } else if (type === 'boolean') {
        return { type: 'boolean' };
    } else if (type === 'array') {
        return { type: 'array', items: { type: 'object' } };
    } else if (type === 'object') {
        return { type: 'object' };
    } else if (type.includes('date-time')) {
        return { type: 'string', format: 'date-time' };
    }
    return { type: 'string' };
}

// Generate all schemas in one file
let allSchemasContent = '/**\n * @openapi\n * components:\n *   schemas:\n';

Object.keys(allSchemas).forEach(dtoName => {
    const properties = allSchemas[dtoName];
    
    // Check if it's an enum
    if (properties.type === 'enum') {
        allSchemasContent += ` *     ${dtoName}:\n`;
        allSchemasContent += ` *       type: integer\n`;
        allSchemasContent += ` *       enum:\n`;
        properties.values.forEach(v => {
            allSchemasContent += ` *         - ${v.value}\n`;
        });
        allSchemasContent += ` *       x-enum-varnames:\n`;
        properties.values.forEach(v => {
            allSchemasContent += ` *         - ${v.name}\n`;
        });
    } else {
        // Regular DTO
        allSchemasContent += ` *     ${dtoName}:\n`;
        allSchemasContent += ` *       type: object\n`;
        allSchemasContent += ` *       properties:\n`;
        
        Object.keys(properties).forEach(propName => {
            const propType = properties[propName];
            const swaggerType = typeToSwagger(propType);
            allSchemasContent += ` *         ${propName}:\n`;
            allSchemasContent += ` *           type: ${swaggerType.type}\n`;
            if (swaggerType.format) {
                allSchemasContent += ` *           format: ${swaggerType.format}\n`;
            }
            if (swaggerType.items) {
                allSchemasContent += ` *           items:\n`;
                allSchemasContent += ` *             type: ${swaggerType.items.type}\n`;
            }
        });
        
        // Add required array with all properties
        allSchemasContent += ` *       required:\n`;
        Object.keys(properties).forEach(propName => {
            allSchemasContent += ` *         - ${propName}\n`;
        });
    }
});

allSchemasContent += ` */\nexport {};\n`;

fs.writeFileSync(path.join(outputDir, 'all-schemas.ts'), allSchemasContent);
console.log('✅ Generated all-schemas.ts with all DTO definitions');
