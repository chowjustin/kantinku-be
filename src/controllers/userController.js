const { getCurrentUser, updateUser, deleteUser } = require('../services/userService');

const getCurrentUserController = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await getCurrentUser(userId);

        return res.status(200).json({
            status: true,
            message: "success get user",
            data: user
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message,
            data: null
        });
    }
};

const updateUserController = async (req, res) => {
    try {
        const userId = req.user.id;
        const updates = req.body;

        const updatedUser = await updateUser(userId, updates);

        return res.status(200).json({
            status: true,
            message: "success update user",
            data: updatedUser
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message,
            data: null
        });
    }
}

const deleteUserController = async (req, res) => {
    try {
        const userId = req.user.id;
        await deleteUser(userId);

        return res.status(200).json({
            status: true,
            message: "success delete user",
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message,
        })
    }
};

module.exports = { getCurrentUserController, updateUserController, deleteUserController };