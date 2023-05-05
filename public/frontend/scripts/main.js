import { scenes } from "./scenes/scenes.js";

export let socket = null;

export const setSocket = (value) => {
  socket = value;
};

const config = {
  parent: "mainFrame",
  type: Phaser.AUTO,
  height: 600,
  width: 800,
  scene: scenes,
  backgroundColor: "#b0e0e6",
  dom: {
    createContainer: true
  },
};

class LoveGame extends Phaser.Game {
  constructor(config) {
    super(config);
  }
}

window.addEventListener("load", () => {
  const game = new LoveGame(config);
});
