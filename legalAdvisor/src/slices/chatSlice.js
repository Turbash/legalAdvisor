import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createSessionAPI, sendMessageAPI, fetchSessionsAPI, fetchSessionMessagesAPI, deleteSessionAPI } from "../api/chatAPI";

export const fetchSessions = createAsyncThunk("chat/fetchSessions", async (token, thunkAPI) => {
  try { const res = await fetchSessionsAPI(token); return res.data.sessions; } 
  catch (err) { return thunkAPI.rejectWithValue(err.response?.data || err.message); }
});

export const fetchMessages = createAsyncThunk("chat/fetchMessages", async ({ sessionId, token }, thunkAPI) => {
  try { const res = await fetchSessionMessagesAPI(sessionId, token); return { sessionId, messages: res.data.messages }; } 
  catch (err) { return thunkAPI.rejectWithValue(err.response?.data || err.message); }
});

export const createSession = createAsyncThunk("chat/createSession", async ({ message, token }, thunkAPI) => {
  try { const res = await createSessionAPI(message, token); return res.data.session_id; } 
  catch (err) { return thunkAPI.rejectWithValue(err.response?.data || err.message); }
});

export const sendMessage = createAsyncThunk("chat/sendMessage", async ({ message, sessionId, token }, thunkAPI) => {
  try { const res = await sendMessageAPI(message, sessionId, token); return { sessionId, message: res.data.response, role: "assistant" }; } 
  catch (err) { return thunkAPI.rejectWithValue(err.response?.data || err.message); }
});

export const deleteSession = createAsyncThunk("chat/deleteSession", async ({ sessionId, token }, thunkAPI) => {
  try { await deleteSessionAPI(sessionId, token); return sessionId; } 
  catch (err) { return thunkAPI.rejectWithValue(err.response?.data || err.message); }
});

const chatSlice = createSlice({
  name: "chat",
  initialState: { sessions: [], currentSessionId: null, messages: [], loading: false, error: null },
  reducers: { setCurrentSession: (state, action) => { state.currentSessionId = action.payload; state.messages = []; } },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSessions.pending, (state) => { state.loading = true; state.error = null })
      .addCase(fetchSessions.fulfilled, (state, action) => { state.loading = false; state.sessions = action.payload })
      .addCase(fetchSessions.rejected, (state, action) => { state.loading = false; state.error = action.payload })
      
      .addCase(fetchMessages.pending, (state) => { state.loading = true; state.error = null })
      .addCase(fetchMessages.fulfilled, (state, action) => { state.loading = false; state.messages = action.payload.messages })
      .addCase(fetchMessages.rejected, (state, action) => { state.loading = false; state.error = action.payload })
      
      .addCase(createSession.fulfilled, (state, action) => { state.currentSessionId = action.payload; state.messages = []; state.sessions.push({ id: action.payload, title: "New Session" }); })
      
      .addCase(sendMessage.fulfilled, (state, action) => { state.messages.push({ role: action.payload.role, message: action.payload.message }); })
      
      .addCase(deleteSession.fulfilled, (state, action) => { state.sessions = state.sessions.filter(s => s.id !== action.payload); if(state.currentSessionId === action.payload) state.currentSessionId = null; state.messages = []; });
  },
});

export const { setCurrentSession } = chatSlice.actions;
export default chatSlice.reducer;