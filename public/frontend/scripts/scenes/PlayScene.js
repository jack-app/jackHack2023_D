import { socket, setSocket } from "../main.js";

export class PlayScene extends Phaser.Scene {
  constructor() {
    super({ key: "PlayScene" });
  }

  init() {
    // Can be defined on your own Scenes.
    // This method is called by the Scene Manager when the scene starts, before preload() and create().
  }

  preload() {
    // Can be defined on your own Scenes. Use it to load assets.
    // This method is called by the Scene Manager, after init() and before create(), only if the Scene has a LoaderPlugin.
    // After this method completes, if the LoaderPlugin's queue isn't empty, the LoaderPlugin will start automatically
    this.load.plugin(
      "rextexteditplugin",
      "https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rextexteditplugin.min.js",
      true
    );
  }

  create() {
    // Can be defined on your own Scenes. Use it to create your game objects.
    // This method is called by the Scene Manager when the scene starts, after init() and preload().
    // If the LoaderPlugin started after preload(), then this method is called only after loading is complete.
    setSocket(io());

    let player_count = null;
    let explanation = null;

    const sceneName = this.add
      .text(150, 70, "PlayScene")
      .setFontSize(30)
      .setFontFamily("Arial")
      .setOrigin(0.5)
      .setInteractive();

    const start_game = this.add
      .text(150, 190, "Game Start!")
      .setFontSize(20)
      .setFontFamily("Arial")
      .setOrigin(0.5)
      .setInteractive();

    socket.emit("join", { token: socket.token, name: "hoge" });

    socket.on("member-join", (data) => {
      if (player_count == null) {
        player_count = this.add.text(150, 130, `${data.count}人が待機中`, {
          fontSize: 30,
          fontFamily: "Arial",
          origin: 0.5,
        });
      } else {
        player_count.setText(`${data.count}人が待機中`);
      }
    });

    socket.on("member-quit", (data) => {
      if (player_count == null) {
        player_count = this.add.text(150, 130, `${data.count}人が待機中`, {
          fontSize: 30,
          fontFamily: "Arial",
          origin: 0.5,
        });
      } else {
        player_count.setText(`${data.count}人が待機中`);
      }
    });

    socket.on("start", (data) => {
      if (data.parent == socket.id) {
        this.scene.start("PlayParentScene");
      } else {
        this.scene.start("PlayChildScene");
      }
    });

    socket.on("create-word", (data) => {
      player_count.destroy();
      start_game.destroy();
      explanation = this.add.text(150, 130, "オリジナルの単語を入力しよう", {
        fontSize: 30,
        fontFamily: "Arial",
        origin: 0.5,
      });

      let please_text = this.add.text(150, 300, "Please input Text", {
        fontSize: 30,
        fontFamily: "Arial",
        origin: 0.5,
      });

      let editor = this.plugins.get("rextexteditplugin").add(please_text);
      editor.open();
      editor.on('pointerdown', function () {
        var config = {
            onTextChanged: function (textObject, text) {
                textObject.text = text;
                console.log(`Text: ${text}`);
            },
        };});
      const submit = this.add
        .text(150, 400, "Submit", {
          fontSize: 30,
          fontFamily: "Arial",
          origin: 0.5,
        })
        .setInteractive();

      submit.on(
        "pointerdown",
        (pointer) => {
          let inputText = editor.text;
          console.log(inputText);
          socket.emit("word", { token: socket.token, submit_word: inputText });
          editor.close();
          sceneName.destroy();
          explanation.destroy();
          please_text.destroy();
          editor.destroy();
          submit.destroy();
          let wait_explanation = this.add.text(150, 130, "他の人の行動を待っています...", {
            fontSize: 30,
            fontFamily: "Arial",
            origin: 0.5,
          });
        },
        this
      );
    });

    start_game.on(
      "pointerdown",
      function (pointer) {
        socket.emit("create-words", { token: socket.token });
      },
      this
    );
  }

  update() {
    // https://photonstorm.github.io/phaser3-docs/Phaser.Scene.html#update
  }
}
