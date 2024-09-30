import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { OneTimeTicker, PriceData } from "./types/price-data.type";
import "./App.css";

const getDecimalPlaces = (value: number): number => {
  if (value % 1 !== 0) {
    return value?.toString()?.split(".")[1]?.length;
  }
  return 0;
};

const App = () => {
  const [solData, setsolData] = useState<PriceData>();
  const [avaxData, setavaxData] = useState<PriceData>();
  const [pepeData, setpepeData] = useState<PriceData>();
  const [ticker, setTicker] = useState<string>("");
  const [oneTimeData, setOneTimeData] = useState<OneTimeTicker | null>();
  const [socket, setSocket] = useState<Socket>();
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const socket = io("http://localhost:3000");
    socket.on("price-update-sol", (data: PriceData) => setsolData(data));
    socket.on("price-update-avax", (data: PriceData) => setavaxData(data));
    socket.on("price-update-pepe", (data: PriceData) => setpepeData(data));
    socket.on("one-time-ticker-price", (data: OneTimeTicker) =>
      setOneTimeData(data)
    );
    setSocket(socket);

    return () => {
      socket.disconnect();
    };
  }, []);
  const handleGetOneTimeTicker = () => {
    if (ticker) {
      if (!socket?.connected) alert("Sockets is not connected");
      socket?.emit("get-one-time-ticker", { symbol: ticker.toUpperCase() });
    } else {
      alert("Ticker is not provided");
    }
  };
  // useEffect(() => {}, [socket?.connected]);
  const disconnectSocket = () => {
    socket?.disconnect();
    setIsConnected(false);
  };

  const hideOneTimeTicker = () => {
    setOneTimeData(null);
  };

  return (
    <div className="container">
      <h1 className="title">Crypto Price Tracker</h1>

      <div className="ticker-input">
        <input
          type="text"
          value={ticker}
          onChange={(e) => setTicker(e.target.value)}
          placeholder="Enter ticker (e.g., BTC)"
        />
        <div className="button-group">
          <button
            onClick={() => {
              socket?.open();
              setIsConnected(true);
            }}
          >
            Connect Sockets
          </button>
          <button onClick={disconnectSocket}>Disconnect Sockets</button>
          <button onClick={handleGetOneTimeTicker}>Get One-Time Ticker</button>
          <button onClick={hideOneTimeTicker}>Hide One-Time Ticker</button>
        </div>
      </div>

      {isConnected ? (
        <>
          {[solData, avaxData, pepeData].map((data, index) => (
            <div className="price-card" key={index}>
              <p className="price-label">{data?.symbol}</p>
              <h2 className="price-value">
                {data?.currentPrice
                  ? data.currentPrice.toFixed(
                      getDecimalPlaces(data.currentPrice)
                    )
                  : "Loading..."}{" "}
                USD
              </h2>
              <p className="price-label">
                Volume Change:{" "}
                {data?.volumeChange
                  ? data.volumeChange.toFixed(
                      getDecimalPlaces(data.volumeChange)
                    )
                  : "N/A"}
              </p>
              <p className="price-label">
                Price Change:{" "}
                {data?.priceChange
                  ? data.priceChange.toFixed(getDecimalPlaces(data.priceChange))
                  : "N/A"}
              </p>
              <p className="price-label">
                Open Price For the Day:{" "}
                {data?.openPrice
                  ? data.openPrice.toFixed(getDecimalPlaces(data.openPrice))
                  : "N/A"}
              </p>
              <p className="price-label">
                High Price For The Day:{" "}
                {data?.highPrice
                  ? data.highPrice.toFixed(getDecimalPlaces(data.highPrice))
                  : "N/A"}
              </p>
              <p className="price-label">
                Low Price For The Day:{" "}
                {data?.lowPrice
                  ? data.lowPrice.toFixed(getDecimalPlaces(data.lowPrice))
                  : "N/A"}
              </p>
            </div>
          ))}
        </>
      ) : (
        <>Connect Sockets to See Real Time Data</>
      )}

      {oneTimeData && (
        <div className="price-card">
          <p className="price-label">{oneTimeData.symbol}</p>
          <h2 className="price-value">{oneTimeData.symbol} USD</h2>
          <p className="price-label">
            Price: {oneTimeData.price ? oneTimeData.price : "N/A"}
          </p>
        </div>
      )}
    </div>
  );
};

export default App;
