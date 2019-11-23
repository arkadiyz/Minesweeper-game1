'use stric'

var gBoard = [];
var timeInerval;
var gLevel = {
    SIZE: 4,
    MINES: 2
};

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    hintCount: 0,
    countLives: 0,
    isSelectedHint: false,
    firstClick: true,
    BOMB: '💣',
    FLAG: '🏴',
    START_GAME: '😃',
    LOSER: '😭',
    WINNER: '😎',
    HEART: '❤️',
    WASTING_HEART: '💔'

}

function initGame() {

    document.oncontextmenu = new Function("return false;");
    gBoard = [];
    buildBoard();
    gGame.firstClick = true;
    gGame.isOn = true;
    gGame.shownCount = 0;
    gGame.hintCount = 0;
    clearInterval(timeInerval);
    gGame.secsPassed = 0;

    renderBoard();

}
function timer() {
    eltemer = document.querySelector('.timer');

    timeInerval = setInterval(function () {

        gGame.secsPassed++;

        if (!gGame.isOn || !timeInerval) {

            clearInterval(timeInerval);
            eltemer.innerHTML = gGame.secsPassed;
            gGame.secsPassed = 0;
            return;
        }
        else {


            eltemer.innerHTML = 'SEC  ' + gGame.secsPassed;

        }
    }, 1000);

}

function buildBoard() {
    for (var i = 0; i < gLevel.SIZE; i++) {
        gBoard[i] = [];
        for (var j = 0; j < gLevel.SIZE; j++) {
            gBoard[i][j] = createCell();

        }

    }
    console.table('create board==> ', gBoard);

}
function checkMinesNeg() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            setMinesNegsCount(i, j);

        }

    }
}
function setMinesNegsCount(posI, posJ) {
    var countNeg = 0;

    for (var i = posI - 1; i <= posI + 1; i++) {

        if (i < 0 || i >= gBoard.length) continue;

        for (var j = posJ - 1; j <= posJ + 1; j++) {

            if (j < 0 || j >= gBoard.length) continue;

            if (i === posI && j === posJ) continue

            if (gBoard[i][j].isMine && !gBoard[i][j].isMarked) {
                countNeg++;
                gBoard[posI][posJ].minesAroundCount = countNeg;
                // gBoard[posI][posJ].value = countNeg;
            }
        }
    }
}

function renderBoard() {
    var elBorder = document.querySelector('.border-game');
    var strHTML = ``;
    for (var i = 0; i < gBoard.length; i++) {
        strHTML += `<tr>\n`
        for (var j = 0; j < gBoard[i].length; j++) {

            strHTML += `\t<td class="${gBoard[i][j].class}" onmousedown= "cellClicked(event,${i},${j})">${gBoard[i][j].value}</td>\n`

        }
        strHTML += `</tr>\n`
    }


    console.log('render board ==>', gBoard);
    elBorder.innerHTML = strHTML;
    // return board;
}

