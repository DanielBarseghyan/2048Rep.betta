import { Cell } from "./cell.js"

const gridSize = 4;
const cellsCount = gridSize * gridSize;

export class Grid {
    constructor(gridElement) {
        this.cells = [];
        for (let i = 0; i < cellsCount; i++) {
            this.cells.push(
                new Cell(gridElement, i % gridSize, Math.floor(i / gridSize))
            );
        }
        this.cellsGroupedByColumns = this.cellsGroupedByColumns();
        this.cellsGroupedByReversColumns = this.cellsGroupedByColumns.map(col => [...col].reverse())
        this.cellsGroupedByRows = this.cellsGroupedByRows()
        this.cellsGroupedByReversRows = this.cellsGroupedByRows.map(row => [...row].reverse())
    }
    getRandEmptyCell() {
        const emptyCells = this.cells.filter(cell => cell.isEmpty())
        const randomIndex = Math.floor(Math.random() * emptyCells.length)
        return emptyCells[randomIndex];
    }
    cellsGroupedByColumns() {
        return this.cells.reduce((grupedCells, cell) => {
            grupedCells[cell.x] = grupedCells[cell.x] || [];
            grupedCells[cell.x][cell.y] = cell;
            return grupedCells;
        }, [])
    }
    cellsGroupedByRows() {
        return this.cells.reduce((grupedCells, cell) => {
            grupedCells[cell.y] = grupedCells[cell.y] || [];
            grupedCells[cell.y][cell.x] = cell;
            return grupedCells;
        }, [])
    }
}