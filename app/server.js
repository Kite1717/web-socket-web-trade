const log = console.log;
const express = require('express');
const app = express();

//socket fro frontend and each client
const server = app.listen('4000',() => log(`Live Rates Data Server started on port 4000`));
const socket = require('socket.io');
const io = socket(server);

//socket client for live rate
const client = require('socket.io-client');
const socketClient = client('https://wss.live-rates.com/')

const cors = require('cors')
// Settings
const PORT = process.env.PORT || 4000;
app.use(cors())
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