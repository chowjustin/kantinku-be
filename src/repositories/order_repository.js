const db = require('../config/database');

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
    const { userId, tenantId, items, notes } = orders

    try {
        await client.query('BEGIN')

        const orderRes = await client.query(
            `INSERT INTO orders (user_id, tenant_id, notes)
             VALUES ($1, $2, $3)
             RETURNING *`,
            [userId, tenantId, notes || null]
        );
        const orderId = orderRes.rows[0].id;

        for (const { menu_id, quantity } of items) {

            await client.query(
                `INSERT INTO order_item (order_id, menu_id, quantity)
               VALUES ($1, $2, $3)`,
                [orderId, menu_id, quantity]
            );

            await client.query(
                `UPDATE menus
                 SET stok = stok - $1
                 WHERE id = $2`,
                [quantity, menu_id]
            );
        }

        await client.query('COMMIT');
        return orderRes.rows[0];
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
        WHERE id = $${values.length - 1} AND tenant_id = $${values.length}
        RETURNING *;
    `;

    try {
        const result = await db.query(query, values);
        return result.rows[0];
    } catch (error) {
        throw new Error("failed update order");
    }

}

const getOrderById = async (userId, orderId) => {
    try {
        // const result = await db.query(`SELECT * FROM orders WHERE user_id = $1 AND id = $2`, [userId, orderId]);
        const query = `
            SELECT 
                o.*, 
                oi.quantity,
                m.nama AS menu_name
            FROM orders o
            JOIN order_item oi ON o.id = oi.order_id
            JOIN menus m ON oi.menu_id = m.id
            WHERE o.id = $1
        `;

        const result = await db.query(query, [orderId]);
        return result.rows;
    } catch (error) {
        throw new Error('order not found')
    }
}
const getOrders = async (userId, role, orderStatusList, paymentStatusList) => {
    const userColumn = role === 'tenant' ? 'tenant_id' : 'user_id';
    let baseQuery = `
        SELECT * FROM orders
        WHERE NOW() < created_at + INTERVAL '60 minutes' AND ${userColumn} = $1
    `;

    const values = [userId];

    if (orderStatusList && orderStatusList.length > 0) {
        baseQuery += ` AND order_status = ANY($${values.length + 1})`;
        values.push(orderStatusList);
    }

    if (paymentStatusList && paymentStatusList.length > 0) {
        baseQuery += ` AND payment_status = ANY($${values.length + 1})`;
        values.push(paymentStatusList);
    }

    baseQuery += ` ORDER BY created_at DESC`;

    try {
        console.log(baseQuery, values)
        const result = await db.query(baseQuery, values);
        return result.rows;
    } catch (error) {
        console.log(error);
        throw new Error('orders not found');
    }
};

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
    const client = await db.connect();

    try {
        await client.query('BEGIN');

        const orderItems = await client.query(
            `SELECT menu_id, quantity FROM order_item WHERE order_id = $1`,
            [orderId]
        );

        for (const { menu_id, quantity } of orderItems.rows) {
            await client.query(
                `UPDATE menus SET stok = stok + $1 WHERE id = $2`,
                [quantity, menu_id]
            );
        }
        const result = await client.query(
            `DELETE FROM orders WHERE id = $1 AND user_id = $2 RETURNING *`,
            [orderId, userId]
        );

        await client.query('COMMIT');
        return result.rows[0];
    } catch (error) {
        await client.query('ROLLBACK');
        throw error.message;
    } finally {
        client.release();
    }
};

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

const getQueueAttr = async (tenantId) => {
    try {
        const query = `
        SELECT 
            o.id AS order_id,
            o.notes,
            o.order_status,
            o.created_at,
            u.nama AS user_name,
            oi.quantity,
            m.nama AS menu_name
        FROM orders o
        JOIN users u ON o.user_id = u.id
        JOIN order_item oi ON o.id = oi.order_id
        JOIN menus m ON oi.menu_id = m.id
        WHERE o.tenant_id = $1 AND o.order_status NOT IN ('completed', 'rejected') AND o.payment_status IN ('settlement')
        ORDER BY o.created_at ASC
        `;

        const result = await db.query(query, [tenantId]);
        return result.rows;
    } catch (error) {
        throw error;
    }
}

const markOrderAsDone = async (orderId) => {
    try {
        await db.query(`UPDATE orders SET order_status = 'ready' WHERE id = $1`, [orderId])
    } catch (error) {
        throw error;
    }
}

const updatePaymentToken = async (orderId, token, redirectUrl) => {
    const res = await db.query(
        `UPDATE orders 
         SET payment_token = $1, redirect_url = $2 
         WHERE id = $3
         RETURNING *`,
        [token, redirectUrl, orderId]
    )
    return res.rows[0]
}

module.exports = {
    create,
    updateById,
    getOrderById,
    getOrders,
    getPaymentData,
    deleteOrder,
    updateOrderItems,
    getOrderByUserId,
    updatePaymentStatus,
    getQueueAttr,
    markOrderAsDone,
    updatePaymentToken
}