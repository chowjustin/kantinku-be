const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const tenantRepository = require('../repositories/tenant_repository');

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

    const token = jwt.sign({ id: tenant.id, role: "tenant" }, process.env.JWT_SECRET, {
        expiresIn: '3h',
    });

    return { 
        token,  
        role: "tenant"
    };
};

module.exports = {
    register,
    login,
};