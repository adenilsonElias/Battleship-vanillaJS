import { numberToShip, playerName, shipNameType, ships, shipsColor, shipsColorClicked, shipSize } from "./interfaces.js";
import { Menu } from "./menu.js";
export class Table {
    table1: Array<Array<number>> | null = null;
    table2: Array<Array<number>> | null = null;
    tableSize: number = 10;
    menu: Menu
    squareClickInGame: Function


    constructor(menu: Menu) {
        this.menu = menu
        this.menu.updateTableScreen = () =>{
            this.destroyTable(false)
            this.createVisualTable()
        }
        menu.showtable = () => {
            this.destroyTable()
            this.createTable()
        }
        console.log(menu)
        this.createTable()
        this.squareClickInGame = () => {
            console.log("Nenhuma função adicionada")
        }
    }

    createTable = () => {
        this.table1 = this.createVirtualTable(this.tableSize);
        this.table2 = this.createVirtualTable(this.tableSize);
        this.createVisualTable();
    }

    destroyTable = (deleteTable: boolean = true) => {
        if (deleteTable) {
            this.table1 = new Array<Array<number>>();
            this.table2 = new Array<Array<number>>();

        }
        let table1Html = document.getElementById("tabuleiro1") as HTMLElement;
        let table2Html = document.getElementById("tabuleiro2") as HTMLElement;

        table1Html.innerHTML = "";
        table2Html.innerHTML = "";
    }

    createVirtualTable = (size: Number = 8) => {
        let table = []
        for (let i = 0; i < size; i += 1) {
            let line = []
            for (let j = 0; j < size; j += 1) {
                line.push(0);
            }
            table.push(line)
        }
        return table
    }

    createVisualTable = () => {
        let table1Html = document.getElementById("tabuleiro1") as HTMLElement;
        let table2Html = document.getElementById("tabuleiro2") as HTMLElement;

        this.table1!!.forEach((value, index, tableF) => {
            let newLine = this.createLine(value, index, tableF, "PLAYER1")
            table1Html.appendChild(newLine)
        })

        this.table2!!.forEach((value, index, tableF) => {
            let newLine = this.createLine(value, index, tableF, "PLAYER2")
            table2Html.appendChild(newLine)
        })
    }

    createLine = (lineP: number[], lineN: number, tableF: number[][], className: playerName) => {
        let line = document.createElement("div")
        line.className = "tabLine";
        line.id = "tabuleiroLine";

        lineP.forEach((value, index) => {
            let square = document.createElement("div");
            square.className = `tabSquare ${className}`;
            // square.id = "tabuleiroSquare";
            // square.innerHTML = `${value}`;
            square.title = `y=${lineN} x=${index} value=${value}`
            if (this.menu.menu != 3) {
                console.log(this.menu.atualPlayerPos,className)
                if(this.menu.atualPlayerPos == 1 && className == 'PLAYER1'){
                    square.style.backgroundColor = "#4E6466"
                } else {
                    square.style.backgroundColor = shipsColor[value]
                }
            }
            else {
                square.style.backgroundColor = shipsColorClicked[value]
                if (value == 1) {
                    square.style.backgroundImage = 'url(/assets/images/explosion-32.png)'
                    square.style.backgroundRepeat = 'no-repeat'
                    square.style.backgroundPosition = 'center'
                }
            }
            square.addEventListener("drop", (event: DragEvent) => {
                event.preventDefault()
                let playerPos: playerName = this.menu.atualPlayerPos == 0 ? "PLAYER1" : "PLAYER2"
                if (playerPos != className) {
                    this.destroyTable(false);
                    this.createVisualTable()
                    this.showTable()
                    return
                }
                if (event.dataTransfer) {
                    let text = event.dataTransfer.getData('text/plain')
                    if (text == 'crusador' || text == 'encolracado' || text == 'porta_aviao') {
                        let playershipQuant = this.menu.atualPlayerPos == 0 ? this.menu.player1Ship : this.menu.player2Ship
                        if (playershipQuant!![text] > 0) {
                            if (this.insertShip(index, lineN, text, tableF) == false) {
                                this.menu.removePlayerShip(text)
                            }
                        }
                    }
                }
                this.destroyTable(false);
                this.createVisualTable()
                this.showTable()
            })
            square.addEventListener("dragover", (event: DragEvent) => {
                event.preventDefault()
                let playerPos: playerName = this.menu.atualPlayerPos == 0 ? "PLAYER1" : "PLAYER2"
                let shipCollected: shipNameType = this.menu.shipCollected as shipNameType
                if (this.hasColission(tableF, index, lineN, shipCollected) || playerPos != className) {
                    square.style.backgroundColor = 'red'
                }
                else {
                    let orientation = this.menu.orientation
                    square.style.backgroundColor = "lightgreen";
                    square.style.backgroundImage = orientation == "vertical" ? "url(/assets/images/down-arrow.png)" : "url(/assets/images/right-arrow.png)"
                    square.style.backgroundSize = "40px";
                    square.style.backgroundRepeat = "no-repeat";
                    square.style.backgroundPosition = "center";
                }

            })
            square.addEventListener("dragleave", (event: Event) => {
                event.preventDefault()
                if (tableF[lineN][index] <= 0) {
                    square.style.background = '#4E6466'
                    return;
                }
                // if (tableF[lineN][index] < 0) {
                //     square.style.backgroundColor = 'purple'
                // }
                square.style.backgroundColor = shipsColor[tableF[lineN][index]]
            })

            square.addEventListener('click', (event: Event) => {
                event.preventDefault()
                let playerPos: playerName = this.menu.atualPlayerPos == 0 ? "PLAYER1" : "PLAYER2"
                if (this.menu.menu == 2) {
                    if (playerPos == className) {
                        if (this.menu.deleteMode) {
                            this.menu.AdicionarPlayerShip(numberToShip[tableF[lineN][index]])
                            this.deleteShipFromTable(this.menu.atualPlayerPos, index, lineN);
                        }
                    }
                }
                if (this.menu.menu == 3) {
                    this.squareClickInGame(square, lineN, index, className);
                }
            })

            line.appendChild(square);
        })
        return line;
    }

