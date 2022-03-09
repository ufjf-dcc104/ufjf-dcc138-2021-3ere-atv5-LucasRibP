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

    canvas.addEventListener("mousemove", (e) => {
      const rect = canvas.getBoundingClientRect();
      const pos = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
      this.rodaCannon(pos.x, pos.y);
    });
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
}
