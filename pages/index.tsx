import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
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
    <div
      style={{
        minHeight: "100vh",
        padding: "2rem",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        background: "linear-gradient(135deg, #e0f7fa, #fce4ec)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem", color: "#333" }}>
        📈 Stock Price Averager with Chart
      </h1>

      <div
        style={{
          background: "white",
          padding: "2rem",
          borderRadius: "16px",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
          width: "100%",
          maxWidth: 700,
        }}
      >
        <label style={{ fontSize: "1.1rem", color: "#444" }}>
          Ticker Symbol:
          <input
            type="text"
            value={ticker}
            onChange={(e) => setTicker(e.target.value.toUpperCase())}
            style={{
              marginLeft: "1rem",
              padding: "0.6rem",
              borderRadius: "8px",
              border: "1px solid #ccc",
              outline: "none",
            }}
          />
        </label>

        <br />
        <br />

        <label style={{ fontSize: "1.1rem", color: "#444" }}>
          Minutes:
          <input
            type="number"
            value={minutes}
            onChange={(e) => setMinutes(parseInt(e.target.value))}
            style={{
              marginLeft: "1rem",
              padding: "0.6rem",
              borderRadius: "8px",
              border: "1px solid #ccc",
              outline: "none",
            }}
          />
        </label>

        <br />
        <br />

        <button
          onClick={fetchAverage}
          style={{
            padding: "0.75rem 1.5rem",
            background: "linear-gradient(to right, #6a11cb, #2575fc)",
            color: "white",
            fontWeight: "bold",
            fontSize: "1rem",
            borderRadius: "10px",
            border: "none",
            cursor: "pointer",
            transition: "0.3s",
          }}
        >
          Get Average
        </button>

        <br />
        <br />

        {result && (
          <div
            style={{
              background: "#f9f9f9",
              padding: "1.5rem",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
            }}
          >
            <p>
              <strong>Ticker:</strong> {result.ticker}
            </p>
            <p>
              <strong>Average Close Price:</strong> ${result.average}
            </p>
            <p>
              <strong>Data Points Used:</strong> {result.dataPoints}
            </p>

            <h3 style={{ marginTop: "1.5rem", color: "#444" }}>📊 Price Chart</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={result.chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis domain={["dataMin", "dataMax"]} />
                <Tooltip />
                <Line type="monotone" dataKey="close" stroke="#6a11cb" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {error && (
          <p style={{ color: "red", marginTop: "1rem", fontWeight: "bold" }}>
            ❌ Error: {error}
          </p>
        )}
      </div>
    </div>
  );
}
