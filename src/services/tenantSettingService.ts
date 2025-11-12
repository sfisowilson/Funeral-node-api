import { TenantSetting } from '../models/tenantSetting';
import { Op } from 'sequelize';

export default {
  async getById(id: string) {
    return TenantSetting.findByPk(id);
  },

  async getCurrentTenantSettings(tenantId: string) {
    return TenantSetting.findOne({ where: { tenantId } });
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
