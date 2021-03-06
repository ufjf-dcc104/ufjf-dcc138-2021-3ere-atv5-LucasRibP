import AssetManager from "./AssetManager.js";
import Cena from "./Cena.js";
import Mapa from "./Mapa.js";
import Sprite from "./Sprite.js";
import Cannon from "./Cannon.js";
import modeloMapa from "../maps/mapa1.js";
import Mixer from "./Mixer.js";
import InputManager from "./InputManager.js";
import LevelManager from "./LevelManager.js";

const input = new InputManager();
const mixer = new Mixer(10);
const assets = new AssetManager(mixer);

const aceleracaoTanque = 200;
const cannonHeight = 30;
const fireballRadius = 10;

assets.carregaImagem("mageSheet", "assets/mage_sheet.png");
assets.carregaImagem("ice", "assets/ice0.png");
assets.carregaImagem("water_btm", "assets/dngn_shallow_bord_btm.png");
assets.carregaImagem("water_lft", "assets/dngn_shallow_bord_lft.png");
assets.carregaImagem("water_rgt", "assets/dngn_shallow_bord_rgt.png");
assets.carregaImagem("water_top", "assets/dngn_shallow_bord_top.png");
assets.carregaImagem("water", "assets/dngn_shallow_water.png");
assets.carregaAudio("atira", "assets/atira.wav");
assets.carregaAudio("mata", "assets/mata.wav");
assets.carregaAudio("morre", "assets/morre.wav");
assets.carregaAudio("ganha", "assets/ganha.wav");

const canvas = document.querySelector("canvas");
const configMapa = {
  linhas: modeloMapa.length,
  colunas: modeloMapa[0].length,
  tamanho: 32,
};

canvas.width = configMapa.colunas * configMapa.tamanho;
canvas.height = configMapa.linhas * configMapa.tamanho;

input.configurarTeclado({
  ArrowLeft: "MOVE_ESQUERDA",
  a: "MOVE_ESQUERDA",
  ArrowRight: "MOVE_DIREITA",
  d: "MOVE_DIREITA",
  ArrowUp: "MOVE_CIMA",
  w: "MOVE_CIMA",
  ArrowDown: "MOVE_BAIXO",
  s: "MOVE_BAIXO",
});

const cena1 = new Cena(canvas, assets);
const mapa1 = new Mapa(
  configMapa.linhas,
  configMapa.colunas,
  configMapa.tamanho,
  cena1
);

const tileIdToTile = {
  0: [assets.img("ice")],
  1: [assets.img("ice"), assets.img("water_top"), assets.img("water_lft")],
  2: [assets.img("ice"), assets.img("water_top")],
  3: [assets.img("ice"), assets.img("water_top"), assets.img("water_rgt")],
  4: [assets.img("ice"), assets.img("water_rgt")],
  5: [assets.img("ice"), assets.img("water_rgt"), assets.img("water_btm")],
  6: [assets.img("ice"), assets.img("water_btm")],
  7: [assets.img("ice"), assets.img("water_btm"), assets.img("water_lft")],
  8: [assets.img("ice"), assets.img("water_lft")],
  9: [assets.img("water")],
  10: [assets.img("water")], // N??o gerar magos na bordas
};

mapa1.carregaMapa(modeloMapa, tileIdToTile);
cena1.configuraMapa(mapa1);
const levelManager = new LevelManager({
  geraPlayer: (scene) => {
    const pc = new Sprite({
      x: (configMapa.colunas * configMapa.tamanho) / 2,
      y: (configMapa.linhas * configMapa.tamanho) / 2,
      soundPriority: Infinity,
      color: "#3a752a",
      speedDecline: 0.8,
      h: 30,
      w: 30,
      forbiddenTiles: [9, 10],
      onForbiddenTileEntry: () => {
        levelManager.loseLevel();
      },
      restringivel: true,
    });

    const cannon = new Cannon({
      x: (configMapa.colunas * configMapa.tamanho) / 2,
      y: (configMapa.linhas * configMapa.tamanho - cannonHeight) / 2,
      shotSound: "atira",
      assetManager: assets,
      soundPriority: Infinity,
      color: "#2e5c21",
      h: cannonHeight,
      w: 5,
      colidivel: false,
      restringivel: false,
      canvas: canvas,
      tank: pc,
    });

    pc.controlar = moveTanque;
    pc.onDeath = () => {
      scene.removeSprite(cannon);
      levelManager.loseLevel();
    };

    levelManager.player = pc;
    scene.adicionar(pc);
    scene.adicionar(cannon);
  },
  geraInimigo: (scene) => {
    let pos = scene.mapa.geraPosicaoValidaAleatoria([9]);
    let posStr = `${pos.line} - ${pos.col}`;

    while (levelManager.posInimigosGerados.includes(posStr)) {
      pos = scene.mapa.geraPosicaoValidaAleatoria([9]);
      posStr = `${pos.line} - ${pos.col}`;
    }
    levelManager.posInimigosGerados.push(posStr);
    scene.enemyCount += 1;

    const enemy = new Sprite({
      ...pos,
      color: "red",
      soundPriority: 0,
      w: 24,
      h: 48,
      spriteAnim: {
        start: { x: 0, y: 0 },
        dim: { h: 64, w: 32 },
        delta: { x: 32, y: 0 },
        image: "mageSheet",
        nStates: 5,
        stateDelay: 200,
      },
      onDeath: () => {
        assets.playAudioFromKey("mata");
        scene.enemyCount -= 1;
        if (scene.enemyCount == 0) {
          levelManager.winLevel();
        }
      },
      assetManager: assets,
    });

    enemy.addTimedEvent(1000 + 500 * Math.random(), atiraNoTanque);
    scene.adicionar(enemy);
  },
  onWinLevel: () => {
    assets.playAudioFromKey("ganha");
    console.log("You won :D");
  },
  onLoseLevel: () => {
    assets.playAudioFromKey("morre");
    console.log("You lost :(");
  },
  cena: cena1,
});

function moveTanque(dt) {
  if (input.comandos.get("MOVE_ESQUERDA")) {
    this.ax = -aceleracaoTanque;
  } else if (input.comandos.get("MOVE_DIREITA")) {
    this.ax = +aceleracaoTanque;
  } else {
    this.ax = 0;
  }

  if (input.comandos.get("MOVE_CIMA")) {
    this.ay = -aceleracaoTanque;
  } else if (input.comandos.get("MOVE_BAIXO")) {
    this.ay = +aceleracaoTanque;
  } else {
    this.ay = 0;
  }
}

function atiraNoTanque() {
  const pc = levelManager.getPlayer();
  const shotSpeed = levelManager.getShotSpeed();
  const scene = levelManager.getCena();

  const direcao = {
    x: pc.x - this.x,
    y: pc.y - this.y,
  };
  const norma = Math.sqrt(direcao.x ** 2 + direcao.y ** 2);
  direcao.x /= norma;
  direcao.y /= norma;

  const origemTiro = {
    x: this.x + direcao.x * this.h,
    y: this.y + direcao.y * this.h,
  };

  scene.adicionar(
    new Sprite({
      ...origemTiro,
      vx: direcao.x * shotSpeed,
      vy: direcao.y * shotSpeed,
      raio: fireballRadius,
      ehBola: true,
      color: "red",
    })
  );
}

document.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "Enter":
      levelManager.userConfirmation();
      break;
  }
});