function cellClicked(elCell, i, j) {

    if (!gGame.isOn) return;  //game over
    if (gGame.firstClick && elCell.button !== 2) { //first cleck 
        firstClick(i, j);

    } else if (elCell.button === 2 && !gBoard[i][j].isShown)  { //Clicking on a flag
        clickedOnFlag(i, j);

    } else if (gBoard[i][j].isMine && !gBoard[i][j].isMarked && !gGame.isSelectedHint) { //clecked to BOMB CELL
        clickedOnMine(i, j);

    } else if (gGame.isSelectedHint) {
        showHint(i, j);

    } else if (!gBoard[i][j].isMine && !gBoard[i][j].isMarked && !gBoard[i][j].isShown) { //if the cell is empty
        expandShown(i, j);
    }
    console.log('counter', gGame.shownCount);

    statusGame()
    renderBoard();

}
function firstClick(i, j) {
    timer();
    gGame.firstClick = false;
    gBoard[i][j].isShown = true;
    gBoard[i][j].class = 'selected';
    gBoard[i][j].value = '';
    setMines();
    checkMinesNeg();
    expandShown(i, j);
}
function clickedOnFlag(i, j) {
    if (gGame.firstClick) {
        gGame.firstClick = false;
        gBoard.shownCount
        timer();
        setMines();


        // expandShown(i, j);
    }

    console.table('create board==> ', gBoard);

    cellMarked(i, j);
    // renderBoard(gBoard);
    // return
}
function clickedOnMine(i, j) {
    if (gGame.countLives >= 3) {
        gGame.isOn = false;
        lose();
        gameOver('Lost');
        gBoard[i][j].value = gGame.BOMB;

    } else {
        getLives();
        gBoard[i][j].value = gGame.BOMB;
        gBoard[i][j].class = 'selected';
        renderBoard();
        setTimeout(function() {
            
            gBoard[i][j].value = '';
            gBoard[i][j].class = 'cell-start';
            renderBoard();
        },900)
     // gGame.markedCount++;
        // gGame.shownCount++;

    }

    // gBoard[i][j].value = gGame.BOMB;
}
function statusGame() {

    if (isGameOver()) {
        if (!ifWenn()) {
            gameOver('Lost');
        }
        else {
            gameOver();
        }
    }
}
function showHint(i, j) {
    if (gGame.hintCount <= 3) {
        showNegs(true, i, j);
        renderBoard();
        setTimeout(function () {
            showNegs(false, i, j);
            gBoard[i][j].isHint = false;
            gGame.isSelectedHint = false;
            renderBoard();
        }, 2000);
    }
}
function cellMarked(i, j) {
    if (gBoard[i][j].isMarked && gBoard[i][j].class === 'flag') {
        gBoard[i][j].isMarked = false;
        gBoard[i][j].value = '';
        gBoard[i][j].class = 'cell-start';
        gGame.markedCount--;
        gGame.shownCount--;
    } else {
        gBoard[i][j].isMarked = true;
        gBoard[i][j].value = gGame.FLAG;
        gGame.markedCount++;
        gGame.shownCount++;
        gBoard[i][j].class = 'flag';
    }
}

function checkGameOver() {

}

function expandShown(posI, posJ) {
    if (gBoard[posI][posJ].minesAroundCount > 0 && !gBoard[posI][posJ].isMarked) {
        gBoard[posI][posJ].isShown = true;
        gBoard[posI][posJ].value = gBoard[posI][posJ].minesAroundCount;
        gBoard[posI][posJ].class = 'selected';

        gGame.shownCount++;

        return;
    }
    for (var i = posI - 1; i <= posI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (var j = posJ - 1; j <= posJ + 1; j++) {
            if (j < 0 || j >= gBoard.length) continue;
            // if (i === posI && j === posJ) continue

            if (!gBoard[i][j].isMine && !gBoard[i][j].isShown && !gBoard[i][j].isMarked) {
                gBoard[i][j].isShown = true;
                gBoard[i][j].value = gBoard[i][j].minesAroundCount;
                gBoard[i][j].value = (gBoard[i][j].minesAroundCount > 0) ? gBoard[i][j].minesAroundCount : '';
                gBoard[i][j].class = 'selected';

                gGame.shownCount++;
            }

        }
    }
}
function ifWenn() {
    var countFlagsOnMines = 0
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            if (gBoard[i][j].isMine && gBoard[i][j].isMarked) {
                countFlagsOnMines++;
            }

        }

    }
    if (countFlagsOnMines === gLevel.MINES ) {
        gGame.isOn = false;
        return true;

    } else return false;
}


