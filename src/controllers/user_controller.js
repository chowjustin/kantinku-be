const userService = require('../service/user_services');
const { buildResponseFailed, buildResponseSuccess } = require('../utils/response');

const registerUser = async (req, res) => {
    try {
        const { nama, nrp, nomor_telepon, email, password } = req.body;

        if (!nama || !nrp || !nomor_telepon || !email || !password) {
            return res.status(400).json(buildResponseFailed("bad request body", "failed parse body", null));
        }

        const newUser = await userService.register({ nama, nrp, nomor_telepon, email, password });

        res.status(201).json(buildResponseSuccess("success crate user", newUser));
    } catch (error) {
        res.status(500).json(buildResponseFailed("failed create user", error.message, null));
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json(buildResponseFailed("bad request body", "failed parse body", null));
        }

        const result = await userService.login({ email, password });

        res.status(200).json(buildResponseSuccess("succes login to user", result));
    } catch (error) {
        res.status(500).json(buildResponseFailed("something wrong", error.message, null));
    }
};

module.exports = {
    registerUser,
    loginUser
};