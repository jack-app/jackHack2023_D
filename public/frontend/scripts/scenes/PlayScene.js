import { socket } from "../main.js";
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
  }

  create() {
    // Can be defined on your own Scenes. Use it to create your game objects.
    // This method is called by the Scene Manager when the scene starts, after init() and preload().
    // If the LoaderPlugin started after preload(), then this method is called only after loading is complete.

    let player_count = null;

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

    const sceneName = this.add
      .text(150, 70, "PlayScene")
      .setFontSize(30)
      .setFontFamily("Arial")
      .setOrigin(0.5)
      .setInteractive();

    const change_to_child = this.add
      .text(150, 190, "To child scene")
      .setFontSize(20)
      .setFontFamily("Arial")
      .setOrigin(0.5)
      .setInteractive();
    const change_to_parent = this.add
      .text(150, 220, "To parent scene")
      .setFontSize(20)
      .setFontFamily("Arial")
      .setOrigin(0.5)
      .setInteractive();

    change_to_child.on(
      "pointerdown",
      function (pointer) {
        this.scene.start("PlayChildScene");
      },
      this
    );
    change_to_parent.on(
      "pointerdown",
      function (pointer) {
        this.scene.start("PlayParentScene");
      },
      this
    );
  }

  update() {
    // https://photonstorm.github.io/phaser3-docs/Phaser.Scene.html#update
  }
}
