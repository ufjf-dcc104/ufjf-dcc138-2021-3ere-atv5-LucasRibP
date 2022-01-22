export default class Mapa {
  constructor(linhas = 8, colunas = 12, tamanho = 32) {
    this.LINHAS = linhas;
    this.COLUNAS = colunas;
    this.SIZE = tamanho;
    this.tiles = [];
    for (let l = 0; l < this.LINHAS; l++) {
      this.tiles[l] = [];
      for (let c = 0; c < this.COLUNAS; c++) {
        this.tiles[l][c] = 0;
      }
    }
  }

  desenhar(ctx) {
    for (let l = 0; l < this.LINHAS; l++) {
      for (let c = 0; c < this.COLUNAS; c++) {
        switch (this.tiles[l][c]) {
          case 1:
            ctx.fillStyle = "grey";
            ctx.lineWidth = 1;
            ctx.strokeStyle = "black";
            break;
          case 2:
            ctx.fillStyle = "orange";
            ctx.lineWidth = 1;
            ctx.strokeStyle = "red";
            break;
          default:
            ctx.fillStyle = "black";
            ctx.lineWidth = 1;
            ctx.strokeStyle = "grey";
        }
        ctx.fillRect(c * this.SIZE, l * this.SIZE, this.SIZE, this.SIZE);
        ctx.strokeRect(c * this.SIZE, l * this.SIZE, this.SIZE, this.SIZE);
      }
    }
  }

  carregaMapa(modelo) {
    this.tiles = [];
    this.LINHAS = modelo.length;
    this.COLUNAS = modelo[0]?.length ?? 0;
    for (let l = 0; l < this.LINHAS; l++) {
      this.tiles[l] = [];
      for (let c = 0; c < this.COLUNAS; c++) {
        this.tiles[l][c] = modelo[l][c];
      }
    }
  }

  obterPosicaoNoCanvas(linha, coluna) {
    return { x: (coluna + 0.5) * this.SIZE, y: (linha + 0.5) * this.SIZE };
  }

  geraPosicaoValidaAleatoria(invalidList = [1]) {
    if (this.tiles.length == 0) return;

    let randLine = Math.floor(Math.random() * this.LINHAS);
    let randCol = Math.floor(Math.random() * this.LINHAS);

    while (invalidList.includes(this.tiles[randLine][randCol])) {
      randLine = Math.floor(Math.random() * this.LINHAS);
      randCol = Math.floor(Math.random() * this.LINHAS);
    }

    return {
      ...this.obterPosicaoNoCanvas(randLine, randCol),
      line: randLine,
      col: randCol,
    };
  }
}
