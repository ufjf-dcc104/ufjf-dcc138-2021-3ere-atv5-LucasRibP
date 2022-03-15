export default class Sprite {
  /*
    É responsável por modelar algo que se move na tela
  */
  constructor({
    x = 100,
    y = 100,
    vx = 0,
    vy = 0,
    maxVx = Infinity,
    maxVy = Infinity,
    ax = 0,
    ay = 0,
    speedDecline = 0,
    w = 20,
    h = 20,
    ehBola = false,
    raio = 100,
    color = "white",
    controlar = () => {},
    onDeath = () => {},
    onRemove = () => {},
    deathSound = null,
    soundPriority = -Infinity,
    colidivel = true,
    restringivel = true,
    disappearsUpponScreenExit = true,
    spriteAnim = null,
    assetManager = null,
  } = {}) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.ax = ax;
    this.ay = ay;
    this.speedDecline = speedDecline;
    this.w = w;
    this.h = h;
    this.ehBola = ehBola;
    this.raio = raio;
    this.color = color;
    this.cena = null;
    this.mx = 0;
    this.my = 0;
    this.controlar = controlar;
    this.deathSound = deathSound;
    this.soundPriority = soundPriority;
    this.colidivel = colidivel;
    this.restringivel = restringivel;
    this.disappearsUpponScreenExit = disappearsUpponScreenExit;
    this.onDeath = onDeath;
    this.onRemove = onRemove;
    this.spriteAnim = spriteAnim;
    this.assetManager = assetManager;
  }

  desenhar(ctx) {
    if (this.spriteAnim != null) {
      if (this.spriteState == undefined) this.spriteState = 0;
      if (this.lastSpriteStateUpdate == undefined)
        this.lastSpriteStateUpdate = Date.now();

      if (
        Date.now() - this.lastSpriteStateUpdate >
        this.spriteAnim.stateDelay
      ) {
        this.lastSpriteStateUpdate = Date.now();
        this.spriteState = (this.spriteState + 1) % this.spriteAnim.nStates;
      }

      const image = this.assetManager.img(this.spriteAnim.image);

      const sheetPos = {
        x: this.spriteAnim.start.x + this.spriteAnim.delta.x * this.spriteState,
        y: this.spriteAnim.start.y + this.spriteAnim.delta.y * this.spriteState,
      };

      ctx.drawImage(
        image,
        sheetPos.x,
        sheetPos.y,
        this.spriteAnim.dim.w,
        this.spriteAnim.dim.h,
        this.x - this.w / 2,
        this.y - this.h / 2,
        this.w,
        this.h
      );
    } else {
      ctx.fillStyle = this.color;
      if (this.ehBola) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.raio, 0, 2 * Math.PI);
        ctx.fill();
      } else {
        ctx.fillRect(this.x - this.w / 2, this.y - this.h / 2, this.w, this.h);
      }
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
  }

  controlar(dt) {}

  mover(dt) {
    this.vx = (this.vx + this.ax * dt) * (1 - this.speedDecline) ** dt;
    this.vy = (this.vy + this.ay * dt) * (1 - this.speedDecline) ** dt;
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
      if (
        this.aplicaRestricoesDireita(this.mx + 1, this.my - 1) ||
        this.aplicaRestricoesDireita(this.mx + 1, this.my) ||
        this.aplicaRestricoesDireita(this.mx + 1, this.my + 1) ||
        this.aplicaRestricoesEsquerda(this.mx - 1, this.my - 1) ||
        this.aplicaRestricoesEsquerda(this.mx - 1, this.my) ||
        this.aplicaRestricoesEsquerda(this.mx - 1, this.my + 1) ||
        this.aplicaRestricoesBaixo(this.mx - 1, this.my + 1) ||
        this.aplicaRestricoesBaixo(this.mx, this.my + 1) ||
        this.aplicaRestricoesBaixo(this.mx + 1, this.my + 1) ||
        this.aplicaRestricoesCima(this.mx - 1, this.my - 1) ||
        this.aplicaRestricoesCima(this.mx, this.my - 1) ||
        this.aplicaRestricoesCima(this.mx + 1, this.my - 1)
      ) {
        this.cena.removeSprite(this);
      }
    }
  }

  aplicaRestricoesDireita(pmx, pmy) {
    const SIZE = this.cena.mapa.SIZE;
    if (this.vx > 0) {
      if (
        this.cena.mapa.tiles[pmy] == undefined ||
        this.cena.mapa.tiles[pmy][pmx] == undefined
      ) {
        return true;
      }
      if (this.cena.mapa.tiles[pmy][pmx] != 0) {
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
    return false;
  }

  aplicaRestricoesEsquerda(pmx, pmy) {
    const SIZE = this.cena.mapa.SIZE;
    if (this.vx < 0) {
      if (
        this.cena.mapa.tiles[pmy] == undefined ||
        this.cena.mapa.tiles[pmy][pmx] == undefined
      ) {
        return true;
      }
      if (this.cena.mapa.tiles[pmy][pmx] != 0) {
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
    return false;
  }

  aplicaRestricoesBaixo(pmx, pmy) {
    const SIZE = this.cena.mapa.SIZE;
    if (this.vy > 0) {
      if (
        this.cena.mapa.tiles[pmy] == undefined ||
        this.cena.mapa.tiles[pmy][pmx] == undefined
      ) {
        return true;
      }
      if (this.cena.mapa.tiles[pmy][pmx] != 0) {
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
    return false;
  }

  aplicaRestricoesCima(pmx, pmy) {
    const SIZE = this.cena.mapa.SIZE;
    if (this.vy < 0) {
      if (
        this.cena.mapa.tiles[pmy] == undefined ||
        this.cena.mapa.tiles[pmy][pmx] == undefined
      ) {
        return true;
      }
      if (this.cena.mapa.tiles[pmy][pmx] != 0) {
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
    return false;
  }
}
