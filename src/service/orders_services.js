const { notification } = require('midtrans-client/lib/snapBi/snapBi')
const midtrans = require('../config/midtrans')
const menuRepository = require('../repositories/menu_repository')
const orderRepository = require('../repositories/order_repository')
const midtransServices = require('./midtrans_services')

const createOrder = async (userId, items, notes) => {
    let tenantId = ''
    let totalCost = 0
    let item_details = []

    const menuIds = items.map(item => item.menu_id)
    const menus = await menuRepository.getMenuByIds(menuIds);
    const menuMap = new Map(menus.map(menu => [menu.id, menu]));

    for (const item of items) {
        const { menu_id, quantity } = item;
        const menu = menuMap.get(menu_id);

        if (!menu) {
            throw new Error(`menu id ${menu_id} not found`);
        }

        if (quantity > menu.stok) {
            throw new Error(`insufficient stock for menu id ${menu_id}`);
        }

        if (!tenantId) {
            tenantId = menu.tenant_id;
        } else if (tenantId !== menu.tenant_id) {
            throw new Error('order contains multiple tenants');
        }

        item_details.push({
            id: menu.id,
            quantity: quantity,
            price: menu.harga,
            name: menu.nama,
        })

        totalCost += menu.harga * quantity;
    }

    const order = {
        userId,
        tenantId,
        items,
        notes
    }

    const orderRes = await orderRepository.create(order)
    if (!orderRes) {
        throw new Error('failed to create order')
    }

    const paymentData = await midtransServices.getToken(orderRes.id, totalCost, item_details)
    if (!paymentData) {
        throw new Error('failed create token')
    }

    await orderRepository.updatePaymentToken(orderRes.id, paymentData.token, midtrans.redirect_url + paymentData.token)

    return {
        ...orderRes,
        payment_token: paymentData.token,
        redirect_url: midtrans.redirect_url + paymentData.token
    }
}

const getOrder = async (userId, orderId) => {
    const rows = await orderRepository.getOrderById(userId, orderId);
    if (!rows || rows.length === 0) {
        throw new Error('failed get order');
    }

    const {
        id,
        user_id,
        tenant_id,
        order_status,
        payment_status,
        notes,
        estimasi,
        antrian,
        payment_status_updated_at,
        order_status_updated_at,
        created_at,
        payment_token,
        redirect_url
    } = rows[0];

    const items = rows.map(row => ({
        menu_name: row.menu_name,
        quantity: row.quantity,
    }));

    return {
        order: {
            id,
            user_id,
            tenant_id,
            order_status,
            payment_status,
            notes,
            estimasi,
            antrian,
            payment_status_updated_at,
            order_status_updated_at,
            created_at,
            payment_token,
            redirect_url,
            items
        }
    };
};

const getOrders = async (userId, role, orderStatusList, paymentStatusList) => {
    const orders = await orderRepository.getOrders(userId, role, orderStatusList, paymentStatusList)
    return orders
}

const updatePayment = async (userId, orderId, totalCost, item_details) => {
    const paymentData = await midtransServices.getToken(orderId, totalCost, item_details);

    if (!paymentData) {
        throw new Error('failed create token')
    }

    const updated = await orderRepository.updateById(
        userId,
        orderId,
        {
            token: paymentData.token,
            expires_at: paymentData.expires_at
        }
    )

    if (!updated) {
        throw new Error('failed update order')
    }

    return updated
}

const deleteOrder = async (userId, orderId) => {
    const deleteOrder = await orderRepository.deleteOrder(userId, orderId)
    if (!deleteOrder) {
        throw new Error('failed to detele')
    }
    return deleteOrder
}

const updateOrder = async (userId, orderId, updates) => {
    const allowedFields = ['order_status', 'estimasi', 'antrian'];
    const updateKeys = Object.keys(updates);

    updateKeys.forEach(key => {
        if (!allowedFields.includes(key)) throw new Error(`Field ${key} is not allowed to be updated`);
    });

    const updated = await orderRepository.updateById(userId, orderId, updates)
    if (!updated) throw new Error("Failed to update order");

    return updated;
}

const setPaymentStatus = async (notificationData) => {
    orderId = notificationData.order_id;

    if (!orderId) throw new Error('order id is missing');

    const status = notificationData.transaction_status;

    if (!status) throw new Error('transaction status is missing');

    await orderRepository.updatePaymentStatus(orderId, status);
}

const orderDone = async (orderId) => {
    await orderRepository.markOrderAsDone(orderId);
};

module.exports = {
    createOrder,
    updatePayment,
    getOrder,
    getOrders,
    deleteOrder,
    // getPaymentToken,
    updateOrder,
    setPaymentStatus,
    orderDone
}