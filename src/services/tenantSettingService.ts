import { TenantSetting } from '../models/tenantSetting';
import Tenant from '../models/tenant';
import { Op } from 'sequelize';

export default {
  async getById(id: string) {
    return TenantSetting.findByPk(id);
  },

  async getCurrentTenantSettings(tenantId: string) {
    // Join with Tenants table to get tenant name and domain, matching C# implementation
    console.log('📋 Getting current tenant settings for:', tenantId);
    const setting = await TenantSetting.findOne({ 
      where: { tenantId },
      include: [{
        model: Tenant,
        as: 'tenant',
        attributes: ['name', 'domain']
      }]
    });
    
    if (!setting) {
      console.log('❌ No tenant setting found for:', tenantId);
      return null;
    }
    
    console.log('Raw setting from DB:', {
      id: setting.id,
      logo: setting.logo,
      favicon: setting.favicon,
      tenant: setting.get('tenant')
    });
    
    // Transform to match the DTO structure with tenantName and tenantDomain from joined tenant
    const result: any = setting.toJSON();
    if (result.tenant) {
      result.tenantName = result.tenant.name;
      result.tenantDomain = result.tenant.domain;
      delete result.tenant; // Remove the nested tenant object
    }
    
    console.log('✅ Returning tenant settings:', {
      id: result.id,
      logo: result.logo,
      favicon: result.favicon,
      tenantName: result.tenantName,
      tenantDomain: result.tenantDomain
    });
    
    return result;
  },

  async getAllTenantSettings(offset = 0, limit = 50) {
    return TenantSetting.findAll({ offset, limit });
  },

  async createTenantSetting(data: any) {
    return TenantSetting.create(data);
  },

  async updateTenantSetting(id: string, data: any) {
    const setting = await TenantSetting.findByPk(id);
    if (!setting) return null;
    await setting.update(data);
    return setting;
  },

  async updateTenantSettingByTenantId(tenantId: string, data: any) {
    let setting = await TenantSetting.findOne({ where: { tenantId } });
    if (!setting) {
      // Create if doesn't exist
      setting = await TenantSetting.create({ 
        tenantId,
        settings: JSON.stringify({}),
        ...data
      });
    } else {
      await setting.update(data);
    }
    return setting;
  },

  async deleteTenantSetting(id: string) {
    const setting = await TenantSetting.findByPk(id);
    if (!setting) return false;
    await setting.destroy();
    return true;
  },

  async saveEmailSettings(tenantId: string, smtpServer: string, smtpPort: number, smtpUsername: string, smtpPassword: string, enableSsl: boolean) {
    let setting = await TenantSetting.findOne({ where: { tenantId } });
    
    if (!setting) {
      setting = await TenantSetting.create({
        tenantId,
        settings: JSON.stringify({}),
      });
    }

    const settings = JSON.parse(setting.settings || '{}');
    settings.SmtpServer = smtpServer;
    settings.SmtpPort = smtpPort;
    settings.SmtpUsername = smtpUsername;
    settings.SmtpPassword = smtpPassword;
    settings.EnableSsl = enableSsl;

    await setting.update({ settings: JSON.stringify(settings) });
    return setting;
  },

  async saveOzowSettings(tenantId: string, apiKey: string, siteCode: string, privateKey: string) {
    let setting = await TenantSetting.findOne({ where: { tenantId } });
    
    if (!setting) {
      setting = await TenantSetting.create({
        tenantId,
        settings: JSON.stringify({}),
      });
    }

    const settings = JSON.parse(setting.settings || '{}');
    settings.OzowApiKey = apiKey;
    settings.OzowSiteCode = siteCode;
    settings.OzowPrivateKey = privateKey;

    await setting.update({ settings: JSON.stringify(settings) });
    return setting;
  },
};
