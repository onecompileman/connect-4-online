import { Injectable } from '@angular/core';
import { cloneDeep } from 'lodash';

import { RandomGenerate } from '../utils/random-generate.util';

@Injectable({
  providedIn: 'root'
})
export class AIService {
  selectBestMove(gameBoard: Array<Array<any>>): number {
    const winningMove = this.selectWinningMove(gameBoard);

    if (winningMove != null) return winningMove;

    const losingMove = this.selectLosingMove(gameBoard);

    if (losingMove != null) return losingMove;

    return this.selectOptimalMove(gameBoard);
  }

  private selectWinningMove(gameBoard: Array<Array<any>>): number {
    return this.findMove('aiChip', 4, gameBoard);
  }

  private selectLosingMove(gameBoard: Array<Array<any>>): number {
    return this.findMove('playerChip', 4, gameBoard);
  }

  private selectOptimalMove(gameBoard: Array<Array<any>>): any {
    const playerMove3 = this.findMove('playerChip', 3, gameBoard);

    if (playerMove3 != null) return playerMove3;

    const aiMove3 = this.findMove('aiChip', 3, gameBoard);

    if (aiMove3 != null) return aiMove3;

    const playerMove2 = this.findMove('playerChip', 2, gameBoard);

    if (playerMove2 != null) return playerMove2;

    const aiMove2 = this.findMove('aiChip', 2, gameBoard);

    if (aiMove2 != null) return aiMove2;

    const availableColumns = Array(7)
      .fill('')
      .map((e, i) => i)
      .filter(i => gameBoard[0][i] === '');

    const column =
      availableColumns[
        RandomGenerate.getRandomInt(0, availableColumns.length - 1)
      ];

    return availableColumns.length ? column : null;
  }

