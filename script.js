require('dotenv').config();
const http = require("http");
const fs = require("fs");
const axios = require("axios");

const homeFile = fs.readFileSync("home.html", "utf-8");

const replaceVal = (tempVal, orgVal) => {
  let temperature = tempVal.replace("{%tempval%}", orgVal.main.temp);
  temperature = temperature.replace("{%tempmin%}", orgVal.main.temp_min);
  temperature = temperature.replace("{%tempmax%}", orgVal.main.temp_max);
  temperature = temperature.replace("{%location%}", orgVal.name);
  temperature = temperature.replace("{%country%}", orgVal.sys.country);
  temperature = temperature.replace("{%tempstatus%}", orgVal.weather[0].main);

  return temperature;
};

const server = http.createServer(async (req, res) => {
  console.log("Request URL:", req.url); // Log the incoming request URL
  const url = new URL(req.url, `http://${req.headers.host}`);
  const city = url.searchParams.get("city"); // Get the city parameter from the URL

  if (req.url.startsWith("/?city=")) {
    if (city) {
      try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${process.env.APPID || "62484d175e0bb6eaaf16f3a59c0d476c"}`);
        const objdata = response.data;
        const realTimeData = replaceVal(homeFile, objdata);
        res.writeHead(200, { "Content-Type": "text/html" });
        res.write(realTimeData);
        res.end();
      } catch (error) {
        console.error("Error fetching data:", error);
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("Error fetching data for the specified city.");
      }
    } else {
      res.writeHead(400, { "Content-Type": "text/plain" });
      res.end("Please provide a city name.");
    }
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("File not found");
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Server is running on http://127.0.0.1:8000");
});
