const crypto = require("crypto");
const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

const DOCUMENT_ROOT = __dirname + "/public";
app.use(express.static("public"));
// トークンを作成する際の秘密鍵
const SECRET_TOKEN = "abcdefghijklmn12345";

const me = ["僕", "僕が", "僕に", "僕の", "僕と"];
const you = ["君", "君が", "君に", "君の", "君と"];
const particle = ["て", "に", "を", "は", "が"];
const other_words = [
  "家",
  "犬",
  "見てみたい",
  "ぶち壊して",
  "ダメですか？",
  "まぶしい",
  "女神",
  "叫んでる",
  "セクシーな",
  "夜ごはん",
  "小悪魔な",
  "顔",
  "お母さん",
  "プレイボーイ",
  "ちゃんと",
  "大切にするよ",
  "お嫁",
  "美しい",
  "そろそろ",
  "したいんだ",
  "誰よりも",
];

// 部屋一覧
const ROOMS = {
  0: {
    participants: {},
    responded: 0,
    sentences: [],
    original_words: [],
    win: "月が綺麗ですね",
    lose: ["ほげほげ", "ふがふが"],
  },
};

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

  socket.on("create-words", (data) => {
    //--------------------------
    // トークンが正しければ
    //--------------------------
    if (authToken(socket.id, data.token)) {
      io.emit("create-word", {});
    }
    //--------------------------
    // トークンが誤っていた場合
    //--------------------------
    else {
      // 本人にNG通知
      io.to(socket.id).emit("start-game-result", { status: false });
    }
  });

  socket.on("word", (data) => {
    //--------------------------
    // トークンが正しければ
    //--------------------------
    if (authToken(socket.id, data.token)) {
      ROOMS[0].original_words.push(data.submit_word);
      if (
        ROOMS[0].original_words.length ==
        Object.keys(ROOMS[0].participants).length
      ) {
        let parent_index = Math.floor(
          Math.random() * Object.keys(ROOMS[0].participants).length
        );
        ROOMS[0].parent = Object.keys(ROOMS[0].participants)[parent_index];
        io.emit("start", { parent: ROOMS[0].parent });
      }
    }
    //--------------------------
    // トークンが誤っていた場合
    //--------------------------
    else {
      // 本人にNG通知
      io.to(socket.id).emit("start-game-result", { status: false });
    }
  });

  socket.on("sample-words", (data) => {
    //--------------------------
    // トークンが正しければ
    //--------------------------
    if (authToken(socket.id, data.token)) {
      sample_words = [];
      let random_num = Math.floor(Math.random() * 10 ** 9) + 10 ** 9;
      sample_words.push(me[random_num % me.length]);
      sample_words.push(you[random_num % you.length]);
      sample_words.push(particle[random_num % particle.length]);
      other_words_copy = other_words.slice();
      for (let i = 0; i < 3; i++) {
        sample_words.push(other_words_copy[random_num % other_words.length]);
        other_words_copy.splice(random_num % other_words.length, 1);
      }
      sample_words.push(
        ROOMS[0].original_words[random_num % ROOMS[0].original_words.length]
      );
      ROOMS[0].original_words.splice(
        random_num % ROOMS[0].original_words.length,
        1
      );
      io.to(socket.id).emit("sample-words", { sample_words: sample_words });
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
      if (
        ROOMS[0].sentences.length ==
        Object.keys(ROOMS[0].participants).length - 1
      ) {
        io.emit("judge", { sentences: ROOMS[0].sentences });
      }
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
      ROOMS[0].win = ROOMS[0].sentences[data.win];
      ROOMS[0].lose = ROOMS[0].sentences.filter(function (value) {
        return !(value === ROOMS[0].win);
      });
      io.emit("finish-judge", {});
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
      socket.emit("result", { win: ROOMS[0].win, lose: ROOMS[0].lose });
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
