'use script'

var gBoard = [];
var BOMB = '💣';;
var FLAG = '🏴';
var GAMER = '😃'
var gLevel = {
    SIZE: 4,
    MINES: 2
};

var gGame = {
    isOn: false,
    showCount: 0,
    secsPassed: 0,
    isGameOver: false
};

function initGame() {

    buildBoard();
    renderBoard();
}

function buildBoard() {
    var sumMineCreated = 0;
    for (var i = 0; i < gLevel.SIZE; i++) {
        gBoard[i] = [];
        for (var j = 0; j < gLevel.SIZE; j++) {

            gBoard[i][j] = createCell();
        }
    }

    console.table(gBoard);
}

function setMinesNegCount(posI, posJ) {
    var countNeg = 0;

    for (var i = posI - 1; i <= posI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (var j = posJ - 1; j <= posJ + 1; j++) {
            if (j < 0 || j >= gBoard.length) continue;
            if (i === posI && j === posJ) continue

            if (gBoard[i][j].isMine) {

                countNeg++;
                gBoard[posI][posJ].minesAroundCount = countNeg;
            }
        }
    }




}

function renderBoard(board) {

    var elTbody = document.querySelector('.minesweeper-border');

    var strHTML = ` `;
    var valueCell = '';
    var strFunction = '"cellClicked(this,${i},${j})"';
    for (var i = 0; i < gLevel.SIZE; i++) {
        strHTML += `<tr>\n`;
        for (var j = 0; j < gLevel.SIZE; j++) {

            var tdClass = '';
            tdClass = (gBoard[i][j].isSelected) ? 'selected' : '';
            if (gBoard[i][j].isMine && gBoard[i][j].isSelected) {
                valueCell = BOMB;

            }
            else if (gBoard[i][j].minesAroundCount > 0) {

                valueCell = gBoard[i][j].minesAroundCount;
            }

            if (gGame.isGameOver && gBoard[i][j].isMine) {
                valueCell = BOMB;
                tdClass = '';
            }
            strHTML += `<td cell=cellId-${i}-${j} class ="${tdClass}" onclick=cellClicked(this,${i},${j}) > ${valueCell}</td>`;
            valueCell = '';
            // console.log(strHTML);
        }
        strHTML += '</tr>\n';
    }

    elTbody.innerHTML = strHTML;
}

function cellClicked(elCell, i, j) {
    gBoard[i][j].isSelected = true;
    console.log(elCell);
    if (gGame.isGameOver) {
        

        return;
    }

    if (!gGame.isOn) {
        // Start Game
        getMine();
        gGame.isOn = true;
        gGame.isGameOver = false;
        console.table(gBoard);

    }
    if (gBoard[i][j].isMine) {
        // Game Over
        gGame.isOn = false
        gGame.isGameOver = true;
        renderBoard();
        var elSmile = document.querySelector('.smile');

        console.log(elSmile);
        
        elSmile.innerHTML = '😭';
        return;
        // console.log("BBBBOOOOOOMMM");

    }
    if (!gBoard[i][j].isMine) {

        setMinesNegCount(i, j);
        renderBoard();
    }



}

function cellMarked() {
    document.oncontextmenu = new Function("return false;");
}

function checkGameOver() {

}

function expandShown(board, elCell, i, j) {

}

function getMine() {
    var indexI = getRandomInteger(0, gLevel.SIZE - 1);
    var indexJ = getRandomInteger(0, gLevel.SIZE - 1);
    var countMine = 0;

    while (!gBoard[indexI][indexJ].isMine && countMine < gLevel.MINES) {

        if (!gBoard[indexI][indexJ].isSelected) {
            gBoard[indexI][indexJ].isMine = true;
            countMine++;
        }
        indexI = getRandomInteger(0, gLevel.SIZE - 1);
        indexJ = getRandomInteger(0, gLevel.SIZE - 1);

    }
    // board[indexI][indexJ] = gMine;

}

function createCell() {
    var cell = {
        minesAroundCount: 0,
        isSelected: false,
        isMine: false,
        isMarked: false
    };
    return cell;

}
function restart() {
    gBoard = [];
    gGame.isOn = false;
    gGame.showCount = 0;
    gGame.secsPassed = 0;
    gGame.isGameOver = false;
    var elSmail = document.querySelector('.smile');
    elSmail.innerHTML = '😃';
    initGame();

}
function simple() {
    gLevel.SIZE = 4;
    gLevel.MINES = 2;
    restart();
}
function hard() {
    gLevel.SIZE = 8;
    gLevel.MINES = 12;
    restart();
}
function hardest() {
    gLevel.SIZE = 12;
    gLevel.MINES = 30;
    restart();
}
function getRandomInteger(min, max) {
    return Math.floor(Math.random(min) * (max - min) + min);
}
