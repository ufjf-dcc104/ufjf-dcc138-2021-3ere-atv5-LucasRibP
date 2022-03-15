export default class LevelManager {
  constructor({ geraPlayer, geraInimigo, onWinLevel, onLoseLevel, cena }) {
    this.curLevel = 0; // Level 0 é o menu
    this.geraPlayer = geraPlayer;
    this.geraInimigo = geraInimigo;
    this.onWinLevel = onWinLevel;
    this.onLoseLevel = onLoseLevel;
    this.cena = cena;
  }

  iniciaJogo() {
    this.curLevel = 1;
    this.cena.clearSprites();
    this.initializeLevel();
  }

  winLevel() {
    this.cena.parar();
    this.onWinLevel();
    this.curLevel += 1;
    this.initializeLevel();
  }

  initializeLevel() {
    this.cena.clearSprites();

    if (this.curLevel == 0) {
    } else {
      this.geraPlayer(this.cena);
      for (let i = 0; i < this.curLevel + 2; i++) {
        this.geraInimigo(this.cena);
      }
      this.cena.iniciar();
    }
  }

  loseLevel() {
    this.cena.parar();
    this.onLoseLevel();
    this.curLevel = 0;
    this.initializeLevel();
  }
}
