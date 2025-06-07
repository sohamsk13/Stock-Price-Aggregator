export default async function handler(req, res) {
  const { ticker, minutes } = req.query;

  if (!ticker || !minutes) {
    return res.status(400).json({ error: "Missing ticker or minutes" });
  }

  const apiKey = process.env.TWELVE_DATA_API_KEY;
  const interval = "1min";

  try {
    const response = await fetch(
      `https://api.twelvedata.com/time_series?symbol=${ticker}&interval=${interval}&outputsize=${minutes}&apikey=${apiKey}`
    );
    const data = await response.json();

    if (data.status === "error") {
      return res.status(400).json({ error: data.message });
    }

    const values = data.values.slice(0, Number(minutes));
    const chartData = values.map((point) => ({
      time: point.datetime.split(" ")[1], // get HH:MM:SS
      close: parseFloat(point.close),
    }));

    const avg =
      chartData.reduce((sum, d) => sum + d.close, 0) / chartData.length;

    return res.status(200).json({
      ticker,
      average: avg.toFixed(2),
      dataPoints: chartData.length,
      chartData,
    });
  } catch (err) {
    console.error("Twelve Data fetch error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
