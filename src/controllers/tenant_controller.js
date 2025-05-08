const tenantServices = require('../service/tenant_services');
const menuServices = require('../service/menu_services')
const canteenServices = require('../service/canteen_services')
const { buildResponseFailed, buildResponseSuccess } = require('../utils/response');

const registerTenant = async (req, res) => {
    try {
        const { canteen_id, nama, nama_tenant, nomor_telepon, email, password } = req.body;

        if (!canteen_id || !nama || !nama_tenant || !nomor_telepon || !email || !password) {
            return res.status(400).json(buildResponseFailed("missing required fields", "invalid request body", null));
        }


        const image_url = req.file?.path;

        const newTenant = await tenantServices.register({ canteen_id, nama, nama_tenant, nomor_telepon, email, password, image_url });

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

const getAllTenant = async (req, res) => {
    try {
        const tenants = await tenantServices.getAllTenant()
        res.status(200).json(buildResponseSuccess("successfully get all tenant", tenants));
    } catch (error) {
        res.status(500).json(buildResponseFailed("internal server error", error.message, null));
    }
}

const getCurrentTenant = async (req, res) => {
    try {
        const tenantId = req.userId;
        const tenant = await tenantServices.getCurrentTenant(tenantId);
        tenant.role = req.userRole;
        const menus = await menuServices.getMenu(tenantId)
        
        const result = {
            ...tenant,
            menus
        }
        return res.status(200).json(buildResponseSuccess("success get tenant", result));
    } catch (error) {
        return res.status(500).json(buildResponseFailed("internal server error", error.message, null));
    }
}

const getTenant = async (req, res) => {
    try {
        const tenantId = req.params.id;
        const tenant = await tenantServices.getTenantById(tenantId);

        if (!tenant) {
            return res.status(404).json(buildResponseFailed("tenant not found", "failed get menu", null));
        }
        
        const canteen = await canteenServices.getCanteenById(tenant.canteen_id)

        if (!canteen) {
            return res.status(404).json(buildResponseFailed("canteen not found", "failed get canteen", null));
        }

        const menus = await menuServices.getMenu(tenantId)

        const result = {
            ...tenant,
            nama_canteen: canteen.nama,
            departement: canteen.departement,
            latitude: canteen.latitude,
            longitude: canteen.longitude,
            menus
        }

        return res.status(200).json(buildResponseSuccess("success get tenant", result));
    } catch (error) {
        return res.status(500).json(buildResponseFailed("internal server error", error.message, null));
    }
}

const updateTenant = async (req, res) => {
    try {
        const tenantId = req.userId;
        const { nama, nama_tenant, nomor_telepon, email, password } = req.body;

        if (!nama && !nama_tenant && !nomor_telepon && !email && !password) {
            return res.status(400).json(buildResponseFailed("missing required fields", "invalid request body", null));
        }

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
};

const getQueue = async (req, res) => {
    try {
        const tenantId = req.params.id;

        if (!tenantId) return res.status(400).json(buildResponseFailed("missing required fields", "invalid request body", null));

        const queue = await tenantServices.getQueue(tenantId);

        return res.status(200).json(buildResponseSuccess("success get queue", queue))
    } catch (error) {
        return res.status(500).json(buildResponseFailed("internal server error", error.message, null));
    }
}

module.exports = {
    registerTenant,
    loginTenant,
    getCurrentTenant,
    getAllTenant,
    getTenant,
    updateTenant,
    deleteTenant,
    selectCanteen,
    getQueue
};