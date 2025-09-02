import axios from "axios";
const API_URL = "http://localhost:8000";

export const createSessionAPI = (message, token) => {
  return axios.post(`${API_URL}/chat/session`, { message }, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const sendMessageAPI = (message, session_id, token) => {
  return axios.post(`${API_URL}/chat/message`, { message, session_id }, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const fetchSessionsAPI = (token) => {
  return axios.get(`${API_URL}/chat/sessions`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const fetchSessionMessagesAPI = (session_id, token) => {
  return axios.get(`${API_URL}/chat/messages/${session_id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const deleteSessionAPI = (session_id, token) => {
  return axios.delete(`${API_URL}/chat/session/${session_id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
