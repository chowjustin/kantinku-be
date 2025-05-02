const menuRepository = require('../repositories/menu_repository')
const orderRepository = require('../repositories/order_repository')
const midtransServices = require('./midtrans_services')

const createOrder = async (userId, items) => {
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
        items
    }

    const orderId = await orderRepository.create(order)
    if (!orderId) {
        throw new Error('failed to create order')
    }

    const updated = updatePayment(orderId, totalCost, item_details)
    if (!updated) {
        throw new Error('failed update order')
    }

    return updated
}

const getOrder = async (userId, orderId) => {
    const order = await orderRepository.getOrderById(userId, orderId)
    if (!order) {
        throw new Error('failed get order')
    }

    const currentDate = new Date();
    if (currentDate > new Date(order.expires_at)) {

        const paymentData = await orderRepository.getPaymentData(userId, orderId)
        if (!paymentData) {
            throw new Error('failed get payment data')
        }

        const updated = await updatePayment(orderId, paymentData.totalCost, paymentData.items)
        if (!updated) {
            throw new Error('failed update order')
        }

        return updated
    }

    return order
}

const updatePayment = async (orderId, totalCost, item_details) => {
    const paymentData = await midtransServices.getToken(orderId, totalCost, item_details);
    if (!paymentData) {
        throw new Error('failed create token')
    }

    const updated = await orderRepository.updateById(
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

const updateOrderItems = async (userId, orderId, items) => {
    let tenantId = ''
    let totalCost = 0;
    let item_details = [];

    const menuIds = items.map(item => item.menu_id);
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
        });

        totalCost += menu.harga * quantity;
    }

    await orderRepository.updateOrderItems(orderId, items).catch(() => {
        throw new Error('failed to update order items');
    }); 

    const updatedPayment = await updatePayment(orderId, totalCost, item_details);
    if (!updatedPayment) {
        throw new Error('failed to update payment');
    }

    return updatedPayment;
}


module.exports = {
    createOrder,
    updatePayment,
    getOrder,
    deleteOrder,
    updateOrderItems,
}