

import { Response } from 'express';
import { RequestWithTenant } from '../middleware/tenantMiddleware';
import FileMetadata from '../models/fileMetadata';
import TenantSetting from '../models/tenantSetting';
import User from '../models/user';
import fs from 'fs';
import path from 'path';

// POST /File_UploadFile
export const uploadFile = async (req: RequestWithTenant, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded.' });
        }

        const tenantId = req.tenant?.id;
        const tenantDomain = req.tenant?.domain;
        const userId = (req as any).user?.id;
        
        console.log(`📤 File Upload - Request: hostname=${req.hostname}, tenantDomain=${tenantDomain}, tenantId=${tenantId}`);
        
        // Get query parameters
        const entityType = req.query.entityType as string | undefined;
        const entityId = req.query.entityId as string | undefined;
        const documentType = req.query.documentType as string | undefined;
        const memberDocumentType = req.query.memberDocumentType ? parseInt(req.query.memberDocumentType as string) : undefined;
        const isRequired = req.query.isRequired === 'true';

        if (!tenantId) {
            console.error(`❌ File Upload - Tenant not found`);
            return res.status(401).json({ error: 'Tenant not found' });
        }

        // Use original file name
        const originalFileName = req.file.originalname || req.file.filename;
        
        console.log(`✅ File Upload - Associating file '${originalFileName}' with tenant '${tenantDomain}' (${tenantId})`);
        
        // Create file metadata record - matching C# schema
        const fileMeta = await FileMetadata.create({
            tenantId,
            userId: userId || undefined,
            fileName: originalFileName,
            filePath: req.file.path,
            contentType: req.file.mimetype,
            size: req.file.size,
            description: documentType || undefined,
            entityType: entityType || undefined,
            entityId: entityId || undefined,
            memberDocumentType: memberDocumentType || undefined,
            isRequired: isRequired || false,
            verificationStatus: 'Pending',
        } as any);
        
        console.log('📁 File metadata created:', {
            id: fileMeta.id,
            fileName: fileMeta.fileName,
            entityType: fileMeta.entityType,
            dataValues: fileMeta.dataValues
        });

        // If uploading logo or favicon, update TenantSettings
        if (entityType === 'Logo' || entityType === 'Favicon') {
            try {
                console.log(`📸 Processing ${entityType} upload for tenant ${tenantId}`);
                let tenantSetting = await TenantSetting.findOne({ where: { tenantId } });
                
                console.log('Current TenantSetting:', tenantSetting ? {
                    id: tenantSetting.id,
                    logo: tenantSetting.logo,
                    favicon: tenantSetting.favicon
                } : 'null');
                
                // Create TenantSetting if it doesn't exist
                if (!tenantSetting) {
                    console.log('Creating new TenantSetting for tenant', tenantId);
                    tenantSetting = await TenantSetting.create({
                        tenantId,
                        settings: JSON.stringify({}),
                    } as any);
                }
                
                // Update the appropriate field with the file ID
                const fileId = fileMeta.id || fileMeta.get('id') || (fileMeta as any).dataValues?.id;
                console.log(`File ID extracted: ${fileId}`);
                
                if (entityType === 'Logo') {
                    console.log(`Setting logo to file ID: ${fileId}`);
                    tenantSetting.logo = fileId;
                } else if (entityType === 'Favicon') {
                    console.log(`Setting favicon to file ID: ${fileId}`);
                    tenantSetting.favicon = fileId;
                }
                
                console.log('About to save TenantSetting with:', {
                    id: tenantSetting.id,
                    logo: tenantSetting.logo,
                    favicon: tenantSetting.favicon,
                    changed: tenantSetting.changed()
                });
                
                const saved = await tenantSetting.save();
                console.log('Save result:', saved ? 'Success' : 'Failed');
                
                // Verify the save by reloading
                await tenantSetting.reload();
                console.log(`✅ ${entityType} updated in TenantSettings for tenant ${tenantId}`);
                console.log('Updated TenantSetting after reload:', {
                    id: tenantSetting.id,
                    logo: tenantSetting.logo,
                    favicon: tenantSetting.favicon,
                    dataValues: {
                        logo: (tenantSetting as any).dataValues.logo,
                        favicon: (tenantSetting as any).dataValues.favicon
                    }
                });
            } catch (settingError) {
                console.error(`❌ Error updating TenantSettings with ${entityType}:`, settingError);
                // Don't fail the upload if TenantSetting update fails
                // The file was successfully uploaded
            }
        }

        res.status(201).json(fileMeta);
    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).json({ error: 'Internal server error', details: (error as any).message });
    }
};

