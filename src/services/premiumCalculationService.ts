import Policy from '../models/policy';
import Member from '../models/member';
import Dependent from '../models/dependent';
import Beneficiary from '../models/beneficiary';
import TenantSetting from '../models/tenantSetting';

// ============ INTERFACES & TYPES ============

export interface DependentInfo {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  age: number;
}

export interface BeneficiaryInfo {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  age: number;
}

export interface CalculatePremiumRequest {
  coverAmount: number;
  dependents: DependentInfo[];
  beneficiaries: BeneficiaryInfo[];
}

export interface PolicyCoverAgeBracket {
  maxAge: number;
  label: string;
  premium: number;
}

export interface DependentCountTier {
  minDependents: number;
  maxDependents: number;
  label: string;
  ageBrackets: Map<number, PolicyCoverAgeBracket>;
}

export interface PolicyCoverRow {
  coverAmount: number;
  dependentCountTiers?: DependentCountTier[];
  ageBrackets?: Map<number, PolicyCoverAgeBracket>;
  premium_1To5Dependents_Under65?: number;
  premium_1To5Dependents_Under70?: number;
  premium_1To5Dependents_Under75?: number;
  premium_1To5Dependents_75Plus?: number;
}

export interface ExtendedFamilyBenefitRow {
  minAge: number;
  maxAge: number;
  ageRange: string;
  premium_5000_Cover: number;
  premium_10000_Cover: number;
  premium_15000_Cover: number;
  premium_20000_Cover: number;
  premium_25000_Cover: number;
}

export interface PolicyCoverPremiumTable {
  rows: PolicyCoverRow[];
}

export interface ExtendedFamilyBenefitTable {
  rows: ExtendedFamilyBenefitRow[];
}

export interface PremiumCalculationSettings {
  policyCoverTable: PolicyCoverPremiumTable;
  extendedFamilyTable: ExtendedFamilyBenefitTable;
  maxExtendedFamilyMembers: number;
}

export interface PremiumBreakdownItem {
  description: string;
  amount: number;
  category: string;
  details: string;
}

export interface PremiumCalculationResult {
  basePremium: number;
  extendedFamilyPremium: number;
  totalMonthlyPremium: number;
  breakdown: PremiumBreakdownItem[];
  message: string;
}

export interface PolicyOption {
  coverAmount: number;
  monthlyPremium: number;
  description: string;
  isRecommended: boolean;
}

/**
 * Premium Calculation Service - Exact C# migration with no shortcuts
 * Migrated from C# PremiumCalculationService.cs with 100% feature parity
 * 
 * Handles:
 * - Tiered dependent count premiums (1-5, 6-9, etc.)
 * - Age-based premium brackets (Under 65, 70, 75, 75+)
 * - Extended family premiums for dependents over base bracket age
 * - Dynamic tenant settings with fallback to defaults
 * - ID number parsing for date of birth extraction (SA ID format)
 * - Comprehensive logging and error handling
 */
export class PremiumCalculationService {
  private logger = {
    info: (message: string, ...args: any[]) => console.log(`[INFO] ${message}`, ...args),
    error: (message: string, error?: any) => console.error(`[ERROR] ${message}`, error),
    warn: (message: string, ...args: any[]) => console.warn(`[WARN] ${message}`, ...args),
  };

  /**
   * Get premium settings for tenant (C# GetPremiumSettingsAsync)
   * Returns tenant-specific settings or defaults
   */
  async getPremiumSettingsAsync(tenantId: string): Promise<PremiumCalculationSettings> {
    try {
      const tenantSettings = await TenantSetting.findOne({ where: { tenantId } });

      if (!tenantSettings || !tenantSettings.settings) {
        this.logger.warn(
          `No tenant settings found for tenant ${tenantId}. Returning default premium settings.`
        );
        return this.getDefaultPremiumSettings();
      }

      try {
        const settings =
          typeof tenantSettings.settings === 'string'
            ? JSON.parse(tenantSettings.settings)
            : tenantSettings.settings;

        if (settings?.premiumCalculation) {
          return settings.premiumCalculation;
        }

        this.logger.info(
          'No premium calculation settings found in tenant settings. Returning defaults.'
        );
        return this.getDefaultPremiumSettings();
      } catch (parseError) {
        this.logger.error(
          `Failed to parse email settings for tenant ${tenantId}`,
          parseError
        );
        return this.getDefaultPremiumSettings();
      }
    } catch (error) {
      this.logger.error(`Error retrieving premium settings for tenant ${tenantId}.`, error);
      return this.getDefaultPremiumSettings();
    }
  }

