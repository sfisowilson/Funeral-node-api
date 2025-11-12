import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db/database';
import { v4 as uuidv4 } from 'uuid';

interface NotificationTemplateAttributes {
  id: string;
  key: string;
  subject: string;
  body: string;
  channel: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface NotificationTemplateCreationAttributes extends Optional<NotificationTemplateAttributes, 'id'> {}

class NotificationTemplate extends Model<NotificationTemplateAttributes, NotificationTemplateCreationAttributes> implements NotificationTemplateAttributes {
  public id!: string;
  public key!: string;
  public subject!: string;
  public body!: string;
  public channel!: string;
  public isActive!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

NotificationTemplate.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      primaryKey: true,
    },
    key: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    subject: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    channel: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'Email',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: 'NotificationTemplate',
    tableName: 'NotificationTemplates',
    timestamps: true,
  }
);

export default NotificationTemplate;
