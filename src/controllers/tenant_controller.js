const tenantServices = require('../service/tenant_services');
const { buildResponseFailed, buildResponseSuccess } = require('../utils/response');

const registerTenant = async (req, res) => {
    try {
        const { canteen_id, nama, nama_tenant, nomor_telepon, email, password } = req.body;

        if (!canteen_id)  {
            return res.status(400).json(buildResponseFailed("should add canteen", "bad request body", null));
        }

        if (!nama || !nama_tenant || !nomor_telepon || !email || !password) {
            return res.status(400).json(buildResponseFailed("failed parse body", "bad request body", null));
        }

        const newTenant = await tenantServices.register({ canteen_id, nama, nama_tenant, nomor_telepon, email, password });

        res.status(201).json(buildResponseSuccess("success crate tenant", newTenant));
    } catch (error) {
        res.status(500).json(buildResponseFailed("failed create tenant", error.message, null));
    }
};

const loginTenant = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json(buildResponseFailed("bad request body", "failed parse body", null));
        }

        const result = await tenantServices.login({ email, password });

        res.status(200).json(buildResponseSuccess("succes login to tenant", result));
    } catch (error) {
        res.status(500).json(buildResponseFailed("somehting wrong", error.message, null));
    }
};

module.exports = {
    registerTenant,
    loginTenant,
};