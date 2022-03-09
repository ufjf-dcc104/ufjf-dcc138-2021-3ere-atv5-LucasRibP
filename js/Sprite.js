export default class Sprite {
  /*
    É responsável por modelar algo que se move na tela
  */
  constructor({
    x = 100,
    y = 100,
    vx = 0,
    vy = 0,
    w = 20,
    h = 20,
    color = "white",
    controlar = () => {},
    deathSound = null,
    soundPriority = -Infinity,
    colidivel = true,
    restringivel = true,
  } = {}) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.w = w;
    this.h = h;
    this.color = color;
    this.cena = null;
    this.mx = 0;
    this.my = 0;
    this.controlar = controlar;
    this.deathSound = deathSound;
    this.soundPriority = soundPriority;
    this.colidivel = colidivel;
    this.restringivel = restringivel;
  }

  desenhar(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x - this.w / 2, this.y - this.h / 2, this.w, this.h);
    if (this.cena.isDebugging) {
      ctx.strokeStyle = "blue";
      ctx.strokeRect(
        this.mx * this.cena.mapa.SIZE,
        this.my * this.cena.mapa.SIZE,
        this.cena.mapa.SIZE,
        this.cena.mapa.SIZE
      );
    }
  }

  controlar(dt) {}

  mover(dt) {
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.mx = Math.floor(this.x / this.cena.mapa.SIZE);
    this.my = Math.floor(this.y / this.cena.mapa.SIZE);
  }

  passo(dt) {
    this.controlar(dt);
    this.mover(dt);
  }

  colidiuCom(outro) {
    return this.colidivel && outro.colidivel
      ? !(
          this.x - this.w / 2 > outro.x + outro.w / 2 ||
          this.x + this.w / 2 < outro.x - outro.w / 2 ||
          this.y - this.h / 2 > outro.y + outro.h / 2 ||
          this.y + this.h / 2 < outro.y - outro.h / 2
        )
      : false;
  }

  aplicaRestricoes(dt) {
    if (this.restringivel) {
      this.aplicaRestricoesDireita(this.mx + 1, this.my - 1);
      this.aplicaRestricoesDireita(this.mx + 1, this.my);
      this.aplicaRestricoesDireita(this.mx + 1, this.my + 1);
      this.aplicaRestricoesEsquerda(this.mx - 1, this.my - 1);
      this.aplicaRestricoesEsquerda(this.mx - 1, this.my);
      this.aplicaRestricoesEsquerda(this.mx - 1, this.my + 1);
      this.aplicaRestricoesBaixo(this.mx - 1, this.my + 1);
      this.aplicaRestricoesBaixo(this.mx, this.my + 1);
      this.aplicaRestricoesBaixo(this.mx + 1, this.my + 1);
      this.aplicaRestricoesCima(this.mx - 1, this.my - 1);
      this.aplicaRestricoesCima(this.mx, this.my - 1);
      this.aplicaRestricoesCima(this.mx + 1, this.my - 1);
    }
  }

  aplicaRestricoesDireita(pmx, pmy) {
    const SIZE = this.cena.mapa.SIZE;
    if (this.vx > 0) {
      if (
        this.cena.mapa.tiles[pmy] != undefined &&
        this.cena.mapa.tiles[pmy][pmx] != undefined &&
        this.cena.mapa.tiles[pmy][pmx] != 0
      ) {
        const tile = {
          x: pmx * SIZE + SIZE / 2,
          y: pmy * SIZE + SIZE / 2,
          w: SIZE,
          h: SIZE,
        };
        if (this.colidiuCom(tile)) {
          this.vx = 0;
          this.x = tile.x - tile.w / 2 - this.w / 2 - 1;
        }
      }
    }
  }

  aplicaRestricoesEsquerda(pmx, pmy) {
    const SIZE = this.cena.mapa.SIZE;
    if (this.vx < 0) {
      if (
        this.cena.mapa.tiles[pmy] != undefined &&
        this.cena.mapa.tiles[pmy][pmx] != undefined &&
        this.cena.mapa.tiles[pmy][pmx] != 0
      ) {
        const tile = {
          x: pmx * SIZE + SIZE / 2,
          y: pmy * SIZE + SIZE / 2,
          w: SIZE,
          h: SIZE,
        };
        if (this.colidiuCom(tile)) {
          this.vx = 0;
          this.x = tile.x + tile.w / 2 + this.w / 2 + 1;
        }
      }
    }
  }

  aplicaRestricoesBaixo(pmx, pmy) {
    const SIZE = this.cena.mapa.SIZE;
    if (this.vy > 0) {
      if (
        this.cena.mapa.tiles[pmy] != undefined &&
        this.cena.mapa.tiles[pmy][pmx] != undefined &&
        this.cena.mapa.tiles[pmy][pmx] != 0
      ) {
        const tile = {
          x: pmx * SIZE + SIZE / 2,
          y: pmy * SIZE + SIZE / 2,
          w: SIZE,
          h: SIZE,
        };
        if (this.colidiuCom(tile)) {
          this.vy = 0;
          this.y = tile.y - tile.h / 2 - this.h / 2 - 1;
        }
      }
    }
  }

  aplicaRestricoesCima(pmx, pmy) {
    const SIZE = this.cena.mapa.SIZE;
    if (this.vy < 0) {
      if (
        this.cena.mapa.tiles[pmy] != undefined &&
        this.cena.mapa.tiles[pmy][pmx] != undefined &&
        this.cena.mapa.tiles[pmy][pmx] != 0
      ) {
        const tile = {
          x: pmx * SIZE + SIZE / 2,
          y: pmy * SIZE + SIZE / 2,
          w: SIZE,
          h: SIZE,
        };
        if (this.colidiuCom(tile)) {
          this.vy = 0;
          this.y = tile.y + tile.h / 2 + this.h / 2 + 1;
        }
      }
    }
  }
}
