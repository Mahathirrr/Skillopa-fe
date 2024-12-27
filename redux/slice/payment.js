import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API = process.env.NEXT_PUBLIC_API_ENDPOINT;

const initialState = {
  createPayment: {
    loading: false,
    error: false,
    success: false,
    data: null,
  },
  paymentStatus: {
    loading: false,
    error: false,
    success: false,
    data: null,
  },
  earnings: {
    loading: false,
    error: false,
    success: false,
    data: null,
  },
};

export const createPayment = createAsyncThunk(
  "payment/create",
  async (courseId, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API}/payment/create`, { courseId });
      return response.data;
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error.response.data.error);
    }
  },
);

export const getPaymentStatus = createAsyncThunk(
  "payment/status",
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API}/payment/status/${orderId}`);
      return response.data;
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error.response.data.error);
    }
  },
);

export const getInstructorEarnings = createAsyncThunk(
  "payment/earnings",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API}/instructor/earnings`);
      return response.data;
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error.response.data.error);
    }
  },
);

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    resetPaymentState: (state) => {
      state.createPayment = initialState.createPayment;
      state.paymentStatus = initialState.paymentStatus;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Payment
      .addCase(createPayment.pending, (state) => {
        state.createPayment.loading = true;
        state.createPayment.error = false;
      })
      .addCase(createPayment.fulfilled, (state, action) => {
        state.createPayment.loading = false;
        state.createPayment.success = true;
        state.createPayment.data = action.payload;
      })
      .addCase(createPayment.rejected, (state, action) => {
        state.createPayment.loading = false;
        state.createPayment.error = action.payload;
      })
      // Payment Status
      .addCase(getPaymentStatus.pending, (state) => {
        state.paymentStatus.loading = true;
        state.paymentStatus.error = false;
      })
      .addCase(getPaymentStatus.fulfilled, (state, action) => {
        state.paymentStatus.loading = false;
        state.paymentStatus.success = true;
        state.paymentStatus.data = action.payload;
      })
      .addCase(getPaymentStatus.rejected, (state, action) => {
        state.paymentStatus.loading = false;
        state.paymentStatus.error = action.payload;
      })
      // Instructor Earnings
      .addCase(getInstructorEarnings.pending, (state) => {
        state.earnings.loading = true;
        state.earnings.error = false;
      })
      .addCase(getInstructorEarnings.fulfilled, (state, action) => {
        state.earnings.loading = false;
        state.earnings.success = true;
        state.earnings.data = action.payload;
      })
      .addCase(getInstructorEarnings.rejected, (state, action) => {
        state.earnings.loading = false;
        state.earnings.error = action.payload;
      });
  },
});

export const { resetPaymentState } = paymentSlice.actions;
export default paymentSlice.reducer;
