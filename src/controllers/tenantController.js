const { getCurrentTenant, updateTenant, deleteTenant } = require('../services/tenantService');

// Add tenant nanti

const getCurrentTenantController = async (req, res) => {
    try {
        const tenantId = req.tenant.id;
        const tenant = await getCurrentTenant(tenantId);

        return res.status(200).json({
            status: true,
            message: "success get tenant",
            data: tenant
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message,
            data: null
        });
    }
}

const updateTenantController = async (req, res) => {
    try {
        const tenantId = req.tenant.id;
        const updates = req.body;

        const updatedTenant = await updateTenant(tenantId, updates);

        return res.status(200).json({
            status: true,
            message: "success update tenant",
            data: updatedTenant
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message,
            data: null
        });
    }
}

const deleteTenantController = async (req, res) => {
    try {
        const tenantId = req.tenant.id;
        await deleteTenant(tenantId);

        return res.status(200).json({
            status: true,
            message: "success delete tenant",
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message,
        })
    }
};

module.exports = { getCurrentTenantController, updateTenantController, deleteTenantController };