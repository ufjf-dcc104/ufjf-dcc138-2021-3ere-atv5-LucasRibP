export default class Cena {
  /* É responsável por desennhar elementos na tela em uma animação.
   */
  constructor(canvas, assets = null) {
    this.canvas = canvas;
    this.assets = assets;
    this.ctx = canvas.getContext("2d");
    this.sprites = [];

    this.t0 = 0;
    this.dt = 0;

    this.idAnim = null;
    this.aRemover = new Set();
    this.mapa = null;
  }

  desenhar() {
    this.ctx.fillStyle = "lightblue";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this?.mapa.desenhar(this.ctx);

    if (this.assets.acabou()) {
      this.sprites.forEach((sprite) => {
        sprite.desenhar(this.ctx);
      });
    } else {
      this.ctx.fillStyle = "yellow";
      this.ctx.fillText(this.assets?.progresso(), 10, 20);
    }
  }

  adicionar(sprite) {
    sprite.cena = this;
    this.sprites.push(sprite);
  }

  passo(dt) {
    if (!this.assets.acabou()) return;

    this.sprites.forEach((sprite) => sprite.passo(dt));
  }

  quadro(t) {
    this.t0 = this.t0 ?? t;
    this.dt = (t - this.t0) / 1000;

    this.passo(this.dt);
    this.desenhar();
    this.checaColisao();
    this.removeSprites();

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

  removeSprites() {
    if (this.aRemover.size > 0) {
      this.sprites = this.sprites.filter((item) => !this.aRemover.has(item));
      this.aRemover = [];
    }
  }

  configuraMapa(mapa) {
    this.mapa = mapa;
    this.mapa.cena = this;
  }
}
