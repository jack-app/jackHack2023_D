import { StartScene } from "./scenes/StartScene.js"
import { PlayScene } from "./scenes/PlayScene.js"
import { ResultScene } from "./scenes/ResultScene.js"



const config = {
    parent: 'mainFrame',
    type: Phaser.AUTO,
    height: 600,
    width: 800,
    scene: [StartScene, PlayScene, ResultScene]
}


class LoveGame extends Phaser.Game {
    constructor(config) {
        super(config)
    }
}



window.addEventListener("load", () => {
    const game = new LoveGame(config)
})