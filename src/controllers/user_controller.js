const userService = require('../service/user_services');
const { buildResponseFailed, buildResponseSuccess } = require('../utils/response');

const registerUser = async (req, res) => {
    try {
        const { nama, nrp, nomor_telepon, email, password } = req.body;

        if (!nama || !nrp || !nomor_telepon || !email || !password) {
            return res.status(400).json(buildResponseFailed("missing required fields", "invalid request body", null));
        }

        const newUser = await userService.register({ nama, nrp, nomor_telepon, email, password });

        res.status(201).json(buildResponseSuccess("user created successfully", newUser));
    } catch (error) {
        res.status(500).json(buildResponseFailed(error.message, "failed create user", null));
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json(buildResponseFailed("missing required fields", "invalid request body", null));
        }

        const result = await userService.login({ email, password });

        res.status(200).json(buildResponseSuccess("successfully logged in to user", result));
    } catch (error) {
        res.status(500).json(buildResponseFailed(error.message, "internal server error", null));
    }
};

const getCurrentUser = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await userService.getCurrentUser(userId);
        user.role = req.userRole;

        return res.status(200).json(buildResponseSuccess("success get user", user));
    } catch (error) {
        return res.status(500).json(buildResponseFailed("internal server error", error.message, null));
    }
};

const updateUser = async (req, res) => {
    try {
        const userId = req.userId;
        const { nama, nomor_telepon, email, password } = req.body;

        if (!nama || !nomor_telepon || !email || !password) {
            return res.status(400).json(buildResponseFailed("missing required fields", "invalid request body", null));
        }

        const updates = req.body;

        const updatedUser = await userService.updateUser(userId, updates);

        return res.status(200).json(buildResponseSuccess("success update user", updatedUser));
    } catch (error) {
        return res.status(500).json(buildResponseFailed("internal server error", error.message, null));
    }
};

const deleteUser = async (req, res) => {
    try {
        const userId = req.userId;
        await userService.deleteUser(userId);

        return res.status(200).json(buildResponseSuccess("success delete user", null));
    } catch (error) {
        return res.status(500).json(buildResponseFailed("internal server error", error.message, null));
    }
};

const getUserOrders = async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId) return res.status(400).json(buildResponseFailed("missing user ID", "invalid request", null));
        const orders = await userService.getUserOrders(userId);
        if (!orders) return res.status(404).json(buildResponseFailed("orders not found", "failed to get orders". null));

        return res.status(200).json(buildResponseSuccess("success get orders", orders));
    } catch (error) {
        return res.status(500).json(buildResponseFailed("internal server error", error.message, null));        
    }
}

module.exports = {
    registerUser,
    loginUser,
    getCurrentUser,
    updateUser,
    deleteUser,
    getUserOrders
};