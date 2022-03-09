import Sprite from "./Sprite.js";

export default class Cannon extends Sprite {
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
    canvas = null,
    tank = null,
    velocidadeDoTiro = 800,
    recoilDoTiro = 80,
  } = {}) {
    super({
      x,
      y,
      vx,
      vy,
      w,
      h,
      color,
      controlar,
      deathSound,
      soundPriority,
      colidivel,
      restringivel,
    });
    this.canvas = canvas;
    this.tank = tank;
    this.angle = Math.pi;
    this.velocidadeDoTiro = velocidadeDoTiro;
    this.recoilDoTiro = recoilDoTiro;

    canvas.addEventListener("mousemove", (e) => {
      const pos = this.getMousePos(e);
      this.rodaCannon(pos.x, pos.y);
    });

    canvas.addEventListener("click", (e) => {
      const pos = this.getMousePos(e);
      this.atira(pos.x, pos.y);
    });
  }

  getMousePos(e) {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }

  rodaCannon(x, y) {
    const dist = {
      x: x - this.tank.x,
      y: y - this.tank.y,
    };

    const angle = -Math.atan2(dist.x, dist.y);
    this.angle = angle;
  }

  desenhar(ctx) {
    ctx.translate(this.tank.x, this.tank.y);
    ctx.rotate(this.angle);
    ctx.fillStyle = this.color;
    ctx.fillRect(-this.w / 2, 0, this.w, this.h);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }

  atira(x, y) {
    const direcao = {
      x: x - this.tank.x,
      y: y - this.tank.y,
    };
    const norma = Math.sqrt(direcao.x ** 2 + direcao.y ** 2);
    direcao.x /= norma;
    direcao.y /= norma;

    const origemTiro = {
      x: this.tank.x + direcao.x * this.h,
      y: this.tank.y + direcao.y * this.h,
    };

    this.cena.adicionar(
      new Sprite({
        ...origemTiro,
        vx: direcao.x * this.velocidadeDoTiro,
        vy: direcao.y * this.velocidadeDoTiro,
        raio: this.w,
        ehBola: true,
        color: "yellow",
      })
    );

    // Adiciona recoil
    this.tank.vx -= direcao.x * this.recoilDoTiro;
    this.tank.vy -= direcao.y * this.recoilDoTiro;
  }
}
