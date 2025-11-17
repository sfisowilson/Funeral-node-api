import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db/database';
import { v4 as uuidv4 } from 'uuid';

interface FileMetadataAttributes {
  id: string;
  tenantId: string;
  userId?: string;
  fileName: string;
  filePath: string;
  contentType: string;
  size: number;
  description?: string;
  entityType?: string;
  entityId?: string;
  memberDocumentType?: number;
  isRequired?: boolean;
  verificationStatus?: string;
  verifiedDate?: Date;
  verifiedByUserId?: string;
  verificationNotes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface FileMetadataCreationAttributes extends Optional<FileMetadataAttributes, 'id'> {}

class FileMetadata extends Model<FileMetadataAttributes, FileMetadataCreationAttributes> implements FileMetadataAttributes {
  declare id: string;
  declare tenantId: string;
  declare userId?: string;
  declare fileName: string;
  declare filePath: string;
  declare contentType: string;
  declare size: number;
  declare description?: string;
  declare entityType?: string;
  declare entityId?: string;
  declare memberDocumentType?: number;
  declare isRequired?: boolean;
  declare verificationStatus?: string;
  declare verifiedDate?: Date;
  declare verifiedByUserId?: string;
  declare verificationNotes?: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

FileMetadata.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      primaryKey: true,
    },
    tenantId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    fileName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    filePath: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    contentType: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    size: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    entityType: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    entityId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    memberDocumentType: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    isRequired: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    verificationStatus: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: 'Pending',
    },
    verifiedDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    verifiedByUserId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    verificationNotes: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'FileMetadata',
    tableName: 'FileMetadata',
    timestamps: true,
  }
);

export default FileMetadata;