  /**
   * Save premium settings for tenant (C# SavePremiumSettingsAsync)
   */
  async savePremiumSettingsAsync(
    tenantId: string,
    premiumSettings: PremiumCalculationSettings
  ): Promise<void> {
    try {
      let tenantSetting = await TenantSetting.findOne({ where: { tenantId } });

      if (!tenantSetting) {
        this.logger.warn(
          `No tenant settings found for tenant ${tenantId}. Creating new settings.`
        );
        tenantSetting = await TenantSetting.create({
          tenantId,
          settings: '{}',
        } as any);
      }

      // Parse existing settings
      let settings: any = {};
      if (tenantSetting.settings) {
        try {
          settings =
            typeof tenantSetting.settings === 'string'
              ? JSON.parse(tenantSetting.settings)
              : tenantSetting.settings;
        } catch {
          settings = {};
        }
      }

      // Update with new premium settings
      settings.premiumCalculation = premiumSettings;
      tenantSetting.settings = JSON.stringify(settings);

      await tenantSetting.save();

      this.logger.info(
        `Premium calculation settings saved for tenant ${tenantId}.`
      );
    } catch (error) {
      this.logger.error(`Error saving premium settings for tenant ${tenantId}.`, error);
      throw error;
    }
  }

  /**
   * Calculate premium for given cover amount and dependents (C# CalculatePremiumAsync)
   * Core premium calculation with full business logic
   */
  async calculatePremiumAsync(
    tenantId: string,
    request: CalculatePremiumRequest
  ): Promise<PremiumCalculationResult> {
    try {
      const settings = await this.getPremiumSettingsAsync(tenantId);
      const result: PremiumCalculationResult = {
        basePremium: 0,
        extendedFamilyPremium: 0,
        totalMonthlyPremium: 0,
        breakdown: [],
        message: '',
      };

      // Calculate base premium
      const [basePremiumItem, baseBracketMaxAge] = this.calculateBasePremium(
        request.coverAmount,
        request.dependents,
        settings
      );
      result.basePremium = basePremiumItem.amount;
      result.breakdown.push(basePremiumItem);

      // Calculate extended family premiums for dependents exceeding base bracket
      const extendedFamilyPremiums = this.calculateExtendedFamilyPremiums(
        request.coverAmount,
        request.dependents,
        baseBracketMaxAge,
        settings
      );

      result.extendedFamilyPremium = extendedFamilyPremiums.reduce(
        (sum, item) => sum + item.amount,
        0
      );
      result.breakdown.push(...extendedFamilyPremiums);

      result.totalMonthlyPremium = result.basePremium + result.extendedFamilyPremium;
      result.message = `Premium calculated successfully for R${request.coverAmount.toLocaleString()} cover with ${request.dependents.length} dependents.`;

      this.logger.info(
        `Premium calculated for tenant ${tenantId}: Total = R${result.totalMonthlyPremium}`
      );

      return result;
    } catch (error) {
      this.logger.error(`Error calculating premium for tenant ${tenantId}.`, error);
      throw error;
    }
  }

