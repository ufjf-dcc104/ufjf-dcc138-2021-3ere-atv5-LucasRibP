export default class LevelManager {
  constructor({ geraPlayer, geraInimigo, onWinLevel, onLoseLevel, cena }) {
    this.curLevel = 0; // Level 0 é o menu
    this.totalLevels = 20; // Limite de níveis
    this.geraPlayer = geraPlayer;
    this.geraInimigo = geraInimigo;
    this.onWinLevel = onWinLevel;
    this.onLoseLevel = onLoseLevel;
    this.cena = cena;
    this.posInimigosGerados = [];
  }

  iniciaJogo() {
    this.curLevel = 1;
    this.cena.clearSprites();
    this.initializeLevel();
  }

  winLevel() {
    this.cena.parar();
    this.onWinLevel();
    console.log(this.curLevel);
    if (this.curLevel == this.totalLevels) {
      this.winGame();
    } else {
      this.curLevel += 1;
      this.initializeLevel();
    }
  }

  winGame() {
    console.log("Você venceu o jogo!");
  }

  initializeLevel() {
    this.cena.clearSprites();
    this.posInimigosGerados = [];

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
