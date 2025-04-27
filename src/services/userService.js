const { findUserById, updateUserById, deleteUserById } = require('../repositories/userRepository');

const getCurrentUser = async (userId) => {
    if (!userId) throw new Error('User ID is required');
    
    const user = await findUserById(userId);

    if (!user) throw new Error('User not found');

    return user;
};

const updateUser = async (userId, updates) => {
    const allowedFields = ['nama', 'email', 'nomor_telepon'];
    const updateKeys = Object.keys(updates);

    updateKeys.forEach(key => {
        if (!allowedFields.includes(key)) throw new Error(`Field ${key} is not allowed to be updated`);
    });

    const updatedUser = await updateUserById(userId, updates);

    if (!updatedUser) throw new Error("Failed to update user");

    return updatedUser;
};

const deleteUser = async (userId) => {
    if (!userId) throw new Error('User ID is required');
    
    const deletedUser = await deleteUserById(userId);

    if (!deletedUser) throw new Error('Failed to delete user');

    return deletedUser;
};

module.exports = { getCurrentUser, updateUser, deleteUser };