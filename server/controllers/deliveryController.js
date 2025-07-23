import axios from "axios";
import asyncHandler from "express-async-handler";

const GUEPEX_ID = process.env.GUEPEX_ID;
const GUEPEX_TOKEN = process.env.GUEPEX_TOKEN;
const GUEPEX_API = process.env.GUEPEX_API;

// const GUEPEX_API = "https://api.guepex.app/v1/fees/?from_wilaya_id=16&to_wilaya_id=48"

// v1/fees/?from_wilaya_id=16&to_wilaya_id=48

const getPricing = asyncHandler(async (req, res) => {
  const { from, to } = req.params;
  const fees = `/fees/?from_wilaya_id=${from}&to_wilaya_id=${to}`;

  if (!from || !to) {
    return res.status(400).json({
      message: "Invalid parameters",
      error: "From & to is required",
    });
  }

  try {
    const { data } = await axios.get(`${GUEPEX_API}/v1${fees}`, {
      headers: {
        "X-API-ID": GUEPEX_ID,
        "X-API-TOKEN": GUEPEX_TOKEN,
      },
      timeout: 10000,
      maxRedirects: 5,
    });

    if (!data.from_wilaya_name || !data.to_wilaya_name) {
      res.status(500).json({
        message: "Error",
        error: "Invalid wilaya",
      });
    }

    res.status(200).json({
      message: "Pricing",
      data: data,
    });
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: "Error fetching delivery pricing",
      error: err.response?.data || "Unknown error from GUEPEX API",
    });
  }
});

const getWilayat = asyncHandler(async (req, res) => {
  try {
    const { data } = await axios.get(`${GUEPEX_API}/v1/wilayas/`, {
      headers: {
        "X-API-ID": GUEPEX_ID,
        "X-API-TOKEN": GUEPEX_TOKEN,
      },
    });

    res.status(200).json({
      message: "Wilayat",
      data: data,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error",
      error: err.response?.data || "Unknown error from GUEPEX API",
    });
  }
});

/* Get all orders from guepex */
const getOrders = asyncHandler(async (req, res) => {
  try {
    const { data } = await axios.get(`${GUEPEX_API}/v1/parcels`, {
      headers: {
        "X-API-ID": GUEPEX_ID,
        "X-API-TOKEN": GUEPEX_TOKEN,
      },
    });

    res.status(200).json({
      message: 'orders',
      data: data
    })
  } catch (err) {
    res.status(500).json({
      message: "Error",
      error: err.response?.data || "Unknown error from GUEPEX API",
    });
  }
});

export { getPricing, getWilayat, getOrders };
