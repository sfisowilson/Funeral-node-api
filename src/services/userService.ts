import User from '../models/user';
import { Op } from 'sequelize';

export const userService = {
    // Get all users (with optional tenant filtering)
    async getAllUsers(tenantId?: string) {
        const where: any = {};
        if (tenantId) {
            where.tenantId = tenantId;
        }

        return await User.findAll({
            where,
            attributes: { exclude: ['passwordHash'] },
            order: [['createdAt', 'DESC']]
        });
    },

    // Get user by ID
    async getUserById(id: string) {
        const user = await User.findByPk(id, {
            attributes: { exclude: ['passwordHash'] }
        });
        return user;
    },

    // Get user by email
    async getUserByEmail(email: string) {
        const user = await User.findOne({
            where: { email },
            attributes: { exclude: ['passwordHash'] }
        });
        return user;
    },

    // Create user
    async createUser(userData: any, currentUserId?: string) {
        const user = await User.create({
            ...userData,
            createdBy: currentUserId,
            updatedBy: currentUserId
        });

        // Return without password
        const userJson = user.toJSON();
        delete (userJson as any).passwordHash;
        return userJson;
    },

    // Update user
    async updateUser(id: string, userData: any, currentUserId?: string) {
        const user = await User.findByPk(id);
        if (!user) {
            throw new Error('User not found');
        }

        await user.update({
            ...userData,
            updatedBy: currentUserId
        });

        // Return without password
        const userJson = user.toJSON();
        delete (userJson as any).passwordHash;
        return userJson;
    },

    // Delete user
    async deleteUser(id: string) {
        const user = await User.findByPk(id);
        if (!user) {
            throw new Error('User not found');
        }

        await user.destroy();
        return { success: true, message: 'User deleted successfully' };
    },

    // Get user profile (simplified view)
    async getUserProfile(id: string) {
        const user = await User.findByPk(id, {
            attributes: ['id', 'email', 'firstName', 'lastName', 'phoneNumber', 'tenantId']
        });

        if (!user) {
            throw new Error('User not found');
        }

        return {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            phoneNumber: user.phoneNumber,
            tenantId: user.tenantId,
            roles: [] // TODO: Add roles when role relationship is set up
        };
    },

    // Update user profile for current user
    async updateUserProfile(userId: string, updateData: {
        firstName?: string;
        lastName?: string;
        phoneNumber?: string;
        address?: string;
        idNumber?: string;
        dateOfBirth?: Date;
    }) {
        const user = await User.findByPk(userId);
        if (!user) {
            throw new Error('User not found');
        }

        await user.update({
            ...updateData,
            updatedBy: userId,
            updatedAt: new Date()
        });

        return true;
    },

    // Search users
    async searchUsers(searchTerm: string, tenantId?: string) {
        const where: any = {
            [Op.or]: [
                { email: { [Op.iLike]: `%${searchTerm}%` } },
                { firstName: { [Op.iLike]: `%${searchTerm}%` } },
                { lastName: { [Op.iLike]: `%${searchTerm}%` } }
            ]
        };

        if (tenantId) {
            where.tenantId = tenantId;
        }

        return await User.findAll({
            where,
            attributes: { exclude: ['passwordHash'] },
            limit: 20
        });
    }
};
