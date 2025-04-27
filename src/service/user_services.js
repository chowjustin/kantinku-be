const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/user_repository');

require('dotenv').config()

const register = async (userData) => {
    const { nama, nrp, nomor_telepon, email, password } = userData;

    const existingUser = await userRepository.getUserByEmail(email);
    if (existingUser) {
        throw new Error('User already exists');
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

    const token = jwt.sign({ id: user.id, role: "student" }, process.env.JWT_SECRET, {
        expiresIn: '3h',
    });

    return { 
        token,  
        role: "student"
    };
};

module.exports = {
    register,
    login,
};