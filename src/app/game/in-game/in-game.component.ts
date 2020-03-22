import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { AIService } from 'src/app/core/services/ai.service';

@Component({
  selector: 'app-in-game',
  templateUrl: './in-game.component.html',
  styleUrls: ['./in-game.component.scss']
})
export class InGameComponent implements OnInit {
  gameColumns: Array<string>;
  gameBoard: Array<Array<any>>;
  isPlayerTurn = true;
  time: number = 0;
  timeInterval: any;

  maxChipsPerCol: number[] = [0, 1, 2, 3, 4];

  constructor(private aiService: AIService) {}

  ngOnInit() {
    this.initBoard();
    this.initColumns();
    this.timeInterval = setInterval(() => this.time++, 1000);
  }

  onResetGameClick() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You are trying to reset the game',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Reset game'
    }).then(result => {
      if (result.value) {
        this.resetGame();
      }
    });
  }

  columnSelected(element: HTMLElement, index: number, isPlayer: boolean) {
    if (this.isPlayerTurn === isPlayer) {
      const availableSlot = this.getAvailableSlot(index);

      if (availableSlot) {
        const y =
          availableSlot.element.offsetTop -
          element.offsetTop +
          element.clientHeight * 0.3;

        element.style.opacity = '1';
        element.classList.add('placed');
        element.style.transform = `translate(0px, ${y}px)`;
        this.gameBoard[availableSlot.row][availableSlot.col] = element;

        const isGameEnded = this.checkGameState();

        if (this.isPlayerTurn && !isGameEnded) {
          setTimeout(() => {
            this.aiMove();
          }, 700);
        }

        this.isPlayerTurn = false;
      }
    }
  }

  private resetGame() {
    this.isPlayerTurn = true;
    this.time = 0;

    // Placed chips back
    this.gameBoard.forEach(row => {
      row.forEach(cell => {
        if (cell instanceof Object) {
          cell.style.opacity = '0';
          cell.style.transform = '';

          cell.classList.remove('placed');
          cell.classList.remove('oc4-in-game__chip-green');
        }
      });
    });

    this.initBoard();
  }

  private checkGameState(): boolean {
    const isAiWin = this.isWin('aiChip');
    const isPlayerWin = this.isWin('playerChip');
    const isDraw = this.checkIsDraw();

    if (isAiWin) {
      setTimeout(() => {
        Swal.fire({
          icon: 'error',
          title: 'Game Over!',
          allowOutsideClick: false,
          html: `
          <h4>AI Win!!</h4>
          <p>Game Created by: <a href="https://onecompileman.com">Stephen Vinuya</a></p>
          <p>Repo: <a href="https://github.com/onecompileman/connect-4-online" target="_blank">https://github.com/onecompileman/connect-4-online</a>
        `
        }).then(() => this.resetGame());
      }, 1500);

      return true;
    }

    if (isPlayerWin) {
      setTimeout(() => {
        Swal.fire({
          icon: 'success',
          title: 'Congratulations!',
          allowOutsideClick: false,
          html: `
          <h4>You Wins!!</h4>
          <p>Game Created by: <a href="https://onecompileman.com">Stephen Vinuya</a></p>
          <p>Repo: <a href="https://github.com/onecompileman/connect-4-online" target="_blank">https://github.com/onecompileman/connect-4-online</a>
        `
        }).then(() => this.resetGame());
      }, 1500);

      return true;
    }

    if (isDraw) {
      setTimeout(() => {
        Swal.fire({
          icon: 'warning',
          title: "It's a tie!",
          allowOutsideClick: false,
          html: `
          <h4>Game Draw!</h4>
          <p>Game Created by: <a href="https://onecompileman.com">Stephen Vinuya</a></p>
          <p>Repo: <a href="https://github.com/onecompileman/connect-4-online" target="_blank">https://github.com/onecompileman/connect-4-online</a>
        `
        }).then(() => this.resetGame());
      }, 1500);

      return true;
    }

    return false;
  }

  private checkIsDraw() {
    return this.gameBoard.every(row => row.every(cell => cell !== ''));
  }

  private isWin(chip) {
    // Check horizontal win
    for (let r = 0; r < this.gameBoard.length; r++) {
      for (let c = 0; c <= 3; c++) {
        const horizontalRow = this.gameBoard[r].slice(c, c + 4);

        const isWin = horizontalRow.every(cell => {
          if (cell instanceof Object) {
            return cell.id === chip;
          }

          return false;
        });

        if (isWin) {
          horizontalRow.forEach(element => {
            element.classList.add('oc4-in-game__chip-green');
          });

          return true;
        }
      }
    }

    // Check vertical
    for (let c = 0; c < 7; c++) {
      let chipCount = 0;

      for (let r = 0; r < 6; r++) {
        const cell = this.gameBoard[r][c];

        if (cell instanceof Object) {
          if (cell.id === chip) {
            chipCount++;

            if (chipCount === 4) {
              for (let i = r; i > r - 4; i--) {
                this.gameBoard[i][c].classList.add('oc4-in-game__chip-green');
              }
              return true;
            }
          } else {
            chipCount = 0;
          }
        }
      }
    }

    // Check diagonal Win
    // Scan left Diagonal
    for (let c = 0; c < 4; c++) {
      let ci = c;
      let r = 0;

      const diagonalRow = [];

      while (ci < 7 && r < 6) {
        const cell = this.gameBoard[r][ci];
        diagonalRow.push(cell);
        r++;
        ci++;
      }

      for (let i = 0; i <= diagonalRow.length - 4; i++) {
        const row4 = diagonalRow.slice(i, i + 4);

        const aiChipsCount = row4.filter(r4 => {
          if (r4 instanceof Object) {
            return r4.id === chip;
          }
          return false;
        }).length;

        if (aiChipsCount === 4) {
          row4.forEach(element => {
            element.classList.add('oc4-in-game__chip-green');
          });

          return true;
        }
      }
    }

    // Scan left Diagonal
    for (let c = 0; c < 4; c++) {
      let ci = c;
      let r = 0;

      const diagonalRow = [];

      while (ci < 7 && r < 6) {
        const cell = this.gameBoard[r][ci];
        diagonalRow.push(cell);
        r++;
        ci++;
      }

      for (let i = 0; i <= diagonalRow.length - 4; i++) {
        const row4 = diagonalRow.slice(i, i + 4);

        const aiChipsCount = row4.filter(r4 => {
          if (r4 instanceof Object) {
            return r4.id === chip;
          }
          return false;
        }).length;

        if (aiChipsCount === 4) {
          row4.forEach(element => {
            element.classList.add('oc4-in-game__chip-green');
          });
          return true;
        }
      }
    }

    // Scan left Diagonal
    for (let r = 0; r < 3; r++) {
      let ri = r;
      let c = 0;

      const diagonalCol = [];

      while (ri < 6 && c < 7) {
        const cell = this.gameBoard[ri][c];
        diagonalCol.push(cell);
        ri++;
        c++;
      }

      for (let i = 0; i <= diagonalCol.length - 4; i++) {
        const row4 = diagonalCol.slice(i, i + 4);

        const aiChipsCount = row4.filter(r4 => {
          if (r4 instanceof Object) {
            return r4.id === chip;
          }
          return false;
        }).length;

        if (aiChipsCount === 4) {
          row4.forEach(element => {
            element.classList.add('oc4-in-game__chip-green');
          });
          return true;
        }
      }
    }
    // Scan right diagonal
    for (let c = 6; c <= 2; c--) {
      let ci = c;
      let r = 0;

      const diagonalRow = [];

      while (ci >= 0 && r < 6) {
        const cell = this.gameBoard[r][ci];
        diagonalRow.push(cell);
        r++;
        ci--;
      }

      for (let i = 0; i <= diagonalRow.length - 4; i++) {
        const row4 = diagonalRow.slice(i, i + 4);

        const aiChipsCount = row4.filter(r4 => {
          if (r4 instanceof Object) {
            return r4.id === chip;
          }
          return false;
        }).length;

        if (aiChipsCount === 4) {
          row4.forEach(element => {
            element.classList.add('oc4-in-game__chip-green');
          });
          return true;
        }
      }
    }
    // Scan right Diagonal
    for (let r = 0; r < 3; r++) {
      let ri = r;
      let c = 6;

      const diagonalCol = [];

      while (ri < 6 && c >= 0) {
        const cell = this.gameBoard[ri][c];
        diagonalCol.push(cell);
        ri++;
        c--;
      }

      for (let i = 0; i <= diagonalCol.length - 4; i++) {
        const row4 = diagonalCol.slice(i, i + 4);

        const aiChipsCount = row4.filter(r4 => {
          if (r4 instanceof Object) {
            return r4.id === chip;
          }
          return false;
        }).length;

        if (aiChipsCount === 4) {
          row4.forEach(element => {
            element.classList.add('oc4-in-game__chip-green');
          });
          return true;
        }
      }
    }
  }

  private aiMove() {
    const columnMove = this.aiService.selectBestMove(this.gameBoard);
    console.log(columnMove);
    const columnHeader = document.querySelector(`#colHeader${columnMove}`);
    const redChips = columnHeader.querySelectorAll(
      '.oc4-in-game__turn-chip-red'
    );
    let availableRedchip = null;

    for (let i = 0; i < redChips.length; i++) {
      if (!(<HTMLElement>redChips[i]).style.transform) {
        availableRedchip = redChips[i];
        break;
      }
    }
    this.columnSelected(availableRedchip, columnMove, false);

    setTimeout(() => {
      this.isPlayerTurn = true;
    }, 1000);
  }

  private getAvailableSlot(colIndex: number): any {
    for (let r = this.gameBoard.length - 1; r >= 0; r--) {
      if (this.gameBoard[r][colIndex] === '') {
        return {
          row: r,
          col: colIndex,
          element: document.querySelector('#' + CSS.escape(`${r}-${colIndex}`))
        };
      }
    }

    return null;
  }

  private initColumns() {
    this.gameColumns = Array(7).fill('');
  }

  private initBoard() {
    this.gameBoard = Array(6)
      .fill('')
      .map(() => Array(7).fill(''));
  }
}
