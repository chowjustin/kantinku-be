const tenantService = require('../service/tenant_services');
const { buildResponseFailed, buildResponseSuccess } = require('../utils/response');

// Add tenant nanti

const getCurrentTenant = async (req, res) => {
    try {
        const tenantId = req.tenant.id;
        const tenant = await tenantService.getCurrentTenant(tenantId);

        return res.status(200).json(buildResponseSuccess("success get tenant", tenant));
    } catch (error) {
        return res.status(500).json(buildResponseFailed("internal server error", error.message, null));
    }
}

const updateTenant = async (req, res) => {
    try {
        const tenantId = req.tenant.id;
        const updates = req.body;

        const updatedTenant = await tenantService.updateTenant(tenantId, updates);

        return res.status(200).json(buildResponseSuccess("success update tenant", updatedTenant));
    } catch (error) {
        return res.status(500).json(buildResponseFailed("internal server error", error.message, null));
    }
}

const deleteTenant = async (req, res) => {
    try {
        const tenantId = req.tenant.id;
        await tenantService.deleteTenant(tenantId);

        return res.status(200).json(buildResponseSuccess("success delete tenant", null));
    } catch (error) {
        return res.status(500).json(buildResponseFailed("internal server error", error.message, null));
    }
};

module.exports = { 
    getCurrentTenant, 
    updateTenant, 
    deleteTenant
};