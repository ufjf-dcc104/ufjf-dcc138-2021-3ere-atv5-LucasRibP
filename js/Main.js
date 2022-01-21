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

const canvas = document.querySelector("canvas");
const configMapa = {
  linhas: 10,
  colunas: 14,
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
  configMapa.tamanho
);
mapa1.carregaMapa(modeloMapa);
cena1.configuraMapa(mapa1);

const pc = new Sprite({ x: 50, y: 90, vx: 10 });
pc.controlar = function (dt) {
  if (input.comandos.get("MOVE_ESQUERDA")) {
    this.vx = -50;
  } else if (input.comandos.get("MOVE_DIREITA")) {
    this.vx = +50;
  } else {
    this.vx = 0;
  }
};

const en1 = new Sprite({ x: 150, vx: -10, color: "red" });

cena1.adicionar(pc);
cena1.adicionar(en1);
cena1.adicionar(new Sprite({ x: 115, y: 70, vy: 10, color: "red" }));
cena1.adicionar(new Sprite({ x: 115, y: 160, vy: -10, color: "red" }));
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
