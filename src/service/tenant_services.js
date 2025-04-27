const tenantRepository = require('../repositories/tenant_repository');

const getCurrentTenant = async (tenantId) => {
    if (!tenantId) throw new Error('Tenant ID is required');
    
    const tenant = await tenantRepository.findTenantById(tenantId);

    if (!tenant) throw new Error('Tenant not found');

    return tenant;
};

const updateTenant = async (tenantId, updates) => {
    const allowedFields = ['nama', 'nama_tenant', 'email', 'nomor_telepon'];
    const updateKeys = Object.keys(updates);

    updateKeys.forEach(key => {
        if (!allowedFields.includes(key)) throw new Error(`Field ${key} is not allowed to be updated`);
    });

    const updatedTenant = await tenantRepository.updateTenantById(tenantId, updates);

    if (!updatedTenant) throw new Error("Failed to update tenant");

    return updatedTenant;
};

const deleteTenant = async (tenantId) => {
    if (!tenantId) throw new Error('Tenant ID is required');
    
    const deletedTenant = await tenantRepository.deleteTenantById(tenantId);

    if (!deletedTenant) throw new Error('Failed to delete tenant');

    return deletedTenant;
};

module.exports = { 
    getCurrentTenant,
    updateTenant,
    deleteTenant
};