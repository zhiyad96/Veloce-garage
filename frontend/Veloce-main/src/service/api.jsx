import axios from "axios";

export const api = axios.create({
baseURL: "http://18.208.232.218:8000",
  headers: { "Content-Type": "application/json" },
  withCredentials: true
});

api.interceptors.response.use(
  (response) => response,

  async (error) => {

    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/refresh/")
      
    ) {

      originalRequest._retry = true;

      try {

        await api.post("/refresh/");

        return api(originalRequest);

      } catch (refreshError) {

        console.log("Refresh token expired. User must login again.");

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);