const jwt = require('jsonwebtoken')
require('dotenv').config();

const secretKey = process.env.JWT_SECRET; 

const validateToken = (token) => {
    try {
        const decoded = jwt.verify(token, secretKey);
        return decoded;
    } catch (err) {
        throw err;
    }
};

const getUserIdByToken = async (token) => {
    try {
        const decoded = await validateToken(token)
        const userId = decoded.id
        return userId ? String(userId) : null
    } catch (error) {
        throw error
    }
}

const getRoleByToken = async (token) => {
    try {
        const decoded = await validateToken(token)
        const role = decoded.role
        return role ? String(role) : null
    } catch (error) {
        throw error
    }
}

module.exports = {
    validateToken,
    getUserIdByToken,
    getRoleByToken,
}