const crypto = require("crypto");
const express = require("express")
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

const DOCUMENT_ROOT = __dirname + "/public";
app.use(express.static("public"));

// トークンを作成する際の秘密鍵
const SECRET_TOKEN = "abcdefghijklmn12345";

// 部屋一覧
const ROOMS = { 0: { participants: [] } };

app.get("/", (req, res) => {
  res.sendFile(DOCUMENT_ROOT + "/index.html");
});

app.get("/result", (req, res) => {
  res.sendFile(DOCUMENT_ROOT + "/result.html");
});

//-----------------------------------------------
// Socket.io
//-----------------------------------------------
/**
 * [イベント] ユーザーが接続
 */
io.on("connection", (socket) => {
  //---------------------------------
  // トークンを返却
  //---------------------------------
  (() => {
    // トークンを作成
    const token = makeToken(socket.id);

    // 本人にトークンを送付
    io.to(socket.id).emit("token", { token: token });
  })();

  socket.emit("result", {
    win: "月が綺麗ですね",
    lose: ["ほげほげ", "ふがふが"],
  });

  /**
   * [イベント] 入室する
   */
  socket.on("join", (data) => {
    //--------------------------
    // トークンが正しければ
    //--------------------------
    if (authToken(socket.id, data.token)) {
      // 入室OK + 現在の入室者一覧を通知
      ROOMS[0].participants.push(data.name);
      io.to(socket.id).emit("join-result", {
        status: true,
        list: ROOMS[0].participants,
      });

      // 入室通知
      io.to(socket.id).emit("member-join", data);
      socket.broadcast.emit("member-join", {
        name: data.name,
        token: ROOMS[0].participants.count,
      });
    }
    //--------------------------
    // トークンが誤っていた場合
    //--------------------------
    else {
      // 本人にNG通知
      io.to(socket.id).emit("join-result", { status: false });
    }
  });

  /**
   * [イベント] 結果送信する
   */
});

http.listen(3000, () => {
  console.log("listening on *:3000");
});

function makeToken(id) {
  const str = SECRET_TOKEN + id;
  return crypto.createHash("sha1").update(str).digest("hex");
}
function makeRoomid() {
  const str = SECRET_TOKEN + id;
  return crypto.createHash("sha1").update(str).digest("hex");
}
