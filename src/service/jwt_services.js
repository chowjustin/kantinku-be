const jwt = require('jsonwebtoken')
const secretKey = process.env.JWT_SECRET;

const validateToken = async (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secretKey, (err, decoded) => {
            if (err) {
                return reject(err)
            }
            resolve(decoded)
        })
    })
}

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