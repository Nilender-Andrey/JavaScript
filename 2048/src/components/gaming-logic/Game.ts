import State from '../../state/State';
import { RenderResultType } from '../../types/type';
import OptionsGame from '../options/options-game';
import MovePossibilityCheck from './Move-possibility-check';
import Utils from './Utils';

class Game {
  private result: number;
  private scoreForWin: number;
  private moves: number;
  private field: number[][];
  private elemShowingScore: HTMLElement;
  private elemShowingMoves: HTMLElement;
  private gameBody: HTMLElement;
  private baseFontSize: number;
  private isAllowedToLeft: boolean;
  private isAllowedToRight: boolean;
  private isAllowedToUp: boolean;
  private isAllowedToDown: boolean;
  private isWin: boolean;
  private renderResult: RenderResultType;

  constructor(
    scoreElem: HTMLElement,
    movesElem: HTMLElement,
    gameBody: HTMLElement,
    renderResult: RenderResultType,
  ) {
    State.gameMoves = [];
    this.result = 0;
    this.scoreForWin = OptionsGame.isEndless ? Infinity : 8 /* 2048 */;
    this.moves = 0;
    this.field = [
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
    ];

    this.elemShowingScore = scoreElem;
    this.elemShowingScore.textContent = '0';
    this.elemShowingMoves = movesElem;
    this.elemShowingMoves.textContent = '0';
    this.gameBody = gameBody;
    this.renderResult = renderResult;
    this.baseFontSize = parseInt(
      getComputedStyle(document.documentElement).getPropertyValue(
        '--font-size-cell',
      ),
    );

    this.isAllowedToLeft = true;
    this.isAllowedToRight = true;
    this.isAllowedToUp = true;
    this.isAllowedToDown = true;
    this.isWin = false;

    this.getCells();
  }

  step = (direction: 'moveLeft' | 'moveRight' | 'moveUp' | 'moveDown') => {
    if (!State.isGameStop) this[direction]();
  };

  private end = () => {
    this.getCells();
    Utils.playSound('step');
  };

  private moveLeft() {
    if (!this.isAllowedToLeft || this.isWin) return;
    this.saveStep();
    this.updateMoves();

    for (let j = 0; j <= 4; j++) {
      let l = 0;
      for (let i = 0; i <= 4; i++) {
        if (this.field[j][i]) {
          for (let k = i; k > l; k--) {
            if (
              this.field[j][k] != this.field[j][k - 1] &&
              this.field[j][k - 1] != 0
            ) {
              l++;
            } else {
              if (this.field[j][k] === this.field[j][k - 1]) {
                this.field[j][k - 1] = this.field[j][k] + this.field[j][k - 1];
                this.field[j][k] = 0;
                l++;
                this.removeElem(j, k - 1);
                this.updateScore(this.field[j][k - 1]);
                this.changeElem(j, k, this.field[j][k - 1], j, k - 1);
              } else if (this.field[j][k - 1] === 0) {
                this.field[j][k - 1] = this.field[j][k];
                this.field[j][k] = 0;
                this.changeElem(j, k, this.field[j][k - 1], j, k - 1);
              }
            }
          }
        }
      }
    }

    this.end();
  }

  private moveRight() {
    if (!this.isAllowedToRight || this.isWin) return;
    this.saveStep();
    this.updateMoves();

    for (let j = 0; j <= 4; j++) {
      let l = 3;
      for (let i = 4; i >= 0; i--) {
        if (this.field[j][i]) {
          for (let k = i; k <= l; k++) {
            if (
              this.field[j][k] !== this.field[j][k + 1] &&
              this.field[j][k + 1] !== 0
            ) {
              l--;
            } else {
              if (this.field[j][k] === this.field[j][k + 1]) {
                this.field[j][k + 1] = this.field[j][k] + this.field[j][k + 1];
                this.field[j][k] = 0;
                l--;
                this.removeElem(j, k + 1);
                this.updateScore(this.field[j][k + 1]);
                this.changeElem(j, k, this.field[j][k + 1], j, k + 1);
              } else if (this.field[j][k + 1] === 0) {
                this.field[j][k + 1] = this.field[j][k];
                this.field[j][k] = 0;
                this.changeElem(j, k, this.field[j][k + 1], j, k + 1);
              }
            }
          }
        }
      }
    }

    this.end();
  }

  private moveUp() {
    if (!this.isAllowedToUp || this.isWin) return;
    this.saveStep();
    this.updateMoves();

    for (let i = 0; i <= 4; i++) {
      let l = 0;
      for (let j = 0; j <= 4; j++) {
        if (this.field[j][i]) {
          for (let k = j; k > l; k--) {
            if (
              this.field[k][i] != this.field[k - 1][i] &&
              this.field[k - 1][i] != 0
            ) {
              l++;
            } else {
              if (this.field[k][i] === this.field[k - 1][i]) {
                this.field[k - 1][i] = this.field[k][i] + this.field[k - 1][i];
                this.field[k][i] = 0;
                l++;
                this.removeElem(k - 1, i);
                this.updateScore(this.field[k - 1][i]);
                this.changeElem(k, i, this.field[k - 1][i], k - 1, i);
              } else if (this.field[k - 1][i] === 0) {
                this.field[k - 1][i] = this.field[k][i];
                this.field[k][i] = 0;
                this.changeElem(k, i, this.field[k - 1][i], k - 1, i);
              }
            }
          }
        }
      }
    }

    this.end();
  }

