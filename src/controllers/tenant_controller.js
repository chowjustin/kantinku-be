const tenantServices = require('../service/tenant_services');
const { buildResponseFailed, buildResponseSuccess } = require('../utils/response');

const registerTenant = async (req, res) => {
    try {
        const { nama, nama_tenant, nomor_telepon, email, password } = req.body;

        if (!nama || !nama_tenant || !nomor_telepon || !email || !password) {
            return res.status(400).json(buildResponseFailed("missing required fields", "invalid request body", null));
        }

        const newTenant = await tenantServices.register({ nama, nama_tenant, nomor_telepon, email, password });

        res.status(201).json(buildResponseSuccess("tenant created successfully", newTenant));
    } catch (error) {
        res.status(500).json(buildResponseFailed(error.message, "error creating tenant", null));
    }
};

const loginTenant = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json(buildResponseFailed("missing required fields", "invalid request body", null));
        }

        const result = await tenantServices.login({ email, password });

        res.status(200).json(buildResponseSuccess("successfully logged in to tenant", result));
    } catch (error) {
        res.status(500).json(buildResponseFailed("internal server error", error.message, null));
    }
};

const getCurrentTenant = async (req, res) => {
    try {
        const tenantId = req.userId;
        const tenant = await tenantServices.getCurrentTenant(tenantId);
        tenant.role = req.userRole;

        return res.status(200).json(buildResponseSuccess("success get tenant", tenant));
    } catch (error) {
        return res.status(500).json(buildResponseFailed("internal server error", error.message, null));
    }
}

const updateTenant = async (req, res) => {
    try {
        const tenantId = req.userId;
        const updates = req.body;

        const updatedTenant = await tenantServices.updateTenant(tenantId, updates);

        return res.status(200).json(buildResponseSuccess("success update tenant", updatedTenant));
    } catch (error) {
        return res.status(500).json(buildResponseFailed("internal server error", error.message, null));
    }
}

const deleteTenant = async (req, res) => {
    try {
        const tenantId = req.userId;
        await tenantServices.deleteTenant(tenantId);

        return res.status(200).json(buildResponseSuccess("success delete tenant", null));
    } catch (error) {
        return res.status(500).json(buildResponseFailed("internal server error", error.message, null));
    }
};

const selectCanteen = async (req, res) => {
    try {
        const tenantId = req.userId;
        const { canteenId } = req.body;

        if (!canteenId) return res.status(400).json(buildResponseFailed("missing required fields", "invalid request body", null));

        const updatedTenant = await tenantServices.selectCanteen(tenantId, canteenId);

        return res.status(200).json(buildResponseSuccess("success update tenant", updatedTenant));
    } catch (error) {
        return res.status(500).json(buildResponseFailed("internal server error", error.message, null));
    }
}

module.exports = {
    registerTenant,
    loginTenant,
    getCurrentTenant,
    updateTenant,
    deleteTenant,
    selectCanteen
};