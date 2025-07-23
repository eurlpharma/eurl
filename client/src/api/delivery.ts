import api from "./axios"

export const getOrders = async () => {
  const res = await api.get('/api/delivery/orders')
  return res.data
}
