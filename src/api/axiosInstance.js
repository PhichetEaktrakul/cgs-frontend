import axios from "axios";
import { urlConfig } from "./apiConfig.js";
/* const apiUrl = `${window.location.origin}`; */

export const apiCust = axios.create({ baseURL: urlConfig.apiBase }); // Customer API URL
export const apiPrice = axios.create({ baseURL: urlConfig.apiGoldprice }); // Price API URL
export const apiAdmin = axios.create({ baseURL: urlConfig.apiBase }); // Admin API URL

const token = localStorage.getItem("token");
if (token) {
  apiAdmin.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}
