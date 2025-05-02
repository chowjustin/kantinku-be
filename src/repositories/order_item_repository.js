const db = require('../config/database')

const createOrderItem = async (orderItem) => {
    const { order_id, menu_id, quantity } = orderItem;
    const query = `INSERT INTO order_item (order_id, menu_id, quantity) VALUES ($1, $2, $3) RETURNING *`;
    try {
        const result = await db.query(query, [order_id, menu_id, quantity]);
        return result.rows[0];
    } catch (error) {
        throw new Error('failed to create order item');
    }
};

const updateOrderItemQuantity = async (orderId, menuId, quantity) => {
    const query = `UPDATE order_item SET quantity = $1 WHERE order_id = $2 AND menu_id = $3 RETURNING *`;
    try {
        const result = await db.query(query, [quantity, orderId, menuId]);
        if (result.rowCount === 0) {
            throw new Error('order item not found');
        }
        return result.rows[0];
    } catch (error) {
        throw new Error('failed to update order item quantity');
    }
};

const getOrderItemsByOrderId = async (orderId) => {
    query = `SELECT menu_id, quantity FROM order_item WHERE order_id = $1`
    try {
        const result = await db.query(query, [orderId]);
        return result.rows;
    } catch (error) {
        throw new Error('order item not found')
    }
}

const deleteOrderItem = async (orderId, menuId) => {
    query = `DELETE FROM order_item WHERE order_id = $1 AND menu_id = $2`
    try {
        const result = await db.query(query, [orderId, menuId]);
        return result.rowCount;
    } catch (error) {
        throw new Error('order item not found')
    }
}

const getOrderItemByMenuId = async (orderId, menuId) => {
    const query = `SELECT * FROM order_item WHERE order_id = $1 AND menu_id = $2`;
    try {
        const result = await db.query(query, [orderId, menuId]);
        if (result.rowCount === 0) {
            throw new Error('order item not found');
        }
        return result.rows[0];
    } catch (error) {
        throw new Error('failed to get order item');
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

module.exports = {
    getOrderItemsByOrderId,
    getOrderItemByMenuId,
    deleteOrderItem,
    updateOrderItems,
    updateOrderItemQuantity,
    createOrderItem
}