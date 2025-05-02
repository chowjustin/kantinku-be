const menuRepository = require('../repositories/menu_repository')
const orderRepository = require('../repositories/order_repository') 
const orderItemRepository = require('../repositories/order_item_repository') 
const midtransServices = require('./midtrans_services')


const createOrderItem = async (orderId, orderItemData) => {
    const { menu_id, quantity } = orderItemData;

    const menu = await menuRepository.getMenuById(menu_id);
    if (!menu) {
        throw new Error(`menu id not found`);
    }

    if (quantity > menu.stok) {
        throw new Error(`insufficient stock for menu id `);
    }

    const orderItem = {
        order_id: orderId,
        menu_id: menu_id,
        quantity: quantity
    };

    const result = await orderItemRepository.createOrderItem(orderItem);
    if (!result) {
        throw new Error('failed to create order item');
    }

    return result;
};

const updateQuantity = async (orderId, itemId, quantity) => {
    const orderItem = await orderItemRepository.getOrderItemByMenuId(orderId, itemId);
    if (!orderItem) {
        throw new Error(`order item with id not found`);
    }

    const menu = await menuRepository.getMenuById(orderItem.menu_id);
    if (!menu) {
        throw new Error(`menu id not found`);
    }

    if (quantity > menu.stok) {
        throw new Error(`insufficient stock`);
    }

    const updatedOrderItem = await orderItemRepository.updateOrderItemQuantity(orderId, itemId, quantity);
    if (!updatedOrderItem) {
        throw new Error('failed to update order item quantity');
    }

    return updatedOrderItem;
};

const getOrderItem = async (orderId) => {
    const orderItems = await orderItemRepository.getOrderItemsByOrderId(orderId);
    if (!orderItems) {
        throw new Error(`order item not found`);
    }
    return orderItems;
};

const deleteOrderItem = async (orderId, menuId) => {
    const result = await orderItemRepository.deleteOrderItem(orderId, menuId);
    if (!result) {
        throw new Error(`failed to delete menu in order`);
    }
    return result;
};

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

    await orderItemRepository.updateOrderItems(orderId, items).catch(() => {
        throw new Error('failed to update order items');
    }); 

    const updatedPayment = await updatePayment(userId, orderId, totalCost, item_details);
    if (!updatedPayment) {
        throw new Error('failed to update payment');
    }

    return updatedPayment;
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

module.exports = {
    createOrderItem,
    updateQuantity,
    getOrderItem,
    deleteOrderItem,
    updateOrderItems
}