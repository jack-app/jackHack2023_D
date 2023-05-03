
export class PlayParentScene extends Phaser.Scene {
    constructor() {
        super({ key: "PlayParentScene" })
    }


    init() {
        // Can be defined on your own Scenes.
        // This method is called by the Scene Manager when the scene starts, before preload() and create().
    }


    preload() {
        // Can be defined on your own Scenes. Use it to load assets.
        // This method is called by the Scene Manager, after init() and before create(), only if the Scene has a LoaderPlugin.
        // After this method completes, if the LoaderPlugin's queue isn't empty, the LoaderPlugin will start automatically

        this.load.image("background", "frontend/81643.png")
    }


    create() {
        // Can be defined on your own Scenes. Use it to create your game objects.
        // This method is called by the Scene Manager when the scene starts, after init() and preload().
        // If the LoaderPlugin started after preload(), then this method is called only after loading is complete.



        this.background = this.add.image(0, 0, "background").setOrigin(.5, .5)
        // this.background.displayHeight = this.sys.canvas.height
        // this.background.displayWidth  = this.sys.canvas.width
        console.log(this.sys.canvas.width)
        this.background.setSize(this.sys.canvas.width, this.sys.canvas.height)
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
