const canteenServices = require('../service/canteen_services')
const { buildResponseFailed, buildResponseSuccess } = require('../utils/response');

const createCanteen = async (req, res) => {
    try {
        const { nama, departement, lat, lng } = req.body;


        if (!nama || !departement || !lat || !lng) {
            return res.status(400).json(buildResponseFailed("missing required fields", "invalid request body", null));
        }

        const newCanteen = await canteenServices.createCanteen({ nama, departement, lat, lng });

        res.status(201).json(buildResponseSuccess("canteen created successfully", newCanteen));
    } catch (error) {
        res.status(500).json(buildResponseFailed(error.message, "error creating canteen", null));
    }
};

module.exports = {
    createCanteen
}