const jwtService = require('../service/jwt_services');
const { buildResponseFailed } = require('../utils/response');

require('dotenv').config()

const authenticate = async (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        const response = buildResponseFailed('Failed to process request', 'Token not found', null);
        return res.status(401).json(response);
    }

    if (!authHeader.startsWith('Bearer ')) {
        const response = buildResponseFailed('Failed to process request', 'Token not valid', null);
        return res.status(401).json(response);
    }

    const token = authHeader.slice(7); 

    try {
        const decoded = await jwtService.validateToken(token);

        if (!decoded || typeof decoded !== 'object') {
            const response = buildResponseFailed('Failed to process request', 'Access denied', null);
            return res.status(401).json(response);
        }

        const userId = decoded.id;
        if (!userId) {
            const response = buildResponseFailed('Failed to process request', 'User ID not found in token', null);
            return res.status(401).json(response);
        }

        req.token = token;
        req.userId = String(userId); 
        next();
    } catch (err) {
        const response = buildResponseFailed('Failed to process request', err.message || 'Invalid token', null);
        return res.status(401).json(response);
    }
};


module.exports = { authenticate }