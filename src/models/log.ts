import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db/database';
import { v4 as uuidv4 } from 'uuid';

interface LogAttributes {
  id: number;
  message: string;
  messageTemplate: string;
  level: string;
  timeStamp: Date;
  exception?: string;
  properties: string;
}

interface LogCreationAttributes extends Optional<LogAttributes, 'id'> {}

class Log extends Model<LogAttributes, LogCreationAttributes> implements LogAttributes {
  public id!: number;
  public message!: string;
  public messageTemplate!: string;
  public level!: string;
  public timeStamp!: Date;
  public exception?: string;
  public properties!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Log.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    messageTemplate: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    level: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    timeStamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    exception: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    properties: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Log',
    tableName: 'Logs',
    timestamps: false,
  }
);

export default Log;
