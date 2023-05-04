const crypto = require("crypto");
const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

const DOCUMENT_ROOT = __dirname + "/public";
app.use(express.static("public"));
// トークンを作成する際の秘密鍵
const SECRET_TOKEN = "abcdefghijklmn12345";

// 部屋一覧
const ROOMS = { 0: { participants: {}, responded: 0, sentences: [] } };

app.get("/", (req, res) => {
  res.sendFile(DOCUMENT_ROOT + "/frontend/index.html");
});

app.get("/play", (req, res) => {
  res.sendFile(DOCUMENT_ROOT + "/frontend/play.html");
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
      // 入室OK + 現在の入室者を通知
      ROOMS[0].participants[socket.id] = { name: data.name, token: data.token };
      io.to(socket.id).emit("join-result", {
        status: true,
      });

      io.emit("member-join", {
        count: Object.keys(ROOMS[0].participants).length,
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
   * [イベント] ゲームを開始する
   */
  socket.on("start", (data) => {
    //--------------------------
    // トークンが正しければ
    //--------------------------
    if (authToken(socket.id, data.token)) {
      // 本人にOK通知
      io.to(socket.id).emit("start-result", { status: true });
      socket.broadcast.emit("start-game", {});
    }
    //--------------------------
    // トークンが誤っていた場合
    //--------------------------
    else {
      // 本人にNG通知
      io.to(socket.id).emit("start-result", { status: false });
    }
  });

  socket.on("submit", (data) => {
    //--------------------------
    // トークンが正しければ
    //--------------------------
    if (authToken(socket.id, data.token)) {
      // 本人にOK通知
      io.to(socket.id).emit("submit-result", { status: true });
      ROOMS[0].sentences.push(data.sentence);
    }
    //--------------------------
    // トークンが誤っていた場合
    //--------------------------
    else {
      // 本人にNG通知
      io.to(socket.id).emit("submit-result", { status: false });
    }
  });

  socket.on("judge", (data) => {
    //--------------------------
    // トークンが正しければ
    //--------------------------
    if (authToken(socket.id, data.token)) {
      // 本人にOK通知
      io.to(socket.id).emit("judge-result", { status: true });
      socket.emit("judge-list", { list: ROOMS[0].sentences });
    }
    //--------------------------
    // トークンが誤っていた場合
    //--------------------------
    else {
      // 本人にNG通知
      io.to(socket.id).emit("judge-result", { status: false });
    }
  });

  socket.on("result", (data) => {
    //--------------------------
    // トークンが正しければ
    //--------------------------
    if (authToken(socket.id, data.token)) {
      // 本人にOK通知
      io.to(socket.id).emit("result-result", { status: true });
      socket.emit("result-sentences", { list: data.sentence });
    }
    //--------------------------
    // トークンが誤っていた場合
    //--------------------------
    else {
      // 本人にNG通知
      io.to(socket.id).emit("result-result", { status: false });
    }
  });
  /**
   * [イベント] 退室する
   */
  socket.on("disconnect", () => {
    io.emit("member-quit", {
      count: Object.keys(ROOMS[0].participants).length - 1,
      perticipant: ROOMS[0].participants[socket.id],
    });
    // 削除
    delete ROOMS[0].participants[socket.id];
  });
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
function authToken(socketid, token) {
  return (
    //(socketid in Object.keys(ROOMS[0].participants) && (token === ROOMS[0].participants.socketid.token)
    true
  );
}
