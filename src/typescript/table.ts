import { squareClickInGame } from "./game.js";
import { AdicionarPlayerShip, getAtualPlayerPos, GetDeleteMode, getMenuAtual, getOrientation, getPlayersShipQuant, getShipCollected, removePlayerShip } from "./menu.js";

let table1: Array<Array<number>>;
let table2: Array<Array<number>>;
let tableSize: number;

export type playerName = "PLAYER1" | "PLAYER2"
export type shipNameType = "crusador" | "encolracado" | "porta_aviao"


const ships: any = {
    "crusador": 2,
    "encolracado": 3,
    "porta_aviao": 4
}

const shipsColor: any = {
    2: '#C97E49',
    3: '#ACC953',
    4: '#AE71C9'
}

const shipsColorClicked: any = {
    1: 'lightblue',
    21: '#C97E49',
    31: '#ACC953',
    41: '#AE71C9'
}

export const shipSize: any = {
    "crusador": 2,
    "encolracado": 3,
    "porta_aviao": 4
}

const numberToShip: any = {
    2: "crusador",
    3: "encolracado",
    4: "porta_aviao"
}

export const initTable = () => {
}

export const setTable = (table1P: number[][] = table1, table2P: number[][] = table2) => {
    table1 = table1P;
    table2 = table2P;
}

export const getTable = () => {
    return [table1, table2]
}

export const getTableSize = () => {
    return tableSize;
}

export const createTable = () => {
    table1 = createVirtualTable(tableSize);
    table2 = createVirtualTable(tableSize);
    createVisualTable();
}

export const destroyTable = (deleteTable: boolean = true) => {
    if (deleteTable) {
        table1 = new Array<Array<number>>();
        table2 = new Array<Array<number>>();

    }
    let table1Html = document.getElementById("tabuleiro1") as HTMLElement;
    let table2Html = document.getElementById("tabuleiro2") as HTMLElement

    table1Html.innerHTML = "";
    table2Html.innerHTML = "";

}

export const setTableSize = (size: number) => {
    tableSize = size;
}

