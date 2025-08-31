import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginAPI, signupAPI } from "../api/authAPI";

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ username, password }, thunkAPI) => {
    try {
      const res = await loginAPI({ username, password });
      return { token: res.data.access_token, user: { username } };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.detail || err.message);
    }
  }
);

export const signupUser = createAsyncThunk(
  "auth/signupUser",
  async ({ username, password }, thunkAPI) => {
    try {
      const res = await signupAPI({ username, password });
      return { token: res.data.access_token, user: { username } };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.detail || err.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("auth");
    },
    loadUser: (state) => {
      const auth = JSON.parse(localStorage.getItem("auth"));
      if (auth) {
        state.user = auth.user;
        state.token = auth.token;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => { state.loading = true; state.error = null })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem("auth", JSON.stringify(action.payload));
      })
      .addCase(loginUser.rejected, (state, action) => { state.loading = false; state.error = action.payload })
      .addCase(signupUser.pending, (state) => { state.loading = true; state.error = null })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem("auth", JSON.stringify(action.payload));
      })
      .addCase(signupUser.rejected, (state, action) => { state.loading = false; state.error = action.payload });
  },
});

export const { logout, loadUser } = authSlice.actions;
export default authSlice.reducer;
