const canteenServices = require('../service/canteen_services')
const { buildResponseFailed, buildResponseSuccess } = require('../utils/response');

const createCanteen = async (req, res) => {
    try {
        const { nama, departement, lat, lng } = req.body;


        if (!nama || !departement || !lat || !lng) {
            return res.status(400).json(buildResponseFailed("failed parse body", "bad request body", null));
        }

        const newCanteen = await canteenServices.createCanteen({ nama, departement, lat, lng });

        res.status(201).json(buildResponseSuccess("success crate canteen", newCanteen));
    } catch (error) {
        res.status(500).json(buildResponseFailed("failed create canteen", error.message, null));
    }
};

module.exports = {
    createCanteen
}