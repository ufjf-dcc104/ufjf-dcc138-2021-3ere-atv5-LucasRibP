export default class LevelManager {
  constructor(geraPlayer, geraInimigo, onWinLevel, onLoseLevel, cena) {
    this.curLevel = 0; // Level 0 é o menu
    this.geraPlayer = geraPlayer;
    this.geraInimigo = geraInimigo;
    this.onWinLevel = onWinLevel;
    this.onLoseLevel = onLoseLevel;
    this.cena = cena;
  }

  winLevel() {
    this.cena.parar();
    this.onWinLevel();
    this.curLevel += 1;
    this.initializeLevel();
  }

  initializeLevel() {
    cena.clearSprites();

    if (this.curLevel == 0) {
    } else {
      this.geraPlayer(cena);
      for (let i = 0; i < this.curLevel + 2; i++) {
        this.geraInimigo(cena);
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
