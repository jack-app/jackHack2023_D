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
    this.load.image("background", "frontend/81643.png");
  }

  create() {
    // Can be defined on your own Scenes. Use it to create your game objects.
    // This method is called by the Scene Manager when the scene starts, after init() and preload().
    // If the LoaderPlugin started after preload(), then this method is called only after loading is complete.
    setSocket(io());

    let player_count = null;
    let explanation = null;

    const sys_height = this.sys.canvas.height;
    const sys_width = this.sys.canvas.width;

    this.background = this.add
      .image(sys_width / 2, sys_height / 2, "background")
      .setOrigin(0.5, 0.5);
    this.background.displayHeight = sys_height;
    this.background.displayWidth = sys_width;
    this.background.setSize(sys_width, sys_height);

    const product_name = this.add
    .text(400, 200, "Romantext")
    .setColor("#000000")
    .setFontSize(80)
    .setFontFamily("Helvetica")
    .setOrigin(0.5)
    .setInteractive();

    const start_game = this.add
      .text(sys_width/2-20, sys_height/2+100, "Game Start")
      .setColor("#000000")
      .setFontSize(40)
      .setFontFamily("Arial")
      .setOrigin(0.5)
      .setInteractive();

    socket.emit("join", { token: socket.token, name: "hoge" });

    socket.on("member-join", (data) => {
      if (player_count == null) {
        player_count = this.add.text(300, sys_height/2, `${data.count}人が待機中`, {
          fontSize: 30,
          fontFamily: "Arial",
          origin: 0.5,
        }).setColor("#000000");
      } else {
        player_count.setText(`${data.count}人が待機中`).setColor("#000000");
      }
    });

    socket.on("member-quit", (data) => {
      if (player_count == null) {
        player_count = this.add.text(300, sys_height/2, `${data.count}人が待機中`, {
          fontSize: 30,
          fontFamily: "Arial",
          origin: 0.5,
        }).setColor("#000000");
      } else {
        player_count.setText(`${data.count}人が待機中`).setColor("#000000");
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
      product_name.destroy();
      player_count.destroy();
      start_game.destroy();
      explanation = this.add.text(120, 130, "オリジナルの単語を入力しよう", {
        fontSize: 40,
        fontFamily: "Arial",
        origin: 0.5,
      }).setColor("#000000");

      let please_text = this.add.text(200, 300, "ここに入力", {
        fontSize: 30,
        fontFamily: "Arial",
        origin: 0.5,
      }).setColor("#000000");

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
        .text(500, 300, "提出", {
          fontSize: 30,
          fontFamily: "Arial",
          origin: 0.5,
        })
        .setColor("#000000")
        .setInteractive();

      submit.on(
        "pointerdown",
        (pointer) => {
          let inputText = editor.text;
          console.log(inputText);
          socket.emit("word", { token: socket.token, submit_word: inputText });
          editor.close();
          explanation.destroy();
          please_text.destroy();
          editor.destroy();
          submit.destroy();
          let wait_explanation = this.add.text(200, 130, "他の人の行動を待っています...", {
            fontSize: 30,
            fontFamily: "Arial",
            origin: 0.5,
          }).setColor("#000000");
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