const createVirtualTable = (size: Number = 8) => {
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

export const createVisualTable = () => {
    let table1Html = document.getElementById("tabuleiro1") as HTMLElement;
    let table2Html = document.getElementById("tabuleiro2") as HTMLElement;

    table1.forEach((value, index, tableF) => {
        let newLine = createLine(value, index, tableF, "PLAYER1")
        table1Html.appendChild(newLine)
    })

    table2.forEach((value, index, tableF) => {
        let newLine = createLine(value, index, tableF, "PLAYER2")
        table2Html.appendChild(newLine)
    })
}

const createLine = (lineP: number[], lineN: number, tableF: number[][], className: playerName) => {
    let line = document.createElement("div")
    line.className = "tabLine";
    line.id = "tabuleiroLine";

    lineP.forEach((value, index) => {
        let square = document.createElement("div");
        square.className = `tabSquare ${className}`;
        // square.id = "tabuleiroSquare";
        // square.innerHTML = `${value}`;
        square.title = `y=${lineN} x=${index} value=${value}`
        if (getMenuAtual() != 3) {
            square.style.backgroundColor = shipsColor[value]
        }
        else {
            square.style.backgroundColor = shipsColorClicked[value]
            if(value == 1){
                square.style.backgroundImage = 'url(/assets/images/explosion-32.png)'
                square.style.backgroundRepeat = 'no-repeat'
                square.style.backgroundPosition = 'center'

            }
        }
        square.addEventListener("drop", (event: DragEvent) => {
            event.preventDefault()
            let playerPos: playerName = getAtualPlayerPos() == 1 ? "PLAYER1" : "PLAYER2"
            if (playerPos != className) {
                destroyTable(false);
                createVisualTable()
                showTable()
                return
            }
            if (event.dataTransfer) {
                let text = event.dataTransfer.getData('text/plain')
                if (text == 'crusador' || text == 'encolracado' || text == 'porta_aviao') {
                    if (getPlayersShipQuant()[getAtualPlayerPos() - 1][text] > 0) {
                        if (insertShip(index, lineN, text, tableF) == false) {
                            removePlayerShip(text)
                        }
                    }
                }
            }
            destroyTable(false);
            createVisualTable()
            showTable()
        })
        square.addEventListener("dragover", (event: DragEvent) => {
            event.preventDefault()
            let playerPos: playerName = getAtualPlayerPos() == 1 ? "PLAYER1" : "PLAYER2"
            let shipCollected: shipNameType = getShipCollected() as shipNameType
            if (hasColission(tableF, index, lineN, shipCollected) || playerPos != className) {
                square.style.backgroundColor = 'red'
            }
            else {
                let orientation = getOrientation()
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
            let playerPos: playerName = getAtualPlayerPos() == 1 ? "PLAYER1" : "PLAYER2"
            if (getMenuAtual() == 2) {
                if (playerPos == className) {
                    if (GetDeleteMode()) {
                        AdicionarPlayerShip(numberToShip[tableF[lineN][index]])
                        deleteShipFromTable(getAtualPlayerPos(), index, lineN);
                    }
                }
            }
            if (getMenuAtual() == 3) {
                squareClickInGame(square, lineN, index, className);
            }
        })

        line.appendChild(square);
    })
    return line;
}

const deleteShipFromTable = (player: number, startX: number, startY: number) => {
    let table = null;
    if (player == 1) {
        table = table1;
    }
    else {
        table = table2;
    }

    let shipNumber = table[startY][startX]
    if (shipNumber > 0 && shipNumber != 1) {
        deleteShipFromTableAux(table, startY, startX, shipNumber);
    }
    destroyTable(false)
    createVisualTable()

}

const deleteShipFromTableAux = (table: number[][], posY: number, posX: number, shipNumber: number) => {
    if (table[posY][posX] != shipNumber) {
        return;
    }
    table[posY][posX] = 0
    deleteNeigbor(table, posX, posY);
    console.log(posX, posY, tableSize)
    // cima
    if (posY - 1 >= 0) {
        deleteShipFromTableAux(table, posY - 1, posX, shipNumber)
    }
    // baixo
    if (posY + 1 < tableSize) {
        deleteShipFromTableAux(table, posY + 1, posX, shipNumber);
    }
    //esquerda
    if (posX - 1 >= 0) {
        deleteShipFromTableAux(table, posY, posX - 1, shipNumber);
    }
    //direita
    if (posX + 1 < tableSize) {
        deleteShipFromTableAux(table, posY, posX + 1, shipNumber);
    }
}

const insertShip = (posx: number, posy: number, ship: shipNameType, table: number[][]) => {
    // coletar a orientação
    let horientacao = getOrientation();

    if (horientacao == 'vertical') {
        if (hasColission(table, posx, posy, ship)) {
            return true;
        }
        for (let i = 0; i < shipSize[ship]; i += 1) {
            table[posy + i][posx] = ships[ship]
            createNeigbor(table, posx, posy + i)

        }
    }
    else {
        if (hasColission(table, posx, posy, ship)) {
            return true;
        }
        for (let i = 0; i < shipSize[ship]; i += 1) {
            table[posy][posx + i] = ships[ship]
            createNeigbor(table, posx + i, posy)
        }
    }
    return false;
}

export const hasColission = (table: number[][], posX: number, posY: number, ship: shipNameType) => {
    if (getOrientation() == 'vertical') {
        if (posY + shipSize[ship] > tableSize) {
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
        if (posX + shipSize[ship] > tableSize) {
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

export const createNeigbor = (table: number[][], posX: number, posY: number) => {
    if (posY + 1 < tableSize && table[posY + 1][posX] <= 0) table[posY + 1][posX] += -1;
    if (posX + 1 < tableSize && table[posY][posX + 1] <= 0) table[posY][posX + 1] += -1;
    if (posY - 1 >= 0 && table[posY - 1][posX] <= 0) table[posY - 1][posX] += -1;
    if (posX - 1 >= 0 && table[posY][posX - 1] <= 0) table[posY][posX - 1] += -1;

}

const deleteNeigbor = (table: number[][], posX: number, posY: number) => {
    if (posY + 1 < tableSize && table[posY + 1][posX] <= -1) table[posY + 1][posX] += 1;
    if (posX + 1 < tableSize && table[posY][posX + 1] <= -1) table[posY][posX + 1] += 1;
    if (posY - 1 >= 0 && table[posY - 1][posX] <= -1) table[posY - 1][posX] += 1;
    if (posX - 1 >= 0 && table[posY][posX - 1] <= -1) table[posY][posX - 1] += 1;

}

export const showTable = () => {
    let line = 0
    console.log("table 1")
    table1.forEach((column) => {
        console.log(`line ${line} -> ` + column)
        line += 1;
    })
    console.log("table 2")
    table2.forEach((column) => {
        console.log(`line ${line} -> ` + column)
        line += 1;
    })
}

const selected = () => {

}

