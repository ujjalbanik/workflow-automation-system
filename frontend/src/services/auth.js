import api from "../api/axios";

export const login = async (username, password) => {
  const response = await api.post("/auth/login/", {
    username,
    password,
  });

  localStorage.setItem("access", response.data.access);
  localStorage.setItem("refresh", response.data.refresh);

  return response.data;
};

export const register = async (payload) => {
  const { data } = await api.post("/auth/register/", payload);
  return data;
};

export const verifyOTP = async (payload) => {
  const { data } = await api.post("/auth/verify-otp/", payload);
  return data;
};

export const resendOTP = async (email) => {
  const { data } = await api.post("/auth/resend-otp/", {
    email,
  });

  return data;
};

export const getProfile = async () => {
  const { data } = await api.get("/auth/profile/");
  return data;
};

export const logout = () => {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
};