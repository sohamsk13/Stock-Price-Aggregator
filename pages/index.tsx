import { useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

export default function Home() {
  const [ticker, setTicker] = useState("AAPL");
  const [minutes, setMinutes] = useState(5);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const fetchAverage = async () => {
    try {
      setError("");
      setResult(null);
      const res = await fetch(`/api/average?ticker=${ticker}&minutes=${minutes}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Unknown error");
        return;
      }

      setResult(data);
    } catch (err) {
      setError("Something went wrong.");
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif", maxWidth: 800, margin: "auto" }}>
      <h1>📈 Stock Price Averager with Chart</h1>

      <label>
        Ticker Symbol:
        <input
          type="text"
          value={ticker}
          onChange={(e) => setTicker(e.target.value.toUpperCase())}
          style={{ marginLeft: "1rem", padding: "0.5rem" }}
        />
      </label>

      <br /><br />

      <label>
        Minutes:
        <input
          type="number"
          value={minutes}
          onChange={(e) => setMinutes(parseInt(e.target.value))}
          style={{ marginLeft: "1rem", padding: "0.5rem" }}
        />
      </label>

      <br /><br />

      <button
        onClick={fetchAverage}
        style={{ padding: "0.75rem 1.5rem", background: "black", color: "white", borderRadius: "8px" }}
      >
        Get Average
      </button>

      <br /><br />

      {result && (
        <div style={{ background: "#f9f9f9", padding: "1rem", borderRadius: "8px" }}>
          <p><strong>Ticker:</strong> {result.ticker}</p>
          <p><strong>Average Close Price:</strong> ${result.average}</p>
          <p><strong>Data Points Used:</strong> {result.dataPoints}</p>

          <h3>📊 Price Chart</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={result.chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis domain={['dataMin', 'dataMax']} />
              <Tooltip />
              <Line type="monotone" dataKey="close" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {error && (
        <p style={{ color: "red" }}>
          ❌ Error: {error}
        </p>
      )}
    </div>
  );
}