  /**
   * Calculate premium for specific member (C# CalculateMemberPremiumAsync)
   * Retrieves member's policies and dependents from database
   */
  async calculateMemberPremiumAsync(tenantId: string, memberId: string): Promise<PremiumCalculationResult> {
    try {
      // Get tenant settings to check requirePolicySelection
      const tenantSetting = await TenantSetting.findOne({ where: { tenantId } });
      let requirePolicySelection = false;
      if (tenantSetting && tenantSetting.settings) {
        try {
          const settings = typeof tenantSetting.settings === 'string' ? JSON.parse(tenantSetting.settings) : tenantSetting.settings;
          requirePolicySelection = settings?.requirePolicySelection ?? false;
        } catch (error) {
          throw error;
        }
      }

      // Only include policies if requirePolicySelection is true
      let member;
      if (requirePolicySelection && typeof Member.associations?.policies !== 'undefined') {
        member = await Member.findOne({
          where: { id: memberId, tenantId },
          include: [{ association: 'policies' }],
        });
      } else {
        member = await Member.findOne({
          where: { id: memberId, tenantId },
        });
      }

      if (!member) {
        throw new Error(`Member ${memberId} not found.`);
      }

      // Get active policy - use CoverageAmount or PayoutAmount
      let policies: any[] = [];
      if (requirePolicySelection && typeof Member.associations?.policies !== 'undefined') {
        policies = (member as any).policies || [];
      }
      let coverAmount = 10000; // Default

      if (policies.length > 0) {
        const policy = policies[0];
        coverAmount = policy.coverageAmount || policy.payoutAmount || 10000;
      } else if (requirePolicySelection) {
        throw new Error('Policy selection is required for premium calculation, but no policy exists for this member.');
      }

      // Get dependents with DOB extraction
      const dependentsFromDb = await Dependent.findAll({
        where: { memberId, tenantId },
        attributes: ['id', 'name', 'dateOfBirth', 'identificationNumber'],
      });

      const dependents = dependentsFromDb.map((d: any) => ({
        id: d.id,
        firstName: d.name || 'Unknown',
        lastName: '',
        dateOfBirth: d.dateOfBirth || this.extractDateOfBirthFromIdNumber(d.identificationNumber),
        age: this.calculateAge(d.dateOfBirth || this.extractDateOfBirthFromIdNumber(d.identificationNumber)),
      }));

      // Get beneficiaries with DOB extraction
      const beneficiariesFromDb = await Beneficiary.findAll({
        where: { memberId, tenantId },
        attributes: ['id', 'name', 'identificationNumber'],
      });

      const beneficiaries = beneficiariesFromDb.map((b: any) => ({
        id: b.id,
        firstName: b.name || 'Unknown',
        lastName: '',
        dateOfBirth: this.extractDateOfBirthFromIdNumber(b.identificationNumber),
        age: this.calculateAge(this.extractDateOfBirthFromIdNumber(b.identificationNumber)),
      }));

      const request: CalculatePremiumRequest = {
        coverAmount,
        dependents,
        beneficiaries,
      };

      return await this.calculatePremiumAsync(tenantId, request);
    } catch (error) {
      this.logger.error(`Error calculating premium for member ${memberId}.`, error);
      throw error;
    }
  }

  /**
   * Get available policy options (C# GetAvailablePolicyOptionsAsync)
   * Returns all available cover amounts with base premiums
   */
  async getAvailablePolicyOptionsAsync(tenantId: string): Promise<PolicyOption[]> {
    try {
      const settings = await this.getPremiumSettingsAsync(tenantId);
      const options: PolicyOption[] = [];

      for (const row of settings.policyCoverTable.rows.sort(
        (a, b) => a.coverAmount - b.coverAmount
      )) {
        // Use base rate (1-5 dependents under 65)
        const basePremium = row.premium_1To5Dependents_Under65 || 0;

        options.push({
          coverAmount: row.coverAmount,
          monthlyPremium: basePremium,
          description: `R${row.coverAmount.toLocaleString()} Funeral Cover`,
          isRecommended: row.coverAmount === 10000,
        });
      }

      return options;
    } catch (error) {
      this.logger.error(
        `Error getting available policy options for tenant ${tenantId}.`,
        error
      );
      throw error;
    }
  }

  /**
   * Calculate base premium (C# CalculateBasePremium)
   * Returns tuple of [PremiumBreakdownItem, baseBracketMaxAge]
   * Handles tiered dependent counts and age brackets
   */
  private calculateBasePremium(
    coverAmount: number,
    dependents: DependentInfo[],
    settings: PremiumCalculationSettings
  ): [PremiumBreakdownItem, number] {
    const dependentCount = dependents.length;

    // Find matching cover row
    const coverRow = settings.policyCoverTable.rows.find(
      r => r.coverAmount === coverAmount
    );

    if (!coverRow) {
      this.logger.warn(`No premium found for cover amount R${coverAmount}. Using default.`);
      return [
        {
          description: `Base Premium - R${coverAmount.toLocaleString()} Cover`,
          amount: 0,
          category: 'Base',
          details: 'Cover amount not found in premium table',
        },
        0,
      ];
    }

    // ========== TRY TIERED STRUCTURE FIRST ==========
    if (coverRow.dependentCountTiers && coverRow.dependentCountTiers.length > 0) {
      const tierResult = this.tryCalculateFromTiers(
        coverAmount,
        dependentCount,
        dependents,
        coverRow.dependentCountTiers
      );
      if (tierResult) {
        return tierResult;
      }
    }

    // ========== FALLBACK TO SINGLE-TIER AGE BRACKETS ==========
    if (coverRow.ageBrackets && coverRow.ageBrackets.size > 0) {
      const legacyResult = this.tryCalculateFromLegacyBrackets(
        coverAmount,
        dependentCount,
        dependents,
        coverRow.ageBrackets
      );
      if (legacyResult) {
        return legacyResult;
      }
    }

    // ========== ULTIMATE FALLBACK TO HARDCODED PROPERTIES ==========
    return this.calculateFromHardcoded(
      coverAmount,
      dependentCount,
      dependents,
      coverRow
    );
  }

