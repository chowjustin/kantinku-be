const bcrypt = require('bcrypt');
const tenantRepository = require('../repositories/tenant_repository');
const menuRepository = require('../repositories/menu_repository');
const { getQueueAttr } = require('../repositories/order_repository');
const { getUsernamesByIds } = require('../repositories/user_repository');
const {generateToken} = require('./jwt_services')

require('dotenv').config()

const register = async (tenantData) => {
    const { canteen_id, nama, nama_tenant, nomor_telepon, email, password, image_url } = tenantData;

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
        email, 
        image_url
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

const getTenantById = async (tenantId) => {
    const tenant = await tenantRepository.findTenantById(tenantId);

    if (!tenant) throw new Error('Tenant not found');
    
    const menus = await menuRepository.getMenuByTenantId(tenantId);
    

    return {
        ...tenant,
        menus
    };
};

const updateTenant = async (tenantId, updates) => {
    const allowedFields = ['nama', 'nama_tenant', 'email', 'nomor_telepon', 'password', 'image_url'];
    const updateKeys = Object.keys(updates);

    updateKeys.forEach(key => {
        if (!allowedFields.includes(key)) throw new Error(`Field ${key} is not allowed to be updated`);
    });

    if (updates.password) updates.password = await bcrypt.hash(updates.password, 10);

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

const getAllTenant = async () => {
    const tenants = await tenantRepository.getAllTenant();
    return tenants
}

const getQueue = async (tenantId) => {
    const flatRows = await getQueueAttr(tenantId);
    if (flatRows.length === 0) return [];

    const orderMap = new Map();

    for (const row of flatRows) {
        const {
            order_id,
            notes,
            created_at,
            user_name,
            menu_name,
            quantity
        } = row;

        if (!orderMap.has(order_id)) {
            orderMap.set(order_id, {
                orderId: order_id,
                notes,
                createdAt: created_at,
                pemesan: user_name,
                pesanan: []
            });
        }

        orderMap.get(order_id).pesanan.push({
            menu: menu_name,
            quantity
        });
    }

    const result = Array.from(orderMap.values());

    return result;
};

module.exports = {
    register,
    login,
    getCurrentTenant,
    getAllTenant,
    getTenantById,
    updateTenant,
    deleteTenant,
    selectCanteen,
    getQueue
};