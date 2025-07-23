import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "@/api/axios";
import { GuepexParcel } from "@/types/delivery";

interface ParcelsType {
  message: string | null;
  data: GuepexParcel[];
  has_more: number;
  total_data: number;
  links?: {
    self: string | null;
  };

  loading: boolean;
  error: string | null;
  success: boolean;
}

const initParcels: ParcelsType = {
  message: null,
  data: [],
  has_more: 0,
  total_data: 0,
  links: {
    self: null,
  },

  loading: false,
  error: null,
  success: false,
};

interface PricingType {
  message: string | null;
  from_wilaya_name: string | null;
  to_wilaya_name: string | null;
  zone: number;
  retour_fee: number;
  cod_percentage: number;
  insurance_percentage: number;
  oversize_fee: number;
  per_commune: {
    [commune_id: string]: {
      commune_id: number;
      commune_name: string;
      express_home: number;
      express_desk: number;
      economic_home: number;
      economic_desk: number;
    };
  };
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initPricing: PricingType = {
  message: null,
  from_wilaya_name: null,
  to_wilaya_name: null,
  zone: 0,
  retour_fee: 0,
  cod_percentage: 0,
  insurance_percentage: 0,
  per_commune: {},
  loading: false,
  error: null,
  success: false,
  oversize_fee: 0,
};

interface WilayaType {
  loading: boolean;
  error: string | null;
  success: boolean;
  message: string | null;
  has_more: boolean;
  total_data: number;
  data: {
    id: number;
    name: string;
    zone: number;
    is_deliverable: number;
  }[];
}

const initWilayat: WilayaType = {
  message: null,
  loading: false,
  error: null,
  success: false,
  has_more: false,
  total_data: 0,
  data: [],
};

const initialState = {
  parcels: initParcels,
  pricing: initPricing,
  wilayat: initWilayat,
};

export const getParcels = createAsyncThunk(
  "delivery/getParcels",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/delivery/parcels");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch dashboard stats"
      );
    }
  }
);

export const getPricing = createAsyncThunk(
  "delivery/getPricing",
  async (
    args: {
      from: number;
      to: number;
    },
    { rejectWithValue }
  ) => {
    try {
      const { from, to } = args;
      const response = await axios.get(`/api/delivery/pricing/${from}/${to}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch dashboard stats"
      );
    }
  }
);

export const getWilayat = createAsyncThunk(
  "delivery/getWilayat",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`api/delivery/wilayat`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch wilayat"
      );
    }
  }
);

const deliverySlice = createSlice({
  name: "delivery",
  initialState,
  reducers: {
    clearPricingError: (state) => {
      state.pricing.error = null;
    },
    clearPricingSuccess: (state) => {
      state.pricing.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get parcels
      .addCase(getParcels.pending, (state) => {
        state.parcels.loading = true;
        state.parcels.error = null;
      })
      .addCase(getParcels.fulfilled, (state, action) => {
        const {
          message,
          data: { data, has_more, links, total_data },
        } = action.payload;
        state.parcels.message = message;
        state.parcels.data = data;
        state.parcels.has_more = has_more;
        state.parcels.total_data = total_data;
        state.parcels.links = links;
        state.parcels.loading = false;
      })
      .addCase(getParcels.rejected, (state, action) => {
        state.parcels.loading = false;
        state.parcels.error = action.payload as string;
      })

      /* GET PRICING OF DELIVERY */
      .addCase(getPricing.pending, (state) => {
        state.pricing.loading = true;
        state.pricing.error = null;
      })
      .addCase(getPricing.fulfilled, (state, action) => {
        const {
          message,
          data: {
            from_wilaya_name,
            to_wilaya_name,
            zone,
            retour_fee,
            cod_percentage,
            insurance_percentage,
            oversize_fee,
            per_commune,
          },
        } = action.payload;
        state.pricing.zone = zone;
        state.pricing.message = message;
        state.pricing.retour_fee = retour_fee;
        (state.pricing.per_commune = per_commune),
          (state.pricing.oversize_fee = oversize_fee);
        state.pricing.cod_percentage = cod_percentage;
        state.pricing.to_wilaya_name = to_wilaya_name;
        state.pricing.from_wilaya_name = from_wilaya_name;
        state.pricing.insurance_percentage = insurance_percentage;
        state.pricing.loading = false;
      })
      .addCase(getPricing.rejected, (state, action) => {
        state.pricing.loading = false;
        state.pricing.error = action.payload as string;
      })

      /* GET WILAYAT OF DELIVERY */
      .addCase(getWilayat.pending, (state) => {
        state.wilayat.loading = true;
        state.wilayat.error = null;
      })
      .addCase(getWilayat.fulfilled, (state, action) => {
        const {
          message,
          data: { has_more, total_data, data },
        } = action.payload;

        state.wilayat.data = data;
        state.wilayat.message = message;
        state.wilayat.has_more = has_more;
        state.wilayat.total_data = total_data;
        state.wilayat.loading = false;
      })
      .addCase(getWilayat.rejected, (state, action) => {
        state.wilayat.loading = false;
        state.wilayat.error = action.payload as string;
      });
  },
});

export default deliverySlice.reducer;