  /**
   * Try to calculate base premium using tiered structure
   */
  private tryCalculateFromTiers(
    coverAmount: number,
    dependentCount: number,
    dependents: DependentInfo[],
    tiers: DependentCountTier[]
  ): [PremiumBreakdownItem, number] | null {
    // Find matching tier based on dependent count
    const matchingTier = tiers
      .sort((a, b) => a.minDependents - b.minDependents)
      .find(
        t =>
          dependentCount >= t.minDependents &&
          dependentCount <= t.maxDependents
      );

    if (!matchingTier || !matchingTier.ageBrackets || matchingTier.ageBrackets.size === 0) {
      if (!matchingTier) {
        this.logger.warn(
          `No matching tier found for ${dependentCount} dependents. Available tiers: ${tiers
            .map(t => `${t.minDependents}-${t.maxDependents}`)
            .join(', ')}`
        );
      }
      return null;
    }

    this.logger.info(
      `Using dependent count tier: ${matchingTier.label} for ${dependentCount} dependents`
    );

    // Sort age brackets by key
    const sortedBrackets = Array.from(matchingTier.ageBrackets.entries())
      .sort((a, b) => a[0] - b[0]);

    // Determine highest base bracket (second-to-last if last is INT_MAX)
    const lastEntry = sortedBrackets[sortedBrackets.length - 1];
    const lastBracketKey = lastEntry ? lastEntry[0] : 0;
    const highestBaseBracketKey =
      sortedBrackets.length > 1 && lastBracketKey === 2147483647
        ? (sortedBrackets[sortedBrackets.length - 2]?.[0] ?? 0)
        : lastBracketKey;

    // Filter dependents within base bracket
    const basePremiumDependents = dependents.filter(d => d.age <= highestBaseBracketKey);
    const maxAge = basePremiumDependents.length > 0
      ? Math.max(...basePremiumDependents.map(d => d.age))
      : 0;

    // Find appropriate bracket for max age
    const selectedBracket = sortedBrackets.find(b => maxAge <= b[0]) ?? sortedBrackets[0];
    if (!selectedBracket) {
      return null;
    }

    const premium = selectedBracket[1].premium;
    const ageCategory = `${matchingTier.label} ${selectedBracket[1].label}`;
    const bracketMaxAge = selectedBracket[0];

    this.logger.info(
      `Selected tier '${matchingTier.label}', age bracket: ${selectedBracket[1].label} (MaxAge: ${bracketMaxAge}, Premium: R${premium}). ` +
      `Considered ${basePremiumDependents.length} of ${dependentCount} dependents within base range (max age ${maxAge}).`
    );

    return [
      {
        description: `Base Premium - R${coverAmount.toLocaleString()} Cover`,
        amount: premium,
        category: 'Base',
        details: `${ageCategory} (${dependentCount} dependents)`,
      },
      bracketMaxAge,
    ];
  }