  private moveDown() {
    if (!this.isAllowedToDown || this.isWin) return;
    this.saveStep();
    this.updateMoves();

    for (let i = 0; i <= 4; i++) {
      let l = 4;
      for (let j = 4; j >= 0; j--) {
        if (this.field[j][i]) {
          for (let k = j; k < l; k++) {
            if (
              this.field[k][i] != this.field[k + 1][i] &&
              this.field[k + 1][i] != 0
            ) {
              l--;
            } else {
              if (this.field[k][i] === this.field[k + 1][i]) {
                this.field[k + 1][i] = this.field[k][i] + this.field[k + 1][i];
                this.field[k][i] = 0;
                l--;
                this.removeElem(k + 1, i);
                this.updateScore(this.field[k + 1][i]);
                this.changeElem(k, i, this.field[k + 1][i], k + 1, i);
              } else if (this.field[k + 1][i] === 0) {
                this.field[k + 1][i] = this.field[k][i];
                this.field[k][i] = 0;
                this.changeElem(k, i, this.field[k + 1][i], k + 1, i);
              }
            }
          }
        }
      }
    }
    this.end();
  }

  private changeElem = (
    oldY: number,
    oldX: number,
    sum: number,
    newY: number,
    newX: number,
  ) => {
    const elem = document.querySelector<HTMLElement>(
      `.game-cell[data-coordinates="${oldY},${oldX}"]`,
    );

    if (elem) {
      const fontSize = Utils.calculateFontSize(this.baseFontSize, sum);

      elem.style.cssText = `top: ${newY * 20}%; 
      left: ${newX * 20}%; 
      font-size: ${fontSize}px`;

      elem.dataset.coordinates = `${newY},${newX}`;
      elem.textContent = '' + sum;
      elem.className = `game-cell game-cell_color-color_${sum}`;

      this.checkToWin(sum);
    }
  };

  private removeElem = (y: number, x: number) => {
    const elemDel = document.querySelector<HTMLElement>(
      `.game-cell[data-coordinates="${y},${x}"]`,
    );
    if (elemDel) {
      elemDel.remove();
    }
  };

  private updateScore = (num: number) => {
    this.result += num;
    this.elemShowingScore.textContent = this.result.toString();
  };

  private updateMoves = () => {
    this.moves++;
    this.elemShowingMoves.textContent = this.moves.toString();
  };

  private createRandomCell = (value: number, x: number, y: number) => {
    const cell = document.createElement('div');
    cell.classList.add(
      'game-cell',
      `game-cell_color-color_${value}`,
      'game-cell_animate-add',
    );

    cell.textContent = value.toString();
    cell.dataset.coordinates = `${y},${x}`;

    cell.style.cssText = `left: ${x * 20}%; top: ${y * 20}%;`;

    this.field[y][x] = value;

    this.gameBody.append(cell);
  };

  private checkToLose = () => {
    [
      this.isAllowedToLeft,
      this.isAllowedToRight,
      this.isAllowedToUp,
      this.isAllowedToDown,
    ] = MovePossibilityCheck.checkAll(this.field);

    if (
      !this.isAllowedToLeft &&
      !this.isAllowedToRight &&
      !this.isAllowedToUp &&
      !this.isAllowedToDown
    ) {
      Utils.playSound('lose');
      this.renderResult({
        isWin: false,
        score: this.result,
        steps: this.moves,
      });
    }
  };

  private checkToWin = (num: number) => {
    if (num >= this.scoreForWin) {
      Utils.playSound('win');
      this.isWin = true;
      this.renderResult({ isWin: true, score: this.result, steps: this.moves });
    }
  };

  private getCells = () => {
    new Array(OptionsGame.difficulty).fill(this.tact).forEach((item) => {
      item();
    });
  };

  private tact = () => {
    const indexWithZero = Utils.identifyBlankCells(this.field);

    if (indexWithZero.length) {
      const { randomValue, x, y } = Utils.dataForRandomCell(indexWithZero);

      this.createRandomCell(randomValue, x, y);
    }

    this.checkToLose();
  };

  private saveStep = () => {
    const field = JSON.parse(JSON.stringify(this.field));

    State.gameMoves.push({
      result: this.result,
      moves: this.moves,
      field,
    });
  };

  stepBack = () => {
    if (State.gameMoves.length) {
      const step = State.gameMoves.pop();
      if (step) {
        Utils.removeAllElements(this.gameBody, 'game-cell');
        this.result = step.result;
        this.moves = step.moves;
        this.field = step.field;
        this.elemShowingScore.textContent = this.result.toString();
        this.elemShowingMoves.textContent = this.moves.toString();

        for (let y = 0; y <= 4; y++) {
          for (let x = 0; x <= 4; x++) {
            if (this.field[y][x]) {
              this.createRandomCell(this.field[y][x], x, y);
            }
          }
        }
      }
    }
  };
}

export default Game;
