

import { Router } from 'express';
import { uploadFile, getMyFiles, getFilesByMemberId, getByFileId, deleteFile, downloadFile } from '../services/fileUploadService';
import multer from 'multer';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();
const upload = multer({ dest: 'uploads/' }); // files will be stored in the 'uploads/' directory

/**
 * @openapi
 * /api/FileUpload/File_UploadFile:
 *   post:
 *     tags:
 *       - File Uploads
 *     summary: Upload a file
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *               entityType:
 *                 type: string
 *               entityId:
 *                 type: string
 *                 format: uuid
 *               documentType:
 *                 type: string
 *               memberDocumentType:
 *                 type: integer
 *               isRequired:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: File uploaded
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Error uploading file
 */
router.post('/File_UploadFile', authMiddleware, upload.single('file'), uploadFile);

/**
 * @openapi
 * /api/FileUpload/File_GetMyFiles:
 *   get:
 *     tags:
 *       - File Uploads
 *     summary: Get files uploaded by the current user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of files
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Error fetching files
 */
router.get('/File_GetMyFiles', authMiddleware, getMyFiles);

/**
 * @openapi
 * /api/FileUpload/File_GetFilesByMemberId/{memberId}:
 *   get:
 *     tags:
 *       - File Uploads
 *     summary: Get files by member ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: memberId
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: Member ID
 *     responses:
 *       200:
 *         description: List of files
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: No files found
 *       500:
 *         description: Error fetching files
 */
router.get('/File_GetFilesByMemberId/:memberId', authMiddleware, getFilesByMemberId);

/**
 * @openapi
 * /api/FileUpload/File_GetByFileId/{fileId}:
 *   get:
 *     tags:
 *       - File Uploads
 *     summary: Get file by file ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: fileId
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: File ID
 *     responses:
 *       200:
 *         description: File details
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: File not found
 *       500:
 *         description: Error fetching file
 */
router.get('/File_GetByFileId/:fileId', authMiddleware, getByFileId);

/**
 * @openapi
 * /api/FileUpload/File_DeleteFile/{fileId}:
 *   delete:
 *     tags:
 *       - File Uploads
 *     summary: Delete a file
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: fileId
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: File ID
 *     responses:
 *       204:
 *         description: File deleted
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: File not found
 *       500:
 *         description: Error deleting file
 */
router.delete('/File_DeleteFile/:fileId', authMiddleware, deleteFile);

/**
 * @openapi
 * /api/FileUpload/File_DownloadFile/{fileId}:
 *   get:
 *     tags:
 *       - File Uploads
 *     summary: Download a file
 *     parameters:
 *       - in: path
 *         name: fileId
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: File ID
 *     responses:
 *       200:
 *         description: File download
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: File not found
 *       500:
 *         description: Error downloading file
 */
router.get('/File_DownloadFile/:fileId', downloadFile);

export default router;