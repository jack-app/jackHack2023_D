

// export default class Card {
//     constructor(scene, sprite) {
//         this.scene = scene
//         this.sprite = sprite
//         this.posX = 0
//         this.posY = 0
//     }

//     setPosition(x, y) {
//         this.posX = x
//         this.posY = y
//     }

//     draw(x, y, draggable=true) {
//         this.setPosition(x, y)
//         this.image = this.scene.add.image(this.posX, this.posY, this.sprite)
//             .setScale(0.3, 0.3)
//             .setInteractive()
//         if (draggable) {
//             this.image.drag = this.scene.plugins.get("rexdragplugin").add(this.image)
//             this.image.drag.drag()
//             this.image.on("dragend", (pointer) => {
//                 // drag終了時の処理をかける（書かなくてもよさそう）
//                 console.log("dragend")
//                 console.log(pointer)
//                 // this.image.destroy()
//             }, this.image)
//         }
//     }

// }




// カードクラスを定義
export default class Card extends Phaser.GameObjects.Container {
    constructor(scene, x, y, text) {
      super(scene, x, y);

      // card frame
      this.card = scene.add.rectangle(0, 0, 100, 150, 0xffffff);
      this.add(this.card);

      // card text
      this.text = scene.add.text(0, 0, text, { color: '#000000' });
      this.text.setOrigin(0.5);
      this.add(this.text);

      // enable dnd
      this.setSize(100,100)
      this.setInteractive()
      scene.input.setDraggable(this);
      scene.input.on('dragstart', (pointer, gameObject) => {
        console.log("drag start")
        scene.children.bringToTop(gameObject);
      });
      scene.input.on('drag', (pointer, gameObject, dragX, dragY) => {
        console.log("drag")
        gameObject.x = dragX;
        gameObject.y = dragY;
      });
      scene.input.on("dragend", (pointer, gameObject) => {
        console.log("drag end")
      })
    }
  }

  // カードを作成し、シーンに追加
//   let card = new Card(this, 100, 100, 'カードのテキスト');
//   this.add.existing(card);