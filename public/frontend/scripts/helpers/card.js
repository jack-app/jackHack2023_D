
// 並び変える対象のカード
export default class Card extends Phaser.GameObjects.Container {
  constructor(scene, text, index) {
    super(scene, 0, 0);
    this.setPosition(0, 0)

    // state
    this.rawText = text
    this.index = index

    // card frame
    this.card = scene.add.rectangle(0, 0, 100, 100, 0xffffff);
    this.add(this.card);

    // card text
    this.text = scene.add.text(0, 0, text, { color: '#000000' });
    this.text.setOrigin(0.5);
    this.add(this.text);

    // enable dnd
    this.setSize(100, 100) // この辺でスケールとかサイズとか調整
    this.setInteractive()
    this.scene.input.setDraggable(this);
    this.scene.input.on('dragstart', this.#dragStart);
    this.scene.input.on('drag', this.#drag);
    this.scene.input.on("dragend", this.#dragEnd);


    // onClick
    this.on("pointerdown", this.#onClick)
  }

  #onClick(pointer) {
    if (this.selected) {
      // console.log("select")
      return
    } else {
      this.selected = true
      this.setPosition(this.x, this.scene.sys.canvas.height * 0.3) // move to selected field
      this.scene.toSelectedField(this)
      this.setPosition(this.scene.sys.canvas.width / 2 - this.scene.fieldWidth / 2 + 100 * (this.scene.selected_cards.length-1) + 50 + 10 * (this.scene.selected_cards.length-1) + 10, this.scene.sys.canvas.height * 0.3)
      // console.log(this.x, this.y)
    }
  }

  #dragStart(pointer, gameObject) {
    // console.log("==== Drag Start ====")
    // console.log(pointer)
    // console.log(gameObject)
    // this.scene.children.bringToTop(gameObject);
    // console.log("=====================")
  }


  #drag(pointer, gameObject, dragX, dragY) {
    // console.log("==== Drag ====")
    // console.log(pointer)
    // console.log(gameObject)
    // console.log(dragX)
    // console.log(dragY)
    // gameObject.x = dragX;
    // gameObject.y = dragY;
    // console.log("==============")
  }

  #dragEnd(pointer, gameObject) {
    // console.log("==== Drag End ====")
    // console.log("==================")
  }
}