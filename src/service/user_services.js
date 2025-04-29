const bcrypt = require('bcrypt');
const userRepository = require('../repositories/user_repository');
const { generateToken } = require('./jwt_services');

require('dotenv').config()

const register = async (userData) => {
    const { nama, nrp, nomor_telepon, email, password } = userData;

    const userByEmail = await userRepository.getUserByEmail(email);
    if (userByEmail) {
        throw new Error('Email already exists');
    }
    
    const userByNRP = await userRepository.getUserByNRP(nrp);
    if (userByNRP) {
        throw new Error('NRP already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await userRepository.create({
        nama,
        password: hashedPassword,
        nrp,
        nomor_telepon,
        email
    });

    return newUser;
};

const login = async (userData) => {
    const { email, password } = userData;

    const user = await userRepository.getUserByEmail(email);
    if (!user) {
        throw new Error('Invalid email');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new Error('Invalid password');
    }

    const token = generateToken(user.id, "student")
    return { 
        token,  
        role: "student"
    };
};

const getCurrentUser = async (userId) => {
    if (!userId) throw new Error('User ID is required');
    
    const user = await userRepository.findUserById(userId);

    if (!user) throw new Error('User not found');

    return user;
};

const updateUser = async (userId, updates) => {
    console.log('Updates in Service:', updates); // Log the updates
    console.log('User ID in Service:', userId); // Log the user ID

    const allowedFields = ['nama', 'email', 'nomor_telepon'];
    const updateKeys = Object.keys(updates);

    updateKeys.forEach(key => {
        if (!allowedFields.includes(key)) throw new Error(`Field ${key} is not allowed to be updated`);
    });

    const updatedUser = await userRepository.updateUserById(userId, updates);

    if (!updatedUser) throw new Error("Failed to update user");

    return updatedUser;
};

const deleteUser = async (userId) => {
    if (!userId) throw new Error('User ID is required');
    
    const deletedUser = await userRepository.deleteUserById(userId);

    if (!deletedUser) throw new Error('Failed to delete user');

    return deletedUser;
};


module.exports = {
    register,
    login,
    getCurrentUser,
    updateUser,
    deleteUser
};