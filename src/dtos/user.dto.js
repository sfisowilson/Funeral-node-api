/**
 * User-related DTOs
 * Each DTO is defined with its properties and types
 */

module.exports = {
    UserDto: {
        id: 'string (uuid)',
        email: 'string',
        firstName: 'string',
        lastName: 'string',
        phoneNumber: 'string',
        address: 'string',
        idNumber: 'string',
        tenantId: 'string (uuid)',
        mustChangePassword: 'boolean',
        isIdVerified: 'boolean',
        idVerifiedAt: 'string (date-time)',
        createdAt: 'string (date-time)',
        updatedAt: 'string (date-time)',
        createdBy: 'string (uuid)',
        updatedBy: 'string (uuid)'
    },
    
    UserProfileDto: {
        id: 'string (uuid)',
        email: 'string',
        firstName: 'string',
        lastName: 'string',
        phoneNumber: 'string',
        tenantId: 'string (uuid)',
        roles: 'array'
    },
    
    UpdateUserProfileDto: {
        firstName: 'string',
        lastName: 'string',
        phoneNumber: 'string',
        address: 'string',
        idNumber: 'string',
        dateOfBirth: 'string (date-time)'
    },
    
    UserRoleDto: {
        id: 'string (uuid)',
        userId: 'string (uuid)',
        roleId: 'string (uuid)',
        roleName: 'string',
        createdAt: 'string (date-time)',
        updatedAt: 'string (date-time)'
    },
    
    UserRoleInputDto: {
        userId: 'string (uuid)',
        roleId: 'string (uuid)'
    }
};
