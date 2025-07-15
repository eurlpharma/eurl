// services/yalidine.js
import axios from "axios";

const YALIDINE_API_URL = "https://api.yalidine.com/v1";
const YALIDINE_API_KEY = "YOUR_API_KEY";

export async function createShipment(order: any) {
  const payload = {
    orders: [
      {
        order_id: order.id,
        firstname: order.client.firstName,
        lastname: order.client.lastName,
        address: order.address,
        city: order.city,
        wilaya: order.wilaya,
        phone: order.phone,
        products: order.items.map((item: any) => `${item.name} x${item.quantity}`),
        price: order.total,
      },
    ],
  };

  const headers = {
    Authorization: `Bearer ${YALIDINE_API_KEY}`,
    "Content-Type": "application/json",
  };

  try {
    const res = await axios.post(`${YALIDINE_API_URL}/shipments`, payload, { headers });
    return res.data;
  } catch (error: any) {
    throw error;
  }
}