// GET /File_GetMyFiles
export const getMyFiles = async (req: RequestWithTenant, res: Response) => {
    try {
        const tenantId = req.tenant?.id;
        const userId = (req as any).user?.id;
        
        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        const files = await FileMetadata.findAll({ 
            where: { userId, tenantId } 
        });
        
        res.json(files);
    } catch (error) {
        console.error('Error getting my files:', error);
        res.status(500).json({ error: 'Internal server error', details: (error as any).message });
    }
};

// GET /File_GetFilesByMemberId/:memberId
export const getFilesByMemberId = async (req: RequestWithTenant, res: Response) => {
    try {
        const tenantId = req.tenant?.id;
        const { memberId } = req.params;
        
        const files = await FileMetadata.findAll({ 
            where: { entityId: memberId, tenantId } 
        });
        
        res.json(files);
    } catch (error) {
        console.error('Error getting files by memberId:', error);
        res.status(500).json({ error: 'Internal server error', details: (error as any).message });
    }
};

// GET /File_GetByFileId/:fileId
export const getByFileId = async (req: RequestWithTenant, res: Response) => {
    try {
        const tenantId = req.tenant?.id;
        const { fileId } = req.params;
        
        const file = await FileMetadata.findOne({ 
            where: { id: fileId, tenantId } 
        });
        
        if (!file) {
            return res.status(404).json({ error: 'File metadata not found' });
        }
        
        res.json(file);
    } catch (error) {
        console.error('Error getting file by id:', error);
        res.status(500).json({ error: 'Internal server error', details: (error as any).message });
    }
};

// DELETE /File_DeleteFile/:fileId
export const deleteFile = async (req: RequestWithTenant, res: Response) => {
    try {
        const tenantId = req.tenant?.id;
        const { fileId } = req.params;
        
        const file = await FileMetadata.findOne({ 
            where: { id: fileId, tenantId } 
        });
        
        if (!file) {
            return res.status(404).json({ error: 'File not found or not authorized for deletion.' });
        }
        
        // Delete file from disk
        if (file.filePath && fs.existsSync(file.filePath)) {
            fs.unlinkSync(file.filePath);
        }
        
        await file.destroy();
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting file:', error);
        res.status(500).json({ error: 'Internal server error', details: (error as any).message });
    }
};

// GET /File_DownloadFile/:fileId
export const downloadFile = async (req: RequestWithTenant, res: Response) => {
    try {
        const tenantId = req.tenant?.id;
        const { fileId } = req.params;
        
        console.log(`📥 Download request: fileId=${fileId}, tenantId=${tenantId}`);
        
        if (!tenantId) {
            console.log(`❌ No tenant context available`);
            return res.status(400).json({ error: 'Tenant context required. Pass X-Tenant-ID header or use subdomain.' });
        }
        
        // Query file filtered by both fileId AND tenantId
        const file = await FileMetadata.findOne({ 
            where: { id: fileId, tenantId } 
        });
        
        if (!file) {
            console.log(`❌ File not found in DB: ${fileId} for tenant: ${tenantId}`);
            return res.status(404).json({ error: 'File not found.' });
        }
        
        // Handle Sequelize model - get filePath from either direct property or dataValues
        const filePath = file.filePath || (file as any).dataValues?.filePath;
        
        if (!filePath) {
            console.log(`❌ File path is null for file: ${fileId}`);
            return res.status(404).json({ error: 'File path not found.' });
        }
        
        const fileName = file.fileName || (file as any).dataValues?.fileName;
        const contentType = file.contentType || (file as any).dataValues?.contentType;
        
        console.log(`📄 Found file: ${fileName} at ${filePath}`);
        
        // Resolve absolute path - handle both relative and absolute paths
        let absolutePath = filePath;
        if (!path.isAbsolute(absolutePath)) {
            // If relative path, resolve from the NodeAPI root
            const uploadDir = path.join(__dirname, '../../uploads');
            absolutePath = path.join(uploadDir, path.basename(absolutePath));
        }
        
        console.log(`🔍 Checking file at: ${absolutePath}`);
        
        // Check if file exists on disk
        if (!fs.existsSync(absolutePath)) {
            console.error(`❌ File not found on disk: ${absolutePath}`);
            return res.status(404).json({ error: 'File not found on disk.' });
        }
        
        console.log(`✅ Serving file: ${fileName}`);
        res.setHeader('Content-Type', contentType || 'application/octet-stream');
        res.setHeader('Content-Disposition', `inline; filename="${fileName}"`);
        const stream = fs.createReadStream(absolutePath);
        stream.pipe(res);
    } catch (error) {
        console.error('Error downloading file:', error);
        res.status(500).json({ error: 'Internal server error', details: (error as any).message });
    }
};