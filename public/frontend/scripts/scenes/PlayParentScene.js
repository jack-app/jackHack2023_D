import Card from "../helpers/card.js";

export class PlayParentScene extends Phaser.Scene {
    constructor() {
        super({ key: "PlayParentScene" })
    }


    init() {
        // Can be defined on your own Scenes.
        // This method is called by the Scene Manager when the scene starts, before preload() and create().

        // definition of padding X and Y
        this.paddingX = this.sys.canvas.width * 0.1
        this.paddingY = this.sys.canvas.height * 0.1
    }


    preload() {
        // Can be defined on your own Scenes. Use it to load assets.
        // This method is called by the Scene Manager, after init() and before create(), only if the Scene has a LoaderPlugin.
        // After this method completes, if the LoaderPlugin's queue isn't empty, the LoaderPlugin will start automatically

        // load image
        this.load.image("background", "frontend/81643.png")

        // load dnd plugin
        let url = 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexdragplugin.min.js';
        this.load.plugin('rexdragplugin', url, true);

        // load sample image
        url = 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/assets/images/arrow.png';
        this.load.image('arrow', url);
    }


    create() {
        // Can be defined on your own Scenes. Use it to create your game objects.
        // This method is called by the Scene Manager when the scene starts, after init() and preload().
        // If the LoaderPlugin started after preload(), then this method is called only after loading is complete.

        // Set background image
        this.background = this.add.image(this.sys.canvas.width/2, this.sys.canvas.height/2, "background").setOrigin(.5, .5)
        this.background.displayWidth = this.sys.canvas.width;
        this.background.displayHeight = this.sys.canvas.height;


        this.input.addPointer(3)
        // this.input.on("pointerdown", (pointer) => {
        //     const img = this.add.image(pointer.x, pointer.y, 'arrow');
        //     img.drag = this.plugins.get('rexdragplugin').add(img);
        //     img.drag.drag();
        //     img.on('dragend', img.destroy, img);
        // }, this)



        this.cards = [
            new Card(this, 100, 100, "this"),
            new Card(this, 100, 200, "is"),
            new Card(this, 100, 300, "sample"),
            new Card(this, 100, 400, "text")
        ]

        // console.log(this.input)
        // console.log(this.cards)
        // this.input.setDraggable(this.cards[0])
        this.cards.forEach(card => {
            this.add.existing(card)
        })


        // change scene
        const sceneName = this.add.text(150, 70, 'PlayParentScene').setFontSize(30).setFontFamily("Arial").setOrigin(0.5).setInteractive();

	    const change = this.add.text(150, 130, 'To Result Scene').setFontSize(20).setFontFamily("Arial").setOrigin(0.5).setInteractive();

        change.on('pointerdown', function (pointer) {
            this.scene.start('ResultScene');
        }, this);
    }


    update() {
        // https://photonstorm.github.io/phaser3-docs/Phaser.Scene.html#update
    }
}
