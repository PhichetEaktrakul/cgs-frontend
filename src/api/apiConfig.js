const apiBase = import.meta.env.VITE_API_URL;
const apiGoldprice = import.meta.env.VITE_API_PRICE_URL;
const apiSignalR = import.meta.env.VITE_SIGNALR_URL;

export const urlConfig = { apiGoldprice, apiSignalR, apiBase };
