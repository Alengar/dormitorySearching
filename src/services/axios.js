import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://api.dorms.kz/"
});

export default axiosInstance;