  /**
   * Try to calculate base premium using legacy single-tier age brackets
   */
  private tryCalculateFromLegacyBrackets(
    coverAmount: number,
    dependentCount: number,
    dependents: DependentInfo[],
    ageBrackets: Map<number, PolicyCoverAgeBracket>
  ): [PremiumBreakdownItem, number] | null {
    this.logger.info('Using single-tier age brackets (legacy structure)');

    // Sort brackets by key
    const sortedBrackets = Array.from(ageBrackets.entries())
      .sort((a, b) => a[0] - b[0]);

    if (sortedBrackets.length === 0) {
      return null;
    }

    // Highest base bracket logic
    const lastBracketEntry = sortedBrackets[sortedBrackets.length - 1];
    const lastBracketKey = lastBracketEntry?.[0] ?? 0;
    const highestBaseBracketKey =
      sortedBrackets.length > 1 && lastBracketKey === 2147483647
        ? (sortedBrackets[sortedBrackets.length - 2]?.[0] ?? 0)
        : lastBracketKey;

    // Filter dependents within base bracket
    const basePremiumDependents = dependents.filter(d => d.age <= highestBaseBracketKey);
    const maxAge = basePremiumDependents.length > 0
      ? Math.max(...basePremiumDependents.map(d => d.age))
      : 0;

    // Find appropriate bracket
    const selectedBracket = sortedBrackets.find(b => maxAge <= b[0]) ?? sortedBrackets[0];
    if (!selectedBracket) {
      return null;
    }

    const premium = selectedBracket[1].premium;
    const ageCategory = `Base coverage ${selectedBracket[1].label}`;
    const bracketMaxAge = selectedBracket[0];

    this.logger.info(
      `Selected base premium bracket: ${selectedBracket[1].label} (MaxAge: ${bracketMaxAge}, Premium: R${premium}). ` +
      `Considered ${basePremiumDependents.length} of ${dependentCount} dependents within base range (max age ${maxAge}).`
    );

    return [
      {
        description: `Base Premium - R${coverAmount.toLocaleString()} Cover`,
        amount: premium,
        category: 'Base',
        details: `${ageCategory} (${dependentCount} dependents)`,
      },
      bracketMaxAge,
    ];
  }

  /**
   * Calculate base premium using hardcoded legacy properties
   */
  private calculateFromHardcoded(
    coverAmount: number,
    dependentCount: number,
    dependents: DependentInfo[],
    coverRow: PolicyCoverRow
  ): [PremiumBreakdownItem, number] {
    this.logger.warn(
      'No tiered or dynamic configuration found, using legacy hardcoded values'
    );

    // Filter dependents age <= 74
    const basePremiumDependents = dependents.filter(d => d.age <= 74);
    const maxAge = basePremiumDependents.length > 0
      ? Math.max(...basePremiumDependents.map(d => d.age))
      : 0;

    let premium: number;
    let ageCategory: string;
    let bracketMaxAge: number;

    if (maxAge < 65) {
      premium = coverRow.premium_1To5Dependents_Under65 || 0;
      ageCategory = 'Base coverage under age 65';
      bracketMaxAge = 64;
    } else if (maxAge < 70) {
      premium = coverRow.premium_1To5Dependents_Under70 || 0;
      ageCategory = 'Base coverage under age 70';
      bracketMaxAge = 69;
    } else if (maxAge < 75) {
      premium = coverRow.premium_1To5Dependents_Under75 || 0;
      ageCategory = 'Base coverage under age 75';
      bracketMaxAge = 74;
    } else {
      // All 75+
      premium = coverRow.premium_1To5Dependents_Under65 || 0;
      ageCategory = 'Base coverage (all extended family)';
      bracketMaxAge = 64;
    }

    return [
      {
        description: `Base Premium - R${coverAmount.toLocaleString()} Cover`,
        amount: premium,
        category: 'Base',
        details: `${ageCategory} (${dependentCount} dependents)`,
      },
      bracketMaxAge,
    ];
  }

