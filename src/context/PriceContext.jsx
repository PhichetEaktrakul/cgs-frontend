import { createContext, useContext, useState, useEffect } from "react";
import { apiPrice } from "../api/axiosInstance";
import { urlConfig } from "../api/apiConfig";
//----------------------------------------------------------------------------------------
// Price SignalR Context For Admin
const PriceContext = createContext();
export const usePrice = () => useContext(PriceContext);

export const PriceProvider = ({ children }) => {
  const [prices, setPrices] = useState({
    gold99_buy: 0,
    gold99_sell: 0,
    old_gold99_buy: 0,
    old_gold99_sell: 0,
    gold96_buy: 0,
    gold96_sell: 0,
    old_gold96_buy: 0,
    old_gold96_sell: 0,
  });

  useEffect(() => {
    apiPrice
      .get("/api/gold-gcap/latest")
      .then((res) => {
        if (res.data) {
          setPrices(res.data);
        }
      })
      .catch((err) => console.error("❌ Failed to fetch latest price:", err));

    const waitForJQuery = setInterval(() => {
      if (window.$ && window.$.connection?.priceHub) {
        clearInterval(waitForJQuery);

        const priceHub = window.$.connection.priceHub;
        const parsePrice = (val) => parseFloat(val?.replace(/,/g, "")) || 0;

        priceHub.client.sendGoldPrice = function (
          gold99_buy,
          gold99_sell,
          old_gold99_buy,
          old_gold99_sell,
          gold96_buy,
          gold96_sell,
          old_gold96_buy,
          old_gold96_sell,
        ) {
          const newPrices = {
            gold99_buy: parsePrice(gold99_buy),
            gold99_sell: parsePrice(gold99_sell),
            old_gold99_buy: parsePrice(old_gold99_buy),
            old_gold99_sell: parsePrice(old_gold99_sell),
            gold96_buy: parsePrice(gold96_buy),
            gold96_sell: parsePrice(gold96_sell),
            old_gold96_buy: parsePrice(old_gold96_buy),
            old_gold96_sell: parsePrice(old_gold96_sell),
          };
          setPrices(newPrices);
        };

        window.$.connection.hub.url = urlConfig.apiSignalR;
        window.$.connection.hub
          .start()
          .done(() => {
            console.log("Connected to SignalR:", window.$.connection.hub.id);
          })
          .fail(() => {
            console.error("Failed to connect to SignalR");
          });

        window.$.connection.hub.disconnected(() => {
          console.warn("SignalR disconnected. Reconnecting in 2s...");
          setTimeout(() => {
            window.$.connection.hub
              .start()
              .done(() => {
                console.log(
                  "Reconnected to SignalR:",
                  window.$.connection.hub.id,
                );
              })
              .fail(() => {
                console.error("Reconnection attempt failed.");
              });
          }, 2000);
        });
      }
    }, 500);

    return () => clearInterval(waitForJQuery);
  }, []);

  return <PriceContext.Provider value={{ prices }}>{children}</PriceContext.Provider>
};
