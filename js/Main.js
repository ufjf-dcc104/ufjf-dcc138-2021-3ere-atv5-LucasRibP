import AssetManager from "./AssetManager.js";
import Cena from "./Cena.js";
import Mapa from "./Mapa.js";
import Sprite from "./Sprite.js";
import modeloMapa from "../maps/mapa1.js";

const assets = new AssetManager();
const canvas = document.querySelector("canvas");
const configMapa = {
  linhas: 10,
  colunas: 14,
  tamanho: 32,
};

canvas.width = configMapa.colunas * configMapa.tamanho;
canvas.height = configMapa.linhas * configMapa.tamanho;

const cena1 = new Cena(canvas, assets);
const mapa1 = new Mapa(
  configMapa.linhas,
  configMapa.colunas,
  configMapa.tamanho
);
mapa1.carregaMapa(modeloMapa);
cena1.configuraMapa(mapa1);

const pc = new Sprite();
const en1 = new Sprite({ x: 140, w: 30, vx: -10, color: "red" });

cena1.adicionar(pc);
cena1.adicionar(en1);
cena1.adicionar(new Sprite({ x: 140, y: 40, w: 30, vx: 0, color: "red" }));
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
