const path = require('path');
const express = require('express');
const app = express();

app.use(express.static('public'));
app.use(express.json());

// ✅ เพิ่มส่วนนี้เพื่อ redirect "/" ไปยัง index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post('/calculate', (req, res) => {
  const { protocol, pullRate, baudrate, registers } = req.body;
  let responseTimeMs, timeoutMs, reconnectTimeoutSec;

  if (protocol === "RTU") {
    const bytesPerRegister = 2;
    const totalBytes = registers * bytesPerRegister + 5; // overhead
    const transmissionTime = (totalBytes * 10) / baudrate; // sec
    responseTimeMs = transmissionTime * 1000;
    timeoutMs = Math.round(responseTimeMs + 100);
  } else {
    responseTimeMs = 100;
    timeoutMs = 500;
  }

  reconnectTimeoutSec = Math.round(pullRate * 3);

  res.json({
    protocol,
    responseTimeMs: Math.round(responseTimeMs),
    recommendedTimeoutMs: timeoutMs,
    recommendedReconnectTimeoutSec: reconnectTimeoutSec
  });
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`✅ Server is running at: http://localhost:${PORT}`);
});
