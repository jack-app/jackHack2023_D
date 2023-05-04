import Card from "../helpers/card.js";
import { socket } from "../main.js";

export class PlayChildScene extends Phaser.Scene {
  constructor() {
    super({ key: "PlayChildScene" });
  }

  init() {
    // definition of padding X and Y
    const padding_x_ratio = 0.15;
    const padding_y_ratio = 0.2;
    this.paddingX = this.sys.canvas.width * padding_x_ratio;
    this.paddingY = this.sys.canvas.height * padding_y_ratio;
    this.fieldWidth = this.sys.canvas.width - this.paddingX * 2;

    this.selected_cards = [];
    this.unselected_cards = [];
  }

  preload() {
    // load image
    this.load.image("background", "frontend/81643.png");

    // load sample image
    const url =
      "https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/assets/images/arrow.png";
    this.load.image("arrow", url);

    // load words
    this.sample_wards = ["this", "is", "sample", "words"];
  }

  create() {
    // Set background image
    this.background = this.add
      .image(
        this.sys.canvas.width / 2,
        this.sys.canvas.height / 2,
        "background"
      )
      .setOrigin(0.5, 0.5);
    this.background.displayWidth = this.sys.canvas.width;
    this.background.displayHeight = this.sys.canvas.height;

    this.selectedField = this.add
      .rectangle(
        this.sys.canvas.width / 2,
        this.sys.canvas.height * 0.3,
        this.fieldWidth,
        120,
        0xffffff,
        0.5
      )
      .setOrigin(0.5, 0.5); // 左上の座標基準
    this.unselectedField = this.add
      .rectangle(
        this.sys.canvas.width / 2,
        this.sys.canvas.height * 0.7,
        this.fieldWidth,
        120,
        0xffffff,
        0.5
      )
      .setOrigin(0.5, 0.5); // 左上の座標基準

    // これなに？？？
    this.input.addPointer(3);

    // words から Cardを作成＆表示
    this.unselected_cards = this.sample_wards.map(
      (s, index) => new Card(this, s, index)
    );
    this.unselected_cards.forEach((card, i) => {
      card.setPosition(
        this.sys.canvas.width / 2 -
          this.fieldWidth / 2 +
          100 * i +
          50 +
          10 * i +
          10,
        this.sys.canvas.height * 0.7
      );
      this.add.existing(card);
    });

    this.reset = this.add
      .text(this.sys.canvas.width / 2 - 30, this.sys.canvas.height / 2, "reset")
      .setFontSize(20)
      .setFontFamily("Arial")
      .setOrigin(0.5, 0.5)
      .setInteractive();
    this.reset.on("pointerdown", this.#reset, this);

    this.submit = this.add
      .text(
        this.sys.canvas.width / 2 + 30,
        this.sys.canvas.height / 2,
        "submit"
      )
      .setFontSize(20)
      .setFontFamily("Arial")
      .setOrigin(0.5, 0.5)
      .setInteractive();
    this.submit.on("pointerdown", this.#submit, this);

    socket.on("finish-judge", (data) => {
      this.scene.start("ResultScene");
    });
  }

  update() {
    // https://photonstorm.github.io/phaser3-docs/Phaser.Scene.html#update
  }

  #reset(pointer) {
    this.unselected_cards.push(...this.selected_cards);
    this.selected_cards = [];
    this.unselected_cards.forEach((card, i) => {
      card.setPosition(
        this.sys.canvas.width / 2 -
          this.fieldWidth / 2 +
          100 * card.index +
          50 +
          10 * card.index +
          10,
        this.sys.canvas.height * 0.7
      );
    });
  }

  #clear() {
    console.log("-----selected-----");
    this.selected_cards.forEach((card) => {
      console.log(card.rawText);
      card.destroy();
    });
    console.log("-----unselected-----");
    this.unselected_cards.forEach((card) => {
      console.log(card.rawText);
      card.destroy();
    });
    this.unselectedField.destroy();
    this.selectedField.destroy();
    this.reset.destroy();
    this.submit.destroy();
  }

  #submit(pointer) {
    const str = this.selected_cards.map((card) => card.rawText).join(" ");
    console.log("submit string is ", str);
    socket.emit("submit", { sentence: str });
    this.#clear();
    let wait_sentence = this.add
      .text(400, 100, "他の人の行動を待っています...")
      .setFontSize(30)
      .setFontFamily("Arial")
      .setOrigin(0.5)
      .setInteractive();
  }

  // used in card class
  toSelectedField(card) {
    const index = this.unselected_cards.findIndex(
      (c) => c.text == card.rawText
    );
    // console.log(index)
    if (index) {
      this.unselected_cards.splice(index - 1, 1);
      this.selected_cards.push(card);
      //   console.log("==================");
      //   console.log(this.selected_cards);
      //   console.log(this.unselected_cards);
      //   console.log("==================");
    } else {
      return;
    }
  }

  toUnselectedField(card) {
    const index = this.unselected_cards.findIndex(
      (c) => c.text == card.rawText
    );
    // console.log(index)
    if (index) {
      this.selected_cards.splice(index, 1);
      this.unselected_cards.push(card);
      // console.log("==================")
      // console.log(this.selected_cards)
      // console.log(this.unselected_cards)
      // console.log("==================")
    } else {
      return;
    }
  }
}
