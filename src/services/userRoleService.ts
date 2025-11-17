import UserRole from '../models/userRole';
import Role from '../models/role';

export const userRoleService = {
    // Get all user roles
    async getAllUserRoles() {
        return await UserRole.findAll({
            include: [{
                model: Role,
                as: 'role',
                attributes: ['id', 'name']
            }]
        });
    },

    // Get user roles by user ID
    async getUserRolesByUserId(userId: string) {
        return await UserRole.findAll({
            where: { userId },
            include: [{
                model: Role,
                as: 'role',
                attributes: ['id', 'name']
            }]
        });
    },

    // Get user role by ID
    async getUserRoleById(id: string) {
        return await UserRole.findByPk(id, {
            include: [{
                model: Role,
                as: 'role',
                attributes: ['id', 'name']
            }]
        });
    },

    // Create user role
    async createUserRole(data: { userId: string; roleId: string }) {
        const userRole = await UserRole.create(data);
        return await UserRole.findByPk(userRole.id, {
            include: [{
                model: Role,
                as: 'role',
                attributes: ['id', 'name']
            }]
        });
    },

    // Delete user role
    async deleteUserRole(id: string) {
        const userRole = await UserRole.findByPk(id);
        if (!userRole) {
            throw new Error('UserRole not found');
        }
        await userRole.destroy();
        return { success: true, message: 'UserRole deleted successfully' };
    },

    // Delete user roles by user ID and role ID
    async deleteUserRoleByUserAndRole(userId: string, roleId: string) {
        const deleted = await UserRole.destroy({
            where: { userId, roleId }
        });
        return { success: deleted > 0, message: deleted > 0 ? 'UserRole deleted successfully' : 'UserRole not found' };
    }
};
