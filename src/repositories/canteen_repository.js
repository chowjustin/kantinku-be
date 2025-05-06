const db = require('../config/database');

const create = async (canteenData) => {
    const { nama, departement, lat, lng } = canteenData;

    const query = `
        INSERT INTO canteen (nama, departement, latitude, longitude)
        VALUES ($1, $2, $3, $4)
        RETURNING id, nama, latitude, longitude;
    `;

    const values = [nama, departement, lat, lng];

    try {
        const result = await db.query(query, values);
        return result.rows[0];
    } catch (error) {
        throw new Error(error.message);
    }
}

const getCanteenByLatandLng = async (lat, lng) => {
    const query = `
        SELECT *
        FROM canteen
        WHERE latitude = $1 AND longitude = $2;
    `;

    const values = [lat, lng];

    try {
        const result = await db.query(query, values);
        return result.rows[0];
    } catch (error) {
        throw new Error(error.message);
    }
}

const getAllCanteens = async () => {
    const result = await db.query('SELECT * FROM canteen');

    return result.rows;
}

const getCanteenById = async (canteenId) => {
    try {
        const result = await db.query('SELECT departement, nama, latitude, longitude FROM canteen WHERE id = $1', [canteenId]);
        return result.rows[0];
    } catch (error) {
        throw new Error(error.message);
    }
}


module.exports = {
    create,
    getCanteenByLatandLng,
    getCanteenById,
    getAllCanteens
}