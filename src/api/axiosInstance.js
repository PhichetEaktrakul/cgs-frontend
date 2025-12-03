import axios from "axios";
import { urlConfig } from "./apiConfig.js";
/* const apiUrl = `${window.location.origin}`; */

// Customer API URL
export const apiCust = axios.create({ baseURL: urlConfig.apiBase });

// Admin API URL
export const apiAdmin = axios.create({ baseURL: urlConfig.apiBase });

const token = localStorage.getItem("token");
if (token) {
  apiAdmin.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}
