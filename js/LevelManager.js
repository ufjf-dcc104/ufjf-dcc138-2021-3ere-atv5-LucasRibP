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
    this.player = null;
    this.homeElement = document.querySelector(".Home_menu");
    this.canvas = document.querySelector("canvas");
    this.isPopUpOn = false;
    this.popUpWrapperElement = document.querySelector(".Pop_up_wrapper");
    this.popUpTitleElement = document.querySelector(".Pop_up_title");
    this.popUpTextElement = document.querySelector(".Pop_up_text");
  }

  userConfirmation() {
    if (this.curLevel == -1) {
      this.curLevel = 0;
      this.isPopUpOn = false;
      this.popUpWrapperElement.style.display = "none";
      this.initializeLevel();
    } else if (this.curLevel == 0) {
      this.iniciaJogo();
    } else if (this.isPopUpOn) {
      this.isPopUpOn = false;
      this.popUpWrapperElement.style.display = "none";
      this.initializeLevel();
    }
  }

  raisePopUp(title, text) {
    this.popUpTitleElement.textContent = title;
    this.popUpTextElement.textContent = text;
    this.isPopUpOn = true;
    this.popUpWrapperElement.style.display = "flex";
  }

  iniciaJogo() {
    this.curLevel = 1;
    this.cena.clearSprites();
    this.initializeLevel();
  }

  getPlayer() {
    return this.player;
  }

  getShotSpeed() {
    return 100 + 50 * (this.curLevel / this.totalLevels);
  }

  getCena() {
    return this.cena;
  }

  winLevel() {
    this.cena.parar();
    this.cena.clearSprites();
    this.onWinLevel();
    if (this.curLevel == this.totalLevels) {
      this.winGame();
    } else {
      this.curLevel += 1;
      this.raisePopUp(
        "Nível Vencido!",
        `Pressione Enter para ir para o nível ${this.curLevel}`
      );
    }
  }

  winGame() {
    console.log("Você venceu o jogo!");
  }

  initializeLevel() {
    this.cena.clearSprites();
    this.posInimigosGerados = [];

    if (this.curLevel == 0) {
      this.homeElement.style.display = "flex";
    } else {
      this.homeElement.style.display = "none";
      this.geraPlayer(this.cena);
      for (let i = 0; i < this.curLevel + 2; i++) {
        this.geraInimigo(this.cena);
      }
      this.cena.iniciar();
    }
  }

  loseLevel() {
    this.cena.parar();
    this.cena.clearSprites();
    this.onLoseLevel();
    const loseLevel = this.curLevel;
    this.curLevel = -1;
    this.raisePopUp(
      "Game Over",
      `Você sobreviveu até o nível ${loseLevel}! Pressione Enter para voltar para o menu`
    );
  }
}
