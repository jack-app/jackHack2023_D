import { socket } from "../main.js";

export class PlayParentScene extends Phaser.Scene {
  constructor() {
    super({ key: "PlayParentScene" });
  }

  init() {
    // Can be defined on your own Scenes.
    // This method is called by the Scene Manager when the scene starts, before preload() and create().

    // definition of padding X and Y
    this.paddingX = this.sys.canvas.width * 0.1;
    this.paddingY = this.sys.canvas.height * 0.1;
  }

  preload() {
    // Can be defined on your own Scenes. Use it to load assets.
    // This method is called by the Scene Manager, after init() and before create(), only if the Scene has a LoaderPlugin.
    // After this method completes, if the LoaderPlugin's queue isn't empty, the LoaderPlugin will start automatically

    this.load.plugin(
      "rexcheckboxplugin",
      "https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexcheckboxplugin.min.js",
      true
    );

    this.load.image("background", "frontend/81643.png");
  }

  create() {
    // Can be defined on your own Scenes. Use it to create your game objects.
    // This method is called by the Scene Manager when the scene starts, after init() and preload().
    // If the LoaderPlugin started after preload(), then this method is called only after loading is complete.
    const TIME_LIMIT = 30000;
    const CHECKBOX_WIDTH = 30;
    const Y_CHECKBOX_PER = 0.8;
    const X_TEXT_PUDDING = 10;
    const CHECKBOX_HEIGHT = 30;

    let x, y;
    let checkbox;

    this.checkbox_ls = [];
    this.proposed = false;
    this.TIMEOUT = false;
    this.THIS_GAME_END = false;

    const sys_height = this.sys.canvas.height;
    const sys_width = this.sys.canvas.width;

    this.background = this.add
      .image(sys_width / 2, sys_height / 2, "background")
      .setOrigin(0.5, 0.5);
    this.background.displayHeight = this.sys.canvas.height;
    this.background.displayWidth = this.sys.canvas.width;
    console.log(this.sys.canvas.width);
    this.background.setSize(this.sys.canvas.width, this.sys.canvas.height);
    let wait_sentence = this.add
      .text(400, 100, "プロポーズを待っています...")
      .setColor("#000000")
      .setFontSize(30)
      .setFontFamily("Arial")
      .setOrigin(0.5)
      .setInteractive();

    socket.on("judge", (data) => {
      let sentence_ls = data.sentences;
      this.proposed = true;
      const player_num = sentence_ls.length;
      wait_sentence.destroy();
      let judge_sentence = this.add
        .text(400, 100, "どのプロポーズを選びますか？")
        .setColor("#000000")
        .setFontSize(30)
        .setFontFamily("Arial")
        .setOrigin(0.5)
        .setInteractive();

      for (let i = 0; i < player_num; i++) {
        x = CHECKBOX_WIDTH / 2 + 100;
        y =
          ((sys_height - 100) * Y_CHECKBOX_PER * i) / player_num +
          CHECKBOX_HEIGHT / 2 +
          150;

        checkbox = this.add.rexCheckbox(x, y, CHECKBOX_WIDTH, CHECKBOX_HEIGHT);
        this.checkbox_ls.push(checkbox);

        x = CHECKBOX_WIDTH + X_TEXT_PUDDING + 100;

        this.add.text(x, y - 5, sentence_ls[i]);
      }

      //y = (sys_height - 100) * Y_CHECKBOX_PER + CHECKBOX_HEIGHT / 2;

      this.time.addEvent({
        delay: TIME_LIMIT,
        callback: () => {
          if (!this.THIS_GAME_END) {
            this.TIMEOUT = true;

            alert("Time Limit");
          }
        },
      });
    });

    socket.on("finish-judge", (data) => {
      this.scene.start("ResultScene");
    });
  }

  update(time, delta) {
    // https://photonstorm.github.io/phaser3-docs/Phaser.Scene.html#update

    let winner = -1;
    if (this.proposed && !this.THIS_GAME_END) {
      if (this.TIMEOUT) {
        // winnerは今回のサイクルの勝者
        winner = Math.floor(Math.random() * this.checkbox_ls.length);
        console.log(winner);
        socket.emit("judge", { winner: winner });
        this.THIS_GAME_END = true;
      } else {
        let true_count = 0;

        for (let i = 0; i < this.checkbox_ls.length; i++) {
          if (this.checkbox_ls[i].checked) {
            true_count++;
            winner = i;
          }
        }

        if (true_count == 1) {
          console.log(winner);
          socket.emit("judge", { winner: winner });
          this.THIS_GAME_END = true;
        }
      }
    }
  }
}
