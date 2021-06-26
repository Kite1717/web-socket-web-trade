const log = console.log;
const express = require('express');
const app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
  next();
});
const cors = require('cors')

app.use(cors())
// Settings
const PORT = process.env.PORT || 4000;
//socket fro frontend and each client
const server = app.listen('4000',() => log(`Live Rates Data Server started on port 4000`));
const socket = require('socket.io');
const io = socket(server,{log:false, origins:'*:*'}); // CORS PROBLEM FIXED

//socket client for live rate
const client = require('socket.io-client');
const socketClient = client('https://wss.live-rates.com/')


// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//prepare live rate
const  key = 'cea9fac77f' 
socketClient.on('connect', ()=>{
    console.log("connect vbro")
  const instruments = ['ETH']
  socketClient.emit('instruments', instruments);
  socketClient.emit('key', key); 
});

socketClient.on('rates', (data)=>{

    console.log(JSON.parse(data),"wwwwwwwww")

    //emit socket for FRONTEND
    io.sockets.emit('rts',JSON.parse(data));
});
