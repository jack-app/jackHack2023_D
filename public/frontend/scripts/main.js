import { scenes } from "./scenes/scenes.js"


const config = {
    parent: 'mainFrame',
    type: Phaser.AUTO,
    height: 600,
    width: 800,
    scene: scenes,
    backgroundColor: '#4488aa' // TODO: 要検討
}


class LoveGame extends Phaser.Game {
    constructor(config) {
        super(config)
    }
}



window.addEventListener("load", () => {
    const game = new LoveGame(config)
})