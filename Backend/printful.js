const axios = require("axios");

if (!process.env.PRINTFUL_API_KEY) {
  throw new Error("PRINTFUL_API_KEY missing in .env");
}

const printful = axios.create({
  baseURL: "https://api.printful.com",
  timeout: 10000,
  headers: {
    Authorization: `Bearer ${process.env.PRINTFUL_API_KEY}`,
    "Content-Type": "application/json"
  }
});

module.exports = printful;
