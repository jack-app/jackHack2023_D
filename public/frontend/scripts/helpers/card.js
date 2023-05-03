
// 並び変える対象のカード
export default class Card extends Phaser.GameObjects.Container {
    constructor(scene, text) {
      super(scene, 0, 0);
      this.setPosition(0, 0)

      // card frame
      this.card = scene.add.rectangle(0, 0, 100, 150, 0xffffff);
      this.add(this.card);

      // card text
      this.text = scene.add.text(0, 0, text, { color: '#000000' });
      this.text.setOrigin(0.5);
      this.add(this.text);

      // enable dnd
      this.setSize(100,100) // この辺でスケールとかサイズとか調整
      this.setInteractive()
      this.scene.input.setDraggable(this);
      this.scene.input.on('dragstart', this.dragStart);
      this.scene.input.on('drag', this.drag);
      this.scene.input.on("dragend", this.dragEnd)
    }


    dragStart(pointer, gameObject) {
      console.log("==== Drag Start ====")
      // console.log(pointer)
      // console.log(gameObject)
      this.scene.children.bringToTop(gameObject);
      console.log("=====================")
    }


    drag(pointer, gameObject, dragX, dragY) {
      console.log("==== Drag ====")
      // console.log(pointer)
      // console.log(gameObject)
      // console.log(dragX)
      // console.log(dragY)
      gameObject.x = dragX;
      gameObject.y = dragY;
      console.log("==============")
    }

    dragEnd(pointer, gameObject) {
      console.log("==== Drag End ====")
      console.log("==================")
    }
  }

  // カードを作成し、シーンに追加
//   let card = new Card(this, 100, 100, 'カードのテキスト');
//   this.add.existing(card);