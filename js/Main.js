import Cena from "./Cena.js";
import Sprite from "./Sprite.js";

console.log("Hello, World!");

const canvas = document.querySelector("canvas");
console.log(canvas);

const cena1 = new Cena(canvas);
cena1.desenhar();

const pc = new Sprite();
const en1 = new Sprite({ x: 140, w: 30, color: "red" });
pc.desenhar(cena1.ctx);
en1.desenhar(cena1.ctx);
