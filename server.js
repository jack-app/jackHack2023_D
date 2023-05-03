const express = require("express");
const app = express();

const http = require("http").createServer(app);
const io = require("socket.io")(http);

const DOCUMENT_ROOT = __dirname + "/public";
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(DOCUMENT_ROOT + "/index.html");
});

http.listen(3000, () => {
  console.log("listening on *:3000");
});
