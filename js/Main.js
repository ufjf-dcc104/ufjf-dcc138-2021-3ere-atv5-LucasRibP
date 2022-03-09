import AssetManager from "./AssetManager.js";
import Cena from "./Cena.js";
import Mapa from "./Mapa.js";
import Sprite from "./Sprite.js";
import modeloMapa from "../maps/mapa1.js";
import Mixer from "./Mixer.js";
import InputManager from "./InputManager.js";

const input = new InputManager();
const mixer = new Mixer(10);
const assets = new AssetManager(mixer);

assets.carregaImagem("ice", "assets/ice0.png");
assets.carregaImagem("water_btm", "assets/dngn_shallow_bord_btm.png");
assets.carregaImagem("water_lft", "assets/dngn_shallow_bord_lft.png");
assets.carregaImagem("water_rgt", "assets/dngn_shallow_bord_rgt.png");
assets.carregaImagem("water_top", "assets/dngn_shallow_bord_top.png");
assets.carregaImagem("water", "assets/dngn_shallow_water.png");
// assets.carregaAudio("boom", "assets/boom.wav");
// assets.carregaAudio("lose", "assets/lose.wav");

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
  ArrowRight: "MOVE_DIREITA",
  ArrowUp: "MOVE_CIMA",
  ArrowDown: "MOVE_BAIXO",
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
};

mapa1.carregaMapa(modeloMapa, tileIdToTile);
cena1.configuraMapa(mapa1);

const pc = new Sprite({
  x: (configMapa.colunas * configMapa.tamanho) / 2,
  y: (configMapa.linhas * configMapa.tamanho) / 2,
  soundPriority: Infinity,
  color: "#3a752a",
  h: 30,
  w: 30,
});

const cannonHeight = 30;
const cannon = new Sprite({
  x: (configMapa.colunas * configMapa.tamanho) / 2,
  y: (configMapa.linhas * configMapa.tamanho - cannonHeight) / 2,
  soundPriority: Infinity,
  color: "#2e5c21",
  h: cannonHeight,
  w: 5,
  colidivel: false,
  restringivel: false,
});

pc.controlar = moveTanque;
cannon.controlar = moveCannon;

cena1.adicionar(pc);
cena1.adicionar(cannon);

const velocidadeTanque = 50;

function moveTanque(dt) {
  if (input.comandos.get("MOVE_ESQUERDA")) {
    this.vx = -velocidadeTanque;
  } else if (input.comandos.get("MOVE_DIREITA")) {
    this.vx = +velocidadeTanque;
  } else {
    this.vx = 0;
  }

  if (input.comandos.get("MOVE_CIMA")) {
    this.vy = -velocidadeTanque;
  } else if (input.comandos.get("MOVE_BAIXO")) {
    this.vy = +velocidadeTanque;
  } else {
    this.vy = 0;
  }
}

function moveCannon(dt) {
  if (input.comandos.get("MOVE_ESQUERDA")) {
    this.vx = -velocidadeTanque;
  } else if (input.comandos.get("MOVE_DIREITA")) {
    this.vx = +velocidadeTanque;
  } else {
    this.vx = 0;
  }

  if (input.comandos.get("MOVE_CIMA")) {
    this.vy = -velocidadeTanque;
  } else if (input.comandos.get("MOVE_BAIXO")) {
    this.vy = +velocidadeTanque;
  } else {
    this.vy = 0;
  }
}

function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top,
  };
}

function perseguePC(dt) {
  this.vx = 25 * Math.sign(pc.x - this.x);
  this.vy = 25 * Math.sign(pc.y - this.y);
}

function geraInimigo(cena) {
  cena.adicionar(
    new Sprite({
      ...cena.mapa.geraPosicaoValidaAleatoria(),
      color: "red",
      controlar: perseguePC,
      soundPriority: 0,
    })
  );
}

cena1.iniciar();

document.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "s":
      cena1.iniciar();
      break;
    case "p":
      cena1.parar();
      break;
  }
});
canvas.addEventListener("mousemove", (e) => {
  const rect = canvas.getBoundingClientRect();
  console.log({
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
  });
});
