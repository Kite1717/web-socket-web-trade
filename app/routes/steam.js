const express = require("express");

const axios = require("axios");
const querystring = require("querystring");

//example history
// https://live-rates.com/historical/series?base=ETH&start=2021-05-27&end=2021-06-26&symbols=USD&key=cea9fac77f

const app = express.Router();

//**************Route Level 1

const ROOT_URL = "https://live-rates.com/";
const KEY = "cea9fac77f";

const socket = require("socket.io");
const io = socket(server);

//socket client for live rate
const client = require("socket.io-client");
const socketClient = client("https://wss.live-rates.com/");

//prepare live rate
const key = "cea9fac77f";
socketClient.on("connect", () => {
  console.log("connect vbro");
  const instruments = [instrument];
  socketClient.emit("instruments", instruments);
  socketClient.emit("key", key);
});

socketClient.on("rates", (data) => {
  console.log(JSON.parse(data), "wwwwwwwww");

  //emit socket for FRONTEND
  io.sockets.emit("rts", JSON.parse(data));
});
module.exports = app;
