export default class Cena {
  /* É responsável por desennhar elementos na tela em uma animação.
   */
  constructor(canvas, assets = null, isDebugging = false) {
    this.canvas = canvas;
    this.assets = assets;
    this.ctx = canvas.getContext("2d");
    this.sprites = [];

    this.t0 = 0;
    this.dt = 0;

    this.idAnim = null;
    this.aRemover = new Set();
    this.mapa = null;
    this.isDebugging = isDebugging;
  }

  desenhar() {
    this.ctx.fillStyle = "lightblue";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    if (this.assets.acabou()) {
      this?.mapa.desenhar(this.ctx);
      this.sprites.forEach((sprite) => {
        sprite.desenhar(this.ctx);
        sprite.aplicaRestricoes();
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

  clearSprites() {
    this.sprites = [];
    this.aRemover = new Set();
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
  }

  removeSprite(item) {
    this.aRemover.add(item);
  }

  removeSprites() {
    if (this.aRemover.size > 0) {
      this.tocaSomDeMorte();

      this.sprites = this.sprites.filter((item) => !this.aRemover.has(item));
      this.aRemover = new Set();
    }
  }

  tocaSomDeMorte() {
    let maiorPrioridade = -Infinity;
    let somATocar = null;
    this.aRemover.forEach((sprite) => {
      if (sprite.soundPriority > maiorPrioridade) {
        maiorPrioridade = sprite.soundPriority;
        somATocar = sprite.deathSound;
      }
    });

    if (somATocar != null) this.assets.playAudioFromKey(somATocar);
  }

  configuraMapa(mapa) {
    this.mapa = mapa;
    this.mapa.cena = this;
  }
}
