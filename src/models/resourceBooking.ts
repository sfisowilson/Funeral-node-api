import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db/database';
import { v4 as uuidv4 } from 'uuid';

interface ResourceBookingAttributes {
  id: string;
  tenantId: string;
  resourceId?: string;
  userId?: string;
  bookingDate?: Date;
  startTime?: string;
  endTime?: string;
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
  updatedBy?: string;
}

interface ResourceBookingCreationAttributes extends Optional<ResourceBookingAttributes, 'id'> {}

class ResourceBooking extends Model<ResourceBookingAttributes, ResourceBookingCreationAttributes> implements ResourceBookingAttributes {
  public id!: string;
  public tenantId!: string;
  public resourceId?: string;
  public userId?: string;
  public bookingDate?: Date;
  public startTime?: string;
  public endTime?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public createdBy?: string;
  public updatedBy?: string;
}

ResourceBooking.init(
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
    resourceId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    bookingDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    startTime: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    endTime: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    updatedBy: {
      type: DataTypes.UUID,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'ResourceBooking',
    tableName: 'ResourceBookings',
    timestamps: true,
  }
);

export default ResourceBooking;