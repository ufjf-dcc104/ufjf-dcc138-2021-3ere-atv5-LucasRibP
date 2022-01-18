export default class AssetManager {
  constructor() {
    this.aCarregar = 0;
    this.carregadas = 0;
    this.imagens = new Map();
  }

  carregaImagem(chave, source) {
    const img1 = new Image();
    img1.src = source;
    this.imagens.set(chage, img1);
  }

  img(chave) {
    return this.imagens.get(chave);
  }

  progresso() {
    if (this.aCarregar > 0) {
      return `${((this.carregadas * 100) / this.aCarregar).toFixed(2)}%`;
    }
    return "Nada a carregar";
  }
}