  /**
   * Calculate extended family premiums (C# CalculateExtendedFamilyPremiums)
   * Returns breakdown items for dependents exceeding base bracket age
   */
  private calculateExtendedFamilyPremiums(
    coverAmount: number,
    dependents: DependentInfo[],
    baseBracketMaxAge: number,
    settings: PremiumCalculationSettings
  ): PremiumBreakdownItem[] {
    const breakdown: PremiumBreakdownItem[] = [];

    this.logger.info(
      `Calculating extended family premiums for dependents exceeding age ${baseBracketMaxAge}`
    );

    let extendedFamilyCount = 0;
    const maxExtendedFamily = settings.maxExtendedFamilyMembers;

    for (const dependent of dependents) {
      this.logger.info(
        `Processing dependent ${dependent.id}: Age=${dependent.age}, DOB=${dependent.dateOfBirth}`
      );

      // Skip invalid ages
      if (dependent.age <= 0) {
        this.logger.warn(
          `Skipping dependent ${dependent.id} - invalid age ${dependent.age}`
        );
        continue;
      }

      // Only extended family if exceeds base bracket
      if (dependent.age <= baseBracketMaxAge) {
        this.logger.info(
          `Dependent ${dependent.id} age ${dependent.age} is within base bracket (<= ${baseBracketMaxAge}), no extended family premium`
        );
        continue;
      }

      // Check max extended family limit
      if (extendedFamilyCount >= maxExtendedFamily) {
        this.logger.warn(
          `Maximum extended family members (${maxExtendedFamily}) reached. Skipping dependent ${dependent.id}`
        );
        continue;
      }

      // Find age range row
      const ageRangeRow = settings.extendedFamilyTable.rows.find(
        r => dependent.age >= r.minAge && dependent.age <= r.maxAge
      );

      if (!ageRangeRow) {
        this.logger.warn(
          `No extended family premium found for age ${dependent.age}. Skipping dependent ${dependent.id}. Available ranges: ${settings.extendedFamilyTable.rows
            .map(r => `${r.minAge}-${r.maxAge}`)
            .join(', ')}`
        );
        continue;
      }

      // Get premium based on cover amount
      let premium: number;
      switch (coverAmount) {
        case 5000:
          premium = ageRangeRow.premium_5000_Cover;
          break;
        case 10000:
          premium = ageRangeRow.premium_10000_Cover;
          break;
        case 15000:
          premium = ageRangeRow.premium_15000_Cover;
          break;
        case 20000:
          premium = ageRangeRow.premium_20000_Cover;
          break;
        case 25000:
          premium = ageRangeRow.premium_25000_Cover;
          break;
        default:
          premium = 0;
      }

      if (premium > 0) {
        breakdown.push({
          description: `Extended Family - ${dependent.firstName} ${dependent.lastName}`,
          amount: premium,
          category: 'ExtendedFamily',
          details: `Age ${dependent.age} (${ageRangeRow.ageRange}), R${coverAmount.toLocaleString()} cover`,
        });

        extendedFamilyCount++;
        this.logger.info(
          `Added extended family premium for dependent ${dependent.id}. Count: ${extendedFamilyCount}/${maxExtendedFamily}`
        );
      }
    }

    return breakdown;
  }

  /**
   * Get default premium settings (C# GetDefaultPremiumSettings)
   * Complete default configuration with all cover amounts and brackets
   */
  private getDefaultPremiumSettings(): PremiumCalculationSettings {
    return {
      policyCoverTable: {
        rows: [
          this.createDefaultCoverRowWithTiers(5000),
          this.createDefaultCoverRowWithTiers(10000),
          this.createDefaultCoverRowWithTiers(15000),
          this.createDefaultCoverRowWithTiers(20000),
          this.createDefaultCoverRowWithTiers(25000),
        ],
      },
      extendedFamilyTable: {
        rows: [
          {
            minAge: 0,
            maxAge: 22,
            ageRange: '0-22',
            premium_5000_Cover: 15,
            premium_10000_Cover: 30,
            premium_15000_Cover: 40,
            premium_20000_Cover: 50,
            premium_25000_Cover: 60,
          },
          {
            minAge: 23,
            maxAge: 64,
            ageRange: '23-64',
            premium_5000_Cover: 30,
            premium_10000_Cover: 50,
            premium_15000_Cover: 70,
            premium_20000_Cover: 90,
            premium_25000_Cover: 110,
          },
          {
            minAge: 65,
            maxAge: 74,
            ageRange: '65-74',
            premium_5000_Cover: 50,
            premium_10000_Cover: 80,
            premium_15000_Cover: 100,
            premium_20000_Cover: 120,
            premium_25000_Cover: 140,
          },
          {
            minAge: 75,
            maxAge: 84,
            ageRange: '75-84',
            premium_5000_Cover: 80,
            premium_10000_Cover: 120,
            premium_15000_Cover: 150,
            premium_20000_Cover: 180,
            premium_25000_Cover: 210,
          },
          {
            minAge: 85,
            maxAge: 120,
            ageRange: '85+',
            premium_5000_Cover: 100,
            premium_10000_Cover: 150,
            premium_15000_Cover: 180,
            premium_20000_Cover: 220,
            premium_25000_Cover: 260,
          },
        ],
      },
      maxExtendedFamilyMembers: 4,
    };
  }

