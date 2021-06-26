const log = console.log;
const express = require('express');
const cors = require('cors')
const app = express();

//routes
const history = require('./routes/history')

const router = express.Router();
// CORS PROBLEM FIXED
app.use(cors())
// Settings
const PORT = process.env.PORT || 4000;


router.get("/", (req, res) => res.json({ KITE: "ACTIVE" }));
/**********SERVICES********/
router.use("/api/history", history);

/**************************/

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//add routes
app.use(router);

//socket fro frontend and each client
const server = app.listen(PORT,() => log(`Live Rates Data Server started on port 4000`));


const socket = require('socket.io');
const io = socket(server); 

//socket client for live rate
const client = require('socket.io-client');
const socketClient = client('https://wss.live-rates.com/')




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
 