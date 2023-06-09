import { Grid } from "./grid.js";
import { Tile } from "./tile.js";

const gameBord = document.getElementById('gameBord');
const grid = new Grid(gameBord);
let gridFit = 0;
if (!localStorage.getItem('2048Record')) {
    localStorage.setItem('2048Record', 0)
    newRecord('0');
}
else {
    newRecord(localStorage.getItem('2048Record'))
}
grid.getRandEmptyCell().linkTile(new Tile(gameBord));
grid.getRandEmptyCell().linkTile(new Tile(gameBord));

setupInputOnce();

function setupInputOnce() {
    window.addEventListener('keydown', handleInput, { once: true });
}

document.addEventListener('touchstart', handleTouchStart, false);
document.addEventListener('touchmove', handleTouchMove, false);

let x1 = null;
let y1 = null;
function handleTouchStart(e) {
    const firstTouch = e.touches[0];
    x1 = firstTouch.clientX;
    y1 = firstTouch.clientY;

}
async function handleTouchMove(e) {
    if (!x1 || !y1) {
        return false;
    }
    let x2 = e.touches[0].clientX;
    let y2 = e.touches[0].clientY;

    let curX = x2 - x1;
    let curY = y2 - y1;
    if (!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight()) {
        await newTile.waitForAnimationEnd();
        alert('Game over');
        window.location.reload()
    }
    if (Math.abs(curX) > Math.abs(curY)) {
        if (curX > 0) {
            if (!canMoveRight()) {
                setupInputOnce();
                return;
            }
            moveRight();
        }
        else {
            if (!canMoveLeft()) {
                setupInputOnce();
                return;
            }
            moveLeft();
        }
    } else {
        if (curY > 0) {
            if (!canMoveDown()) {
                setupInputOnce();
                return;
            }
            moveDown();
        }
        else {
            if (!canMoveUp()) {
                setupInputOnce();
                return;
            }
            moveUp()
        }
    }
    x1 = null;
    y1 = null;
    const newTile = new Tile(gameBord);
    grid.getRandEmptyCell().linkTile(newTile);
    if (!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight()) {
        await newTile.waitForAnimationEnd();
        getHighestScore();
        alert('Game over');
        window.location.reload()
    }
}
async function handleInput(e) {

    getHighestScore();
    switch (e.key) {
        case 'ArrowUp':
            if (!canMoveUp()) {
                setupInputOnce();
                return;
            }
            moveUp()
            break;
        case 'ArrowRight':
            if (!canMoveRight()) {
                setupInputOnce();
                return;
            }
            moveRight();
            break;
        case 'ArrowDown':
            if (!canMoveDown()) {
                setupInputOnce();
                return;
            }
            moveDown();
            break;
        case 'ArrowLeft':
            if (!canMoveLeft()) {
                setupInputOnce();
                return;
            }
            moveLeft();
            break;
        default:
            setupInputOnce();
            return;
    }

    const newTile = new Tile(gameBord);
    grid.getRandEmptyCell().linkTile(newTile);

    if (!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight()) {
        await newTile.waitForAnimationEnd();
        getHighestScore();
        alert('Game over');
        window.location.reload()
    }

    setupInputOnce();
}
async function moveUp() {
    await slideTiles(grid.cellsGroupedByColumns);
}
async function moveDown() {
    await slideTiles(grid.cellsGroupedByReversColumns);
}
async function moveLeft() {
    await slideTiles(grid.cellsGroupedByRows)
}
async function moveRight() {
    await slideTiles(grid.cellsGroupedByReversRows)
}


function canMoveUp() {
    return canMove(grid.cellsGroupedByColumns);
}
function canMoveRight() {
    return canMove(grid.cellsGroupedByReversRows);
}
function canMoveDown() {
    return canMove(grid.cellsGroupedByReversColumns);
}
function canMoveLeft() {
    return canMove(grid.cellsGroupedByRows);
}




function canMove(groupedCells) {
    return groupedCells.some(group => canMoveInGroup(group));
}
function canMoveInGroup(group) {
    return group.some((cell, index) => {
        if (index === 0) {
            return false;
        }
        if (cell.isEmpty()) {
            return false;
        }
        const targetCell = group[index - 1];
        return targetCell.canAccept(cell.linkedTile);
    })
}
async function slideTiles(grupedCells) {
    const promises = [];
    grupedCells.forEach(group => slideTilesInGroup(group, promises));
    await Promise.all(promises);
    grid.cells.forEach(cell => {
        cell.hasTileForMerge() && cell.mergeTiles();
    })
}
function slideTilesInGroup(group, promises) {
    for (let i = 1; i < group.length; i++) {
        if (group[i].isEmpty()) {
            continue;
        }
        const cellWithTile = group[i];
        let targetCell;
        let j = i - 1;
        while (j >= 0 && group[j].canAccept(cellWithTile.linkedTile)) {
            targetCell = group[j];
            j--;
        }
        if (!targetCell) {
            continue;
        }
        promises.push(cellWithTile.linkedTile.waitForTransitionEnd())
        if (targetCell.isEmpty()) {
            targetCell.linkTile(cellWithTile.linkedTile)
        }
        else {
            targetCell.linkTileForMerge(cellWithTile.linkedTile)
        }
        cellWithTile.unlinkTile();
    }
}
const reBtn = document.querySelector('.reloud');
reBtn.addEventListener('click', () => {
    getHighestScore();
    window.location.reload();
})
function getHighestScore() {
    const allValidTiles = grid.cells.filter(it => it.linkedTile);
    const scoreArr = allValidTiles.map(it => it.linkedTile.value);
    if (Math.max(...scoreArr) > localStorage.getItem('2048Record')) {
        newRecord(Math.max(...scoreArr))
    }
}
function newRecord(rec) {
    const recordBord = document.querySelector('#record');
    recordBord.innerHTML = rec;
    localStorage.removeItem('2048Record');
    localStorage.setItem('2048Record', rec)
}

