//populate any env file
require("dotenv").config();

const express = require("express");
const promMid = require("express-prometheus-middleware");

const {
  users,
  cards,
  boards,
  search,
  comments,
  profile,
  social,
  admin,
  feedly,
  action,
  explore,
  typeform,
} = require("./routes");
const saveCardData = require("./crons/cards");
const app = express();

saveCardData.start();

app.use(
  promMid({
    metricsPath: "/metrics",
    collectDefaultMetrics: true,
    requestDurationBuckets: [0.1, 0.5, 1, 1.5],
  })
);

app.use(
  express.json({
    verify: (req, res, buf) => {
      req.rawBody = buf;
    },
  })
);

//control headers
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header(
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Headers, Origin,OPTIONS,PUT,Accept,Authorization, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
  );
  res.header("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS");
  next();
});

app.use("/api/users", users);
app.use("/api/cards", cards);
app.use("/api/boards", boards);
app.use("/api/search", search);
app.use("/api/comments", comments);
app.use("/api/profile", profile);
app.use("/api/linkedin", social);
app.use("/api/admin", admin);
app.use("/api/feedly", feedly);
app.use("/api/action", action);
app.use("/api/explore", explore);
app.use("/api/typeform", typeform);

//API's
app.get("/api/hello", function (req, res) {
  res.status(200).send({ result: "connected" });
});

var server = app.listen(8081, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log("Rabble API listening at http://%s:%s", host, port);
});
