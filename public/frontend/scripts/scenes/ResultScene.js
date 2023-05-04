import { socket } from "../main.js";

export class ResultScene extends Phaser.Scene {
  constructor() {
    super({ key: "ResultScene" });
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

    // this is socket io sample.
    socket.emit("result", {});
    socket.on("result", (data) => {
      this.win_str = data.win; // string
      this.lose_str = data.lose; // array<string>

      this.add
        .text(150, 30, this.win_str, {
          fontSize: 30,
          fontFamily: "Arial",
          origin: 0.5,
        })
        .setInteractive();
      this.lose_str.forEach((d, i) => {
        this.add
          .text(150, 70 + i * 40, d, {
            fontSize: 30,
            fontFamily: "Arial",
            origin: 0.5,
          })
          .setInteractive();
      });
    });

    // const sceneName = this.add.text(150, 70, 'ResultScene').setFontSize(30).setFontFamily("Arial").setOrigin(0.5).setInteractive();

    const change = this.add
      .text(150, 400, "もどる")
      .setFontSize(20)
      .setFontFamily("Arial")
      .setOrigin(0.5)
      .setInteractive();

    change.on(
      "pointerdown",
      function (pointer) {
        this.scene.start("StartScene");
      },
      this
    );
  }

  update() {
    // https://photonstorm.github.io/phaser3-docs/Phaser.Scene.html#update
  }
}
