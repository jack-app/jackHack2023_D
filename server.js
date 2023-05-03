const crypto = require("crypto");
const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

const DOCUMENT_ROOT = __dirname + "/public";

// トークンを作成する際の秘密鍵
const SECRET_TOKEN = "abcdefghijklmn12345";

// 部屋一覧
const ROOMS = {};

app.get("/", (req, res) => {
  res.sendFile(DOCUMENT_ROOT + "/index.html");
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

  /**
   * [イベント] 入室する
   */
  socket.on("join", (data) => {
    //--------------------------
    // トークンが正しければ
    //--------------------------
    if (authToken(socket.id, data.token) && data.room_id in ROOMS) {
      // 入室OK + 現在の入室者一覧を通知
      ROOMS[data.room_id].participants.push(data.name);
      io.to(socket.id).emit("join-result", {
        status: true,
        list: ROOMS[data.room_id].participants,
      });

      // 入室通知
      io.to(socket.id).emit("member-join", data);
      socket.broadcast.emit("member-join", {
        name: data.name,
        token: ROOMS[socket.id].participants.count,
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
