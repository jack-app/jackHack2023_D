

export default class Card {
    constructor(scene, sprite) {
        this.scene = scene
        this.sprite = sprite
        this.posX = 0
        this.posY = 0
    }

    setPosition(x, y) {
        this.posX = x
        this.posY = y
    }

    draw(x, y, draggable=true) {
        this.setPosition(x, y)
        this.image = this.scene.add.image(this.posX, this.posY, this.sprite)
            .setScale(0.3, 0.3)
            .setInteractive()
        if (draggable) {
            this.image.drag = this.scene.plugins.get("rexdragplugin").add(this.image)
            this.image.drag.drag()
            this.image.on("dragend", (pointer) => {
                // drag終了時の処理をかける（書かなくてもよさそう）
                console.log("dragend")
                console.log(pointer)
                // this.image.destroy()
            }, this.image)
        }
    }

}