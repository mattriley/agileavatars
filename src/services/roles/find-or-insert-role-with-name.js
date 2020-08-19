module.exports = ({ core, services, stores }) => roleName => {
    
    const roleData = core.roles.dataTransforms.roleName({ roleName });    
    const existingRole = stores.roles.getArray().find(role => roleData.roleName === role.roleName);
    return existingRole ? existingRole.id : services.roles.insertRole(roleData);

};