import axios from "axios";

const API_URL = "http://localhost:8000/auth";

export const loginAPI = ({ username, password }) => {
  const params = new URLSearchParams();
  params.append("username", username);
  params.append("password", password);

  return axios.post(`${API_URL}/login`, params, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
};

export const signupAPI = ({ username, password }) => {
  const params = new URLSearchParams();
  params.append("username", username);
  params.append("password", password);

  return axios.post(`${API_URL}/register`, params, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
};
