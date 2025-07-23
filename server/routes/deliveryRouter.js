
import express from "express"

import { getPricing, getWilayat, getOrders } from "../controllers/deliveryController.js"


const router = express.Router()


router.get('/parcels', getOrders)
router.get('/wilayat', getWilayat)
router.get('/pricing/:from/:to', getPricing)













export default router