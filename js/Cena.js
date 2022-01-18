export default class Cena {
  /* É responsável por desennhar elementos na tela em uma animação.
   */
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.sprites = [];
  }

  desenhar() {
    this.ctx.fillStyle = "grey";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.sprites.forEach((sprite) => {
      sprite.desenhar(this.ctx);
    });
  }

  adicionar(sprite) {
    this.sprites.push(sprite);
  }

  passo(dt) {
    this.sprites.forEach((sprite) => sprite.passo(dt));
  }
}
