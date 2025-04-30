import Midtrans from "midtrans-client";
import { buildResponseFailed, buildResponseSuccess } from "../utils/response";
const { getMenuById } = require("../service/menu_services");
require('dotenv').config();

const midtransClient = new Midtrans.Snap({
    isProduction: false,
    serverKey: process.env.MIDTRANS_SECRET
});

const getToken = async (req, res) => {
    try {
        // Diasumsikan order_id ada di req.body kalo gak harus ambil pake id user di database
        const { order_id, id_menu, quantity } = req.body;
        const menu = await getMenuById(id_menu);

        let parameter = {
            item_details: {
                name: menu.nama,
                harga: menu.harga,
                quantity: quantity,
            },
            transaction_details: {
                order_id: order_id,
                gross_amount: menu.harga * quantity
            }
        }

        const token = await midtransClient.createTransactionToken(parameter);
        if (!token) return res.status(404).json(buildResponseFailed("failed get midtrans token", "failed get midtrans token", null));

        return res.status(200).json(buildResponseSuccess("success get midtrans token", token)); 
    } catch (error) {
        return res.status(500).json(buildResponseFailed("internal server error", error.message, null));
    }
};

module.exports = getToken;