  private findMove(
    chip: string,
    columnCount: number,
    gameBoard: Array<Array<any>>
  ): number {
    // Scan horizontal
    for (let r = 0; r < gameBoard.length; r++) {
      const row = gameBoard[r];

      for (let c = 0; c <= row.length - columnCount; c++) {
        const row4 = row.slice(c, c + columnCount);

        const aiChipsCount = row4.filter(r4 => {
          if (r4 instanceof Object) {
            return r4.id === chip;
          }
          return false;
        }).length;

        if (aiChipsCount === columnCount - 1) {
          const selectedCol = row4.findIndex(r4 => r4 === '');

          if (selectedCol !== -1) {
            if (r < 5) {
              if (gameBoard[r + 1][selectedCol + c] !== '') {
                console.log(columnCount + 'horizontal');
                return selectedCol + c;
              }
            } else {
              return selectedCol + c;
            }
          }
        }
      }
    }

    // Scan Vertical
    for (let c = 0; c < gameBoard[0].length; c++) {
      if (gameBoard[0][c] === '') {
        let chipCount = 0;
        let check = false;
        for (let r = 0; r < gameBoard.length; r++) {
          const cell = gameBoard[r][c];

          if (cell instanceof Object) {
            if (!check) {
              check = true;
            }
            if (cell.id === chip && check) {
              chipCount++;

              if (chipCount === columnCount - 1) {
                console.log(columnCount + 'vertical');
                return c;
              }
            } else {
              chipCount = 0;
              check = false;
            }
          }
        }
      }
    }

    // Scan left Diagonal
    for (let c = 0; c < columnCount; c++) {
      let ci = c;
      let r = 0;

      const diagonalRow = [];

      while (ci < 7 && r < 6) {
        const cell = gameBoard[r][ci];
        diagonalRow.push(cell);
        r++;
        ci++;
      }

      for (let i = 0; i <= diagonalRow.length - columnCount; i++) {
        const row4 = diagonalRow.slice(i, i + columnCount);

        const aiChipsCount = row4.filter(r4 => {
          if (r4 instanceof Object) {
            return r4.id === chip;
          }
          return false;
        }).length;

        if (aiChipsCount === columnCount - 1) {
          console.log(row4);
          const index = row4.findIndex(r4 => r4 === '');
          if (index !== -1) {
            const cR = i + index;
            const cC = i + index + c;

            if (cR < 5) {
              if (gameBoard[cR + 1][cC] !== '') {
                console.log(columnCount + 'diagonal left');
                return cC;
              }
            } else {
              console.log(columnCount + 'diagonal left');

              return cC;
            }
          }
        }
      }
    }

    // Scan left Diagonal
    for (let c = 0; c < 4; c++) {
      let ci = c;
      let r = 0;

      const diagonalRow = [];

      while (ci < 7 && r < 6) {
        const cell = gameBoard[r][ci];
        diagonalRow.push(cell);
        r++;
        ci++;
      }

      for (let i = 0; i <= diagonalRow.length - columnCount; i++) {
        const row4 = diagonalRow.slice(i, i + columnCount);

        const aiChipsCount = row4.filter(r4 => {
          if (r4 instanceof Object) {
            return r4.id === chip;
          }
          return false;
        }).length;

        if (aiChipsCount === columnCount - 1) {
          const index = row4.findIndex(r4 => r4 === '');
          if (index !== -1) {
            const cR = i + index;
            const cC = i + index + c;

            if (cR < 5) {
              if (gameBoard[cR + 1][cC] !== '') {
                console.log(columnCount + 'diagonal left');

                return cC;
              }
            } else {
              console.log(columnCount + 'diagonal left');

              return cC;
            }
          }
        }
      }
    }

    // Scan left Diagonal
    for (let r = 0; r < 3; r++) {
      let ri = r;
      let c = 0;

      const diagonalCol = [];

      while (ri < 6 && c < 7) {
        const cell = gameBoard[ri][c];
        diagonalCol.push(cell);
        ri++;
        c++;
      }

      for (let i = 0; i <= diagonalCol.length - columnCount; i++) {
        const row4 = diagonalCol.slice(i, i + columnCount);

        const aiChipsCount = row4.filter(r4 => {
          if (r4 instanceof Object) {
            return r4.id === chip;
          }
          return false;
        }).length;

        if (aiChipsCount === columnCount - 1) {
          const index = row4.findIndex(r4 => r4 === '');
          if (index !== -1) {
            const cR = i + index + r;
            const cC = i + index;

            if (cR < 5) {
              if (gameBoard[cR + 1][cC] !== '') {
                console.log(columnCount + 'diagonal left');
                return cC;
              }
            } else {
              console.log(columnCount + 'diagonal left');

              return cC;
            }
          }
        }
      }
    }
    // Scan right diagonal
    for (let c = 6; c <= 2; c--) {
      let ci = c;
      let r = 0;

      const diagonalRow = [];

      while (ci >= 0 && r < 6) {
        const cell = gameBoard[r][ci];
        diagonalRow.push(cell);
        r++;
        ci--;
      }

      for (let i = 0; i <= diagonalRow.length - columnCount; i++) {
        const row4 = diagonalRow.slice(i, i + columnCount);

        const aiChipsCount = row4.filter(r4 => {
          if (r4 instanceof Object) {
            return r4.id === chip;
          }
          return false;
        }).length;

        if (aiChipsCount === columnCount - 1) {
          const index = row4.findIndex(r4 => r4 === '');

          if (index !== -1) {
            const cR = i + index;
            const cC = Math.abs(i - index - c);

            if (cR < 5) {
              if (gameBoard[cR + 1][cC] !== '') {
                console.log(columnCount + 'diagonal right');

                return cC;
              }
            } else {
              console.log(columnCount + 'diagonal right');

              return cC;
            }
          }
        }
      }
    }
    // Scan right Diagonal
    for (let r = 0; r < 3; r++) {
      let ri = r;
      let c = 6;

      const diagonalCol = [];

      while (ri < 6 && c >= 0) {
        const cell = gameBoard[ri][c];
        diagonalCol.push(cell);
        ri++;
        c--;
      }

      for (let i = 0; i <= diagonalCol.length - columnCount; i++) {
        const row4 = diagonalCol.slice(i, i + columnCount);

        const aiChipsCount = row4.filter(r4 => {
          if (r4 instanceof Object) {
            return r4.id === chip;
          }
          return false;
        }).length;

        console.log(row4);

        if (aiChipsCount === columnCount - 1) {
          const index = row4.findIndex(r4 => r4 === '');
          console.log(row4);

          if (index !== -1) {
            const cR = i + index + r;
            const cC = 6 - i - index;
            console.log(cC + ' ' + cR);

            if (cR < 5) {
              if (gameBoard[cR + 1][cC] !== '') {
                console.log(columnCount + 'diagonal right');

                return cC;
              }
            } else {
              console.log(columnCount + 'diagonal right');

              return cC;
            }
          }
        }
      }
    }

    return null;
  }
}