    deleteShipFromTable = (player: number, startX: number, startY: number) => {
        let table = null;
        if (player == 0) {
            table = this.table1!!;
        }
        else {
            table = this.table2!!;
        }

        let shipNumber = table[startY][startX]
        if (shipNumber > 0 && shipNumber != 1) {
            this.deleteShipFromTableAux(table, startY, startX, shipNumber);
        }
        this.destroyTable(false)
        this.createVisualTable()

    }

    deleteShipFromTableAux = (table: number[][], posY: number, posX: number, shipNumber: number) => {
        if (table[posY][posX] != shipNumber) {
            return;
        }
        table[posY][posX] = 0
        this.deleteNeigbor(table, posX, posY);
        console.log(posX, posY, this.tableSize)
        // cima
        if (posY - 1 >= 0) {
            this.deleteShipFromTableAux(table, posY - 1, posX, shipNumber)
        }
        // baixo
        if (posY + 1 < this.tableSize) {
            this.deleteShipFromTableAux(table, posY + 1, posX, shipNumber);
        }
        //esquerda
        if (posX - 1 >= 0) {
            this.deleteShipFromTableAux(table, posY, posX - 1, shipNumber);
        }
        //direita
        if (posX + 1 < this.tableSize) {
            this.deleteShipFromTableAux(table, posY, posX + 1, shipNumber);
        }
    }

    insertShip = (posx: number, posy: number, ship: shipNameType, table: number[][]) => {
        // coletar a orientação
        let horientacao = this.menu.orientation;

        if (horientacao == 'vertical') {
            if (this.hasColission(table, posx, posy, ship)) {
                return true;
            }
            for (let i = 0; i < shipSize[ship]; i += 1) {
                table[posy + i][posx] = ships[ship]
                this.createNeigbor(table, posx, posy + i)

            }
        }
        else {
            if (this.hasColission(table, posx, posy, ship)) {
                return true;
            }
            for (let i = 0; i < shipSize[ship]; i += 1) {
                table[posy][posx + i] = ships[ship]
                this.createNeigbor(table, posx + i, posy)
            }
        }
        return false;
    }

    hasColission = (table: number[][], posX: number, posY: number, ship: shipNameType) => {
        if (this.menu.orientation == 'vertical') {
            if (posY + shipSize[ship] > this.tableSize) {
                return true;
            }
            for (let i = 0; i < shipSize[ship]; i += 1) {
                if (table[posY + i][posX] != 0) {
                    return true
                }
            }
            return false
        }
        else {
            if (posX + shipSize[ship] > this.tableSize) {
                return true;
            }
            for (let i = 0; i < shipSize[ship]; i += 1) {
                if (table[posY][posX + i] != 0) {
                    return true
                }
            }
            return false
        }

    }

    createNeigbor = (table: number[][], posX: number, posY: number) => {
        if (posY + 1 < this.tableSize && table[posY + 1][posX] <= 0) table[posY + 1][posX] += -1;
        if (posX + 1 < this.tableSize && table[posY][posX + 1] <= 0) table[posY][posX + 1] += -1;
        if (posY - 1 >= 0 && table[posY - 1][posX] <= 0) table[posY - 1][posX] += -1;
        if (posX - 1 >= 0 && table[posY][posX - 1] <= 0) table[posY][posX - 1] += -1;

    }

    deleteNeigbor = (table: number[][], posX: number, posY: number) => {
        if (posY + 1 < this.tableSize && table[posY + 1][posX] <= -1) table[posY + 1][posX] += 1;
        if (posX + 1 < this.tableSize && table[posY][posX + 1] <= -1) table[posY][posX + 1] += 1;
        if (posY - 1 >= 0 && table[posY - 1][posX] <= -1) table[posY - 1][posX] += 1;
        if (posX - 1 >= 0 && table[posY][posX - 1] <= -1) table[posY][posX - 1] += 1;

    }

    showTable = () => {
        let line = 0
        console.log("table 1")
        this.table1!!.forEach((column) => {
            console.log(`line ${line} -> ` + column)
            line += 1;
        })
        console.log("table 2")
        this.table2!!.forEach((column) => {
            console.log(`line ${line} -> ` + column)
            line += 1;
        })
    }
}
