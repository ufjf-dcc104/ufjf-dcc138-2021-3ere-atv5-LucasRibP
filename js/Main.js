import Cena from "./Cena.js";
import Sprite from "./Sprite.js";

const canvas = document.querySelector("canvas");

const cena1 = new Cena(canvas);
const pc = new Sprite();
const en1 = new Sprite({ x: 140, w: 30, vx: -10, color: "red" });

cena1.adicionar(pc);
cena1.adicionar(en1);
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