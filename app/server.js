const log = console.log;
const express = require("express");
const cors = require("cors");
const app = express();

//routes
const history = require("./routes/history");

const router = express.Router();
// CORS PROBLEM FIXED
app.use(cors());
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
const server = app.listen(PORT, () =>
  log(` Rates Data Server started on port 4000`)
);

const io = require("socket.io-client");
const io_server = require("socket.io")(server);

var socket = io.connect("https://marketdata.tradermade.com", {
  reconnect: true,
});

var connected = false;

socket.on("connect", function () {
  console.log(
    "Connected! Please CTRL+C and restart if you see this messsage more than twice"
  );
  console.log("disconnecting and reconnecting can take upto a minute");
  console.log(".......");

  socket.emit("login", { userKey: "sioehJ71_sMAGqvELnPSQ" });
});

socket.on("disconnect", function (msg) {
  console.log(msg);
});

socket.on("handshake", function (msg) {
  console.log(msg);
  connected = true;
  socket.emit("symbolSub", { symbol: "GBPJPY" });
  socket.emit("symbolSub", { symbol: "EURUSD" });
  socket.emit("symbolSub", { symbol: "USDJPY" });
  socket.emit("symbolSub", { symbol: "ETHUSD" });
});

socket.on("subResponse", function (msg) {
  console.log(msg);
});

socket.on("message", function (msg) {
  console.log(msg);
});

socket.on("price", function (message) {
  var data = message.split(" ");
  console.log(data, "wwwww");
  console.log(
    data[0] +
      " " +
      data[1] +
      " " +
      data[2] +
      " " +
      data[3] +
      " " +
      parseDate(data[4])
  );

  //emit socket for FRONTEND
  io_server.sockets.emit("rates", { data });
});

function parseDate(dateString) {
  var reggie = /(\d{4})(\d{2})(\d{2})-(\d{2}):(\d{2}):(\d{2}).(\d{3})/;
  var dateArray = reggie.exec(dateString);
  var dateObject = new Date(
    +dateArray[1],
    +dateArray[2] - 1, // Careful, month starts at 0!
    +dateArray[3],
    +dateArray[4],
    +dateArray[5],
    +dateArray[6]
  );
  return dateObject;
}
