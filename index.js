// require('dotenv').config();
// const http = require("http");
// const fs = require("fs");
// var requests = require("requests");


// const homeFile = fs.readFileSync("home.html", "utf-8");


// const replaceVal = (tempVal, orgVal) => {
//   let temperature = tempVal.replace("{%tempval%}", orgVal.main.temp);
//   temperature = temperature.replace("{%tempmin%}", orgVal.main.temp_min);
//   temperature = temperature.replace("{%tempmax%}", orgVal.main.temp_max);
//   temperature = temperature.replace("{%location%}", orgVal.name);
//   temperature = temperature.replace("{%country%}", orgVal.sys.country);
//   temperature = temperature.replace("{%tempstatus%}", orgVal.weather[0].main);

//   return temperature;
// };

// const server = http.createServer((req, res) => {
//   if (req.url == "/") {
//     requests(
//       `https://api.openweathermap.org/data/2.5/weather?q=London&appid=62484d175e0bb6eaaf16f3a59c0d476c&units=metric"}`
//     )
//       .on("data", (chunk) => {
//         const objdata = JSON.parse(chunk);
//         const arrData = [objdata];
//         // console.log(arrData[0].main.temp);
//         const realTimeData = arrData
//           .map((val) => replaceVal(homeFile, val))
//           .join("");
//         res.write(realTimeData);
//         // console.log(realTimeData);
//       })
//       .on("end", (err) => {
//         if (err) return console.log("connection closed due to errors", err);
//         res.end();
//       });
//   } else {
//     res.end("File not found");
//   }
// });

// server.listen(8000, "127.0.0.1");

require('dotenv').config();
const http = require("http");
const fs = require("fs");
var requests = require("requests");

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

const server = http.createServer((req, res) => {
  if (req.url == "/") {
    requests(
      `https://api.openweathermap.org/data/2.5/weather?q=London&appid=62484d175e0bb6eaaf16f3a59c0d476c&units=metric`
    )
      .on("data", (chunk) => {
        const objdata = JSON.parse(chunk);
        const arrData = [objdata];
        const realTimeData = arrData
          .map((val) => replaceVal(homeFile, val))
          .join("");
        res.write(realTimeData);
      })
      .on("end", (err) => {
        if (err) return console.log("connection closed due to errors", err);
        res.end();
      });
  } else {
    res.end("File not found");
  }
});

// Use process.env.PORT and bind to '0.0.0.0' for Render
const PORT = process.env.PORT || 8000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});