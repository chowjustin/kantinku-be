const db = require('../config/database')

const createOrderItem = async (orderItem) => {
    const { order_id, menu_id, quantity } = orderItem;
    const client = await db.connect();

    try {
        await client.query('BEGIN');

        const updateStockQuery = `UPDATE menus SET stok = stok - $1 WHERE id = $2`;
        await client.query(updateStockQuery, [quantity, menu_id]);

        const insertQuery = `INSERT INTO order_item (order_id, menu_id, quantity) VALUES ($1, $2, $3) RETURNING *`;
        const created = await client.query(insertQuery, [order_id, menu_id, quantity]);
        if (!created) {
            throw new Error('failed to create menu')
        }

        await client.query('COMMIT');
        return created.rows[0];
    } catch (error) {
        await client.query('ROLLBACK');
        throw new Error(error.message );
    } finally {
        client.release();
    }
};

const updateOrderItemQuantity = async (orderId, menuId, newQuantity) => {
    const client = await db.connect();

    try {
        await client.query('BEGIN');

        const getOrderItemQuery = `SELECT quantity FROM order_item WHERE order_id = $1 AND menu_id = $2`;
        const orderItemResult = await client.query(getOrderItemQuery, [orderId, menuId]);

        const curr = orderItemResult.rows[0].quantity;
        const diff = newQuantity - curr;

        const updateStockQuery = `UPDATE menus SET stok = stok - $1 WHERE id = $2`;
        await client.query(updateStockQuery, [diff, menuId]);

        const updateOrderItemQuery = `UPDATE order_item SET quantity = $1 WHERE order_id = $2 AND menu_id = $3 RETURNING *`;
        const updatedOrderItem = await client.query(updateOrderItemQuery, [newQuantity, orderId, menuId]);

        await client.query('COMMIT');
        return updatedOrderItem.rows[0];
    } catch (error) {
        await client.query('ROLLBACK');
        throw new Error('failed to update order item quantity');
    } finally {
        client.release();
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
    const client = await db.connect();

    try {
        await client.query('BEGIN');

        const deleteQuery = `DELETE FROM order_item WHERE order_id = $1 AND menu_id = $2 RETURNING *`;
        const deleteResult = await client.query(deleteQuery, [orderId, menuId]);

        const updateStockQuery = `UPDATE menus SET stok = stok + $1 WHERE id = $2`;
        await client.query(updateStockQuery, [deleteResult.rows[0].quantity, menuId]);

        await client.query('COMMIT');
        return deleteResult.rowCount;
    } catch (error) {
        await client.query('ROLLBACK');
        throw new Error(error.message);
    } finally {
        client.release();
    }
};

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

        return items.length
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        await client.query('COMMIT');
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