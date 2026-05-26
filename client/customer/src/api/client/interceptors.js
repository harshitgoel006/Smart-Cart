import axiosInstance from "./axios";

axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },

  (error) => {
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (response) => response,

  async (error) => {
    return Promise.reject(error);
  },
);

export default axiosInstance;