function lose() {   //set all bombs on table befor render 

    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            if (gBoard[i][j].isMine) {    // if have Mine in the location then set valeu 
                gBoard[i][j].isShown = true;
                gBoard[i][j].class = 'selected';
                gBoard[i][j].value = gGame.BOMB;
            }
        }

    }
}
function setMines() {
    var indexI = getRandomInteger(0, gLevel.SIZE - 1);
    var indexJ = getRandomInteger(0, gLevel.SIZE - 1);
    var countMine = 0;

    while (countMine < gLevel.MINES) {

        if (!gBoard[indexI][indexJ].isShown && !gBoard[indexI][indexJ].isMine) {

            gBoard[indexI][indexJ].isMine = true;
            // gBoard[indexI][indexJ].value = gGame.BOMB;
            countMine++;

        }
        indexI = getRandomInteger(0, gLevel.SIZE - 1);
        indexJ = getRandomInteger(0, gLevel.SIZE - 1);

    }
    // setMinesNegsCount(i, j);
}
function safeClick() {
    var indexI = getRandomInteger(0, gLevel.SIZE);
    var indexJ = getRandomInteger(0, gLevel.SIZE);
    while (gBoard[indexI][indexJ].isShown) {
        indexI = getRandomInteger(0, gLevel.SIZE);
        indexJ = getRandomInteger(0, gLevel.SIZE);
    }

    gBoard[indexI][indexJ].class = 'hint-cell';
    gBoard[indexI][indexJ].isHint = true;
    renderBoard();
}
function getHint() {

    var elButton;
    var strForId = 'my-btn';

    gGame.hintCount++;
    strForId += gGame.hintCount;
    elButton = document.getElementById(strForId);
    elButton.disabled = true;
    gGame.isSelectedHint = true;

}
function restart() {
    var elSmile = document.querySelector('.smile');
    var elTimer = document.querySelector('.timer');

    gGame.countLives = 0;
    document.getElementById('hert-btn1').innerHTML = gGame.HEART;
    document.getElementById('hert-btn2').innerHTML = gGame.HEART;
    document.getElementById('hert-btn3').innerHTML = gGame.HEART;

    document.getElementById('my-btn1').disabled = false;
    document.getElementById('my-btn2').disabled = false;
    document.getElementById('my-btn3').disabled = false;
    gGame.isSelectedHint = false;
    elSmile.innerHTML = gGame.START_GAME;
    elTimer.innerHTML = 'SEC 0'
    gGame.countLives = 0;
    initGame();

}
function gameOver(status) {
    elSmile = document.querySelector('.smile');
    if (status === 'Lost') {
        elSmile.innerHTML = gGame.LOSER;

    } else {
        elSmile.innerHTML = gGame.WINNER;
    }
}

function showNegs(isSelectedHint, posI, posJ) {

    for (var i = posI - 1; i <= posI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (var j = posJ - 1; j <= posJ + 1; j++) {
            if (j < 0 || j >= gBoard.length) continue;
            // if (i === posI && j === posJ) continue
            if (isSelectedHint) {
                // gBoard[i][j].isShown = true;
                gBoard[i][j].class = 'selected';
                if (gBoard[i][j].minesAroundCount >= 0 && !gBoard[i][j].isMine && !gBoard[i][j].isMarked) {
                    gBoard[i][j].value = gBoard[i][j].minesAroundCount;
                } else if (gBoard[i][j].isMine) {
                    gBoard[i][j].value = gGame.BOMB;
                }
            } else {
                if (!gBoard[i][j].isShown) {
                    // gBoard[i][j].isShown = false;
                    gBoard[i][j].class = 'cell-start';
                    gBoard[i][j].value = '';
                }

            }
        }

    }
}

function chengeBoard(borderSize, sunMines) {

    gLevel = {
        SIZE: borderSize,
        MINES: sunMines
    };
    gGame.isOn = false;

    // restart game
    restart();
    initGame();
    // renderBoard(gBoard);
}

function createCell() {
    var cell = {
        minesAroundCount: 0,
        isShown: false,
        isMine: false,
        isMarked: false,
        value: '',
        class: 'cell-start',
        isHint: false
        // funcCleck:''
    }
    return cell;
}

function getLives() {
    var strCountId = 'hert-btn';
    var elLivesBtn;
    gGame.countLives++
    strCountId += gGame.countLives;
    elLivesBtn = document.getElementById(strCountId);
    elLivesBtn.innerHTML = gGame.WASTING_HEART;
}
function getRandomInteger(min, max) {
    return Math.floor(Math.random(min) * (max - min) + min);
}

function isGameOver() {
    if (gGame.shownCount === ((gLevel.SIZE ** 2))) return true;
    return false;
}