  /**
   * Create default cover row with tiers (C# CreateDefaultCoverRowWithTiers)
   * Generates tiered pricing: 1-5 dependents and 6-9 dependents
   */
  private createDefaultCoverRowWithTiers(coverAmount: number): PolicyCoverRow {
    // Calculate base premiums using multiplier
    const multiplier = coverAmount / 5000;

    // Tier 1: 1-5 dependents
    const tier1_under65 = 120 * multiplier;
    const tier1_under70 = 135 * multiplier;
    const tier1_under75 = 160 * multiplier;
    const tier1_75plus = 200 * multiplier;

    // Tier 2: 6-9 dependents (30% increase)
    const tier2_under65 = tier1_under65 * 1.3;
    const tier2_under70 = tier1_under70 * 1.3;
    const tier2_under75 = tier1_under75 * 1.3;
    const tier2_75plus = tier1_75plus * 1.3;

    // Create age bracket maps
    const tier1AgeBrackets = new Map<number, PolicyCoverAgeBracket>([
      [64, { maxAge: 64, label: 'Under 65', premium: tier1_under65 }],
      [69, { maxAge: 69, label: 'Under 70', premium: tier1_under70 }],
      [74, { maxAge: 74, label: 'Under 75', premium: tier1_under75 }],
      [
        2147483647,
        { maxAge: 2147483647, label: '75+', premium: tier1_75plus },
      ],
    ]);

    const tier2AgeBrackets = new Map<number, PolicyCoverAgeBracket>([
      [64, { maxAge: 64, label: 'Under 65', premium: tier2_under65 }],
      [69, { maxAge: 69, label: 'Under 70', premium: tier2_under70 }],
      [74, { maxAge: 74, label: 'Under 75', premium: tier2_under75 }],
      [
        2147483647,
        { maxAge: 2147483647, label: '75+', premium: tier2_75plus },
      ],
    ]);

    // Legacy single-tier brackets (fallback)
    const legacyAgeBrackets = new Map<number, PolicyCoverAgeBracket>([
      [64, { maxAge: 64, label: 'Under 65', premium: tier1_under65 }],
      [69, { maxAge: 69, label: 'Under 70', premium: tier1_under70 }],
      [74, { maxAge: 74, label: 'Under 75', premium: tier1_under75 }],
      [
        2147483647,
        { maxAge: 2147483647, label: '75+', premium: tier1_75plus },
      ],
    ]);

    return {
      coverAmount,
      dependentCountTiers: [
        {
          minDependents: 1,
          maxDependents: 5,
          label: '1-5 dependents',
          ageBrackets: tier1AgeBrackets,
        },
        {
          minDependents: 6,
          maxDependents: 9,
          label: '6-9 dependents',
          ageBrackets: tier2AgeBrackets,
        },
      ],
      ageBrackets: legacyAgeBrackets,
      premium_1To5Dependents_Under65: tier1_under65,
      premium_1To5Dependents_Under70: tier1_under70,
      premium_1To5Dependents_Under75: tier1_under75,
      premium_1To5Dependents_75Plus: tier1_75plus,
    };
  }

  /**
   * Calculate age from date of birth (C# CalculateAge)
   */
  private calculateAge(dateOfBirth: Date): number {
    if (!dateOfBirth || dateOfBirth === new Date(0, 0, 0)) {
      return 0;
    }

    const today = new Date();
    let age = today.getFullYear() - dateOfBirth.getFullYear();
    const monthDiff = today.getMonth() - dateOfBirth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < dateOfBirth.getDate())
    ) {
      age--;
    }

    return age;
  }

  /**
   * Extract date of birth from SA ID number (C# ExtractDateOfBirthFromIdNumber)
   * SA ID format: YYMMDD + 4 digits + C + 8 + Z
   */
  private extractDateOfBirthFromIdNumber(idNumber?: string): Date {
    if (!idNumber || idNumber.length !== 13) {
      return new Date(0, 0, 0); // Return invalid date
    }

    try {
      const yearStr = idNumber.substring(0, 2);
      const monthStr = idNumber.substring(2, 2);
      const dayStr = idNumber.substring(4, 2);

      const year = parseInt(yearStr, 10);
      const month = parseInt(monthStr, 10);
      const day = parseInt(dayStr, 10);

      // Determine century
      const currentYear = new Date().getFullYear() % 100;
      const fullYear = year <= currentYear ? 2000 + year : 1900 + year;

      return new Date(fullYear, month - 1, day); // month is 0-indexed
    } catch {
      return new Date(0, 0, 0); // Return invalid date
    }
  }
}

export const premiumCalculationService = new PremiumCalculationService();
