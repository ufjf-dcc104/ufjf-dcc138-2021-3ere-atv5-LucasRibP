export default class InputManager {
  constructor() {
    this.comandos = new Map();
    this.teclas = new Map();
  }

  configurarTeclado(acoes) {
    for (const tecla in acoes) {
      const comando = acoes[tecla];
      this.comandos.set(comando, false);
      this.teclas.set(tecla, comando);
    }
    addEventListener("keydown", (e) => {
      const comando = this.teclas.get(e.key);
      if (comando) {
        this.comandos.set(comando, true);
      }
    });

    addEventListener("keyup", (e) => {
      const comando = this.teclas.get(e.key);
      if (comando) {
        this.comandos.set(comando, false);
      }
    });
  }
}
