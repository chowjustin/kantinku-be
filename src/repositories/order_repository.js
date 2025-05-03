const db = require('../config/database')

const getOrderByUserId = async (userId) => {
    try {
        const result = await db.query('SELECT * FROM orders WHERE user_id = $1', [userId]);

        return result.rows[0];
    } catch (error) {
        throw new Error(error.message);
    }
}

const create = async (orders) => {
    const client = await db.connect()
    const { userId, tenantId, items } = orders

    try {
        await client.query('BEGIN')

        const orderRes = await client.query(
            `INSERT INTO orders (user_id, tenant_id)
             VALUES ($1, $2)
             RETURNING id`,
            [userId, tenantId]
        );
        const orderId = orderRes.rows[0].id;

        for (const { menu_id, quantity } of items) {

            await client.query(
                `INSERT INTO order_item (order_id, menu_id, quantity)
               VALUES ($1, $2, $3)`,
                [orderId, menu_id, quantity]
            );
        }

        await client.query('COMMIT');
        return orderId;
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
}

const updateById = async (userId, orderId, updates) => {
    const fields = Object.keys(updates).map((key, index) => `${key} = $${index + 1}`).join(', ');

    if (fields.length === 0) throw new Error('No fields to update');

    const values = [...Object.values(updates), orderId, userId];

    const query = `
        UPDATE orders 
        SET ${fields} 
        WHERE id = $${values.length - 1} AND user_id = $${values.length}
        RETURNING id, tenant_id, order_status, payment_status, token, expires_at;
    `;

    try {
        const result = await db.query(query, values);

        if (result.rowCount === 0) {
            throw new Error('order not found');
        }

        return result.rows[0];
    } catch (error) {
        throw new Error(error.message);
    }

}

const getOrderById = async (userId, orderId) => {
    try {
        const result = await db.query(`SELECT * FROM orders WHERE user_id = $1 AND id = $2`, [userId, orderId]);
        return result.rows[0];
    } catch (error) {
        throw new Error('order not found')
    }
}

const getPaymentData = async (userId, orderId) => {
    const queryTotal = `
        SELECT SUM(m.harga * ot.quantity) AS total
        FROM orders o
        JOIN order_item ot ON o.id = ot.order_id
        JOIN menus m ON m.id = ot.menu_id  
        WHERE o.id = $1 AND o.user_id = $2
    `
    const queryItems = `
        SELECT menu_id, quantity, harga AS price, nama AS name 
        FROM orders o
        JOIN order_item ot ON o.id = ot.order_id
        JOIN menus m ON m.id = ot.menu_id
        WHERE o.id = $1 AND o.user_id = $2
    `

    try {
        const totalCost = await db.query(queryTotal, [orderId, userId])
        if (!totalCost.rows[0].total) {
            throw new Error('cannot get total cost')
        }
        
        const items = await db.query(queryItems, [orderId, userId])
        if (items.rowCount === 0) {
            throw new Error('cannot get order items')
        }

        return {
            totalCost: totalCost.rows[0].total,
            items: items.rows
        }
    } catch (error) {
        throw error
    }
}

const deleteOrder = async (userId, orderId) => {
    try {
        const result = await db.query(
            `DELETE FROM orders WHERE id = $1 AND user_id = $2 RETURNING id`,
            [orderId, userId]
        )
    
        if (result.rowCount == 0) {
            throw new Error('order not found')
        }
    
        return result.rows[0]
    } catch (error) {
        throw error
    }
}

const updateOrderItems = async (orderId, items) => {
    const client = await db.connect();

    try {
        await client.query('BEGIN');

        await client.query(`DELETE FROM order_item WHERE order_id = $1`, [orderId]);

        for (const { menu_id, quantity } of items) {
            await client.query(
                `INSERT INTO order_item (order_id, menu_id, quantity)
                 VALUES ($1, $2, $3)`,
                [orderId, menu_id, quantity]
            );
        }

        await client.query('COMMIT');
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
};

const updatePaymentStatus = async (orderId, paymentStatus) => {
    try {
        await db.query('UPDATE orders SET payment_status = $1 WHERE id = $2', [paymentStatus, orderId]);
    } catch (error) {
        console.error("DB update error:", error);
        throw error;
    }
}

module.exports = {
    create,
    updateById,
    getOrderById,
    getPaymentData,
    deleteOrder,
    updateOrderItems,
    getOrderByUserId,
    updatePaymentStatus
}