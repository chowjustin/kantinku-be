const bcrypt = require('bcrypt');
const tenantRepository = require('../repositories/tenant_repository');
const {generateToken} = require('./jwt_services')

require('dotenv').config()

const register = async (tenantData) => {
    const { canteen_id, nama, nama_tenant, nomor_telepon, email, password } = tenantData;

    const existingTenant = await tenantRepository.getTenantByEmail(email);
    if (existingTenant) {
        throw new Error('tenant already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newTenant = await tenantRepository.create({
        canteen_id,
        nama,
        nama_tenant,
        password: hashedPassword,
        nomor_telepon,
        email
    });

    return newTenant;
};

const login = async (tenantData) => {
    const { email, password } = tenantData;

    const tenant = await tenantRepository.getTenantByEmail(email);
    if (!tenant) {
        throw new Error('Invalid email');
    }

    const isPasswordValid = await bcrypt.compare(password, tenant.password);
    if (!isPasswordValid) {
        throw new Error('Invalid password');
    }

    const token = generateToken(tenant.id, "tenant")
    return { 
        token,  
        role: "tenant"
    };
};

const getCurrentTenant = async (tenantId) => {
    if (!tenantId) throw new Error('Tenant ID is required');
    
    const tenant = await tenantRepository.findTenantById(tenantId);

    if (!tenant) throw new Error('Tenant not found');

    return tenant;
};

const updateTenant = async (tenantId, updates) => {
    const allowedFields = ['nama', 'nama_tenant', 'email', 'nomor_telepon', 'password'];
    const updateKeys = Object.keys(updates);

    updateKeys.forEach(key => {
        if (!allowedFields.includes(key)) throw new Error(`Field ${key} is not allowed to be updated`);
    });

    updates.password = await bcrypt.hash(updates.password, 10);

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

const selectCanteen = async (tenantId, canteenId) => {
    if (!tenantId) throw new Error('Tenant ID is required');

    const updatedTenant = await tenantRepository.selectCanteenById(tenantId, canteenId);

    if (!updatedTenant) throw new Error('Failed to select canteen');

    return updatedTenant;
};

module.exports = {
    register,
    login,
    getCurrentTenant,
    updateTenant,
    deleteTenant,
    selectCanteen
};