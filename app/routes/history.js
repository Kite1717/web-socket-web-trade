const express = require("express");

const axios = require("axios");
const querystring = require("querystring");

//example history
// https://live-rates.com/historical/series?base=ETH&start=2021-05-27&end=2021-06-26&symbols=USD&key=cea9fac77f

const app = express.Router();

//**************Route Level 1

const ROOT_URL = "https://live-rates.com/";
const KEY = "cea9fac77f";
// Login
app.post("/", async (req, res) => {
  let { base, start, end, symbols } = req.body;

  let url = ROOT_URL + "historical/series?";

  url += querystring.stringify({
    base: base.trim(),
    start: start.trim(),
    end: end.trim(),
    symbols: symbols.trim(),
    key: KEY,
  });

  axios
    .get(url)
    .then(({ data }) => {
      if (data) {
        //preprocess historical data
        let dataArray = [];
        for (const key in data) {
          dataArray.push({
            time: key,
            value: data[key][symbols.trim()],
          });
        }

        return res.json(dataArray);
      } else {
        return res.status(500).json({ msg: "Data not found" });
      }
    })
    .catch((err) => {
      return res.status(500).json(err);
    });
});

module.exports = app;
