export default class Cena {
  /* É responsável por desennhar elementos na tela em uma animação.
   */
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.sprites = [];

    this.t0 = 0;
    this.dt = 0;

    this.idAnim = null;
    this.aRemover = new Set();
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

  quadro(t) {
    this.t0 = this.t0 ?? t;
    this.dt = (t - this.t0) / 1000;

    this.passo(this.dt);
    this.desenhar();
    this.checaColisao();

    this.t0 = t;
    this.iniciar();
  }

  iniciar() {
    this.idAnim = requestAnimationFrame((t) => this.quadro(t));
  }

  parar() {
    cancelAnimationFrame(this.idAnim);
    this.t0 = null;
    this.dt = 0;
  }

  checaColisao() {
    for (let a = 0; a < this.sprites.length - 1; a++) {
      const spriteA = this.sprites[a];
      for (let b = a + 1; b < this.sprites.length; b++) {
        const spriteB = this.sprites[b];
        if (spriteA.colidiuCom(spriteB)) {
          this.quandoColidir(spriteA, spriteB);
        }
      }
    }
  }

  quandoColidir(a, b) {
    this.aRemover.add(a);
    this.aRemover.add(b);
    console.log(this.aRemover);
  }
}