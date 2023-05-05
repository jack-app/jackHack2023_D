import { setSocket } from "../main.js";

export class StartScene extends Phaser.Scene {
  constructor() {
    super({ key: "StartScene" });
  }

  init() {
    // Can be defined on your own Scenes.
    // This method is called by the Scene Manager when the scene starts, before preload() and create().
  }

  preload() {
    // Can be defined on your own Scenes. Use it to load assets.
    // This method is called by the Scene Manager, after init() and before create(), only if the Scene has a LoaderPlugin.
    // After this method completes, if the LoaderPlugin's queue isn't empty, the LoaderPlugin will start automatically
    this.load.image("background", "frontend/81643.png");
  }

  create() {
    // Can be defined on your own Scenes. Use it to create your game objects.
    // This method is called by the Scene Manager when the scene starts, after init() and preload().
    // If the LoaderPlugin started after preload(), then this method is called only after loading is complete.
    
    setSocket(null);

    const sys_height = this.sys.canvas.height;
    const sys_width = this.sys.canvas.width;

    this.background = this.add
      .image(sys_width / 2, sys_height / 2, "background")
      .setOrigin(0.5, 0.5);
    this.background.displayHeight = sys_height;
    this.background.displayWidth = sys_width;
    this.background.setSize(sys_width, sys_height);

    const sceneName = this.add
      .text(400, 200, "Love game")
      .setColor("#000000")
      .setFontSize(80)
      .setFontFamily("Helvetica")
      .setOrigin(0.5)
      .setInteractive();

    const change = this.add
      .text(380, 400, "入室")
      .setColor("#000000")
      .setFontSize(30)
      .setFontFamily("Arial")
      .setOrigin(0.5)
      .setInteractive();

    change.on(
      "pointerdown",
      function (pointer) {
        this.scene.start("PlayScene");
      },
      this
    );
  }

  update() {
    // https://photonstorm.github.io/phaser3-docs/Phaser.Scene.html#update
  }
}
