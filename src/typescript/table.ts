import { squareClickInGame } from "./game.js";
import { AdicionarPlayerShip, getAtualPlayerPos, GetDeleteMode, getMenuAtual, getOrientation, getPlayersShipQuant, getShipCollected, removePlayerShip } from "./menu.js";

let table1: Array<Array<number>>;
let table2: Array<Array<number>>;
let tableSize: number;


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
    1: 'orange',
    21: '#C97E49',
    31: '#ACC953',
    41: '#AE71C9'
}

const shipSize: any = {
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

export const setTable = (table1P: number[][] = table1, table2P: number[][] = table2) =>{
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
    let line = document.getElementById("tabuleiro");
    if (line) {
        line.innerHTML = "";
    }
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

export const createVisualTable = (player: number = 1) => {
    let line = document.getElementById("tabuleiro");
    if (line == null) {
        throw "Não foi possivel localizar elemento no DOM";
    }

    let table;

    if (player == 1) {
        table = table1;
    }
    else {
        table = table2
    }
    console.log(table)
    table.forEach((value, index, tableF) => {
        let newLine = createLine(value, index, tableF)
        line?.appendChild(newLine)
    })
}

const createLine = (lineP: number[], lineN: number, tableF: number[][]) => {
    let line = document.createElement("div")
    line.className = "tabLine";
    line.id = "tabuleiroLine";
    lineP.forEach((value, index) => {
        let square = document.createElement("div");
        square.className = "tabSquare";
        square.id = "tabuleiroSquare";
        // square.innerHTML = `${value}`;
        // square.title = `y=${lineN} x=${index}`
        if (getMenuAtual() != 3) {
            square.style.backgroundColor = shipsColor[value]
        }
        else{
            square.style.backgroundColor = shipsColorClicked[value]
        }
        square.addEventListener("drop", (event: DragEvent) => {
            event.preventDefault()
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
            createVisualTable(getAtualPlayerPos())
            showTable()
        })
        square.addEventListener("dragover", (event: DragEvent) => {
            event.preventDefault()
            if (hasColission(tableF, index, lineN, getShipCollected())) {
                square.style.backgroundColor = 'red'
            }
            else {
                square.style.backgroundColor = 'yellow'
            }

        })
        square.addEventListener("dragleave", (event: Event) => {
            event.preventDefault()
            if (tableF[lineN][index] <= 0) {
                square.style.backgroundColor = '#4E6466'
                return;
            }
            // if (tableF[lineN][index] < 0) {
            //     square.style.backgroundColor = 'purple'
            // }
            square.style.backgroundColor = shipsColor[tableF[lineN][index]]
        })

        square.addEventListener('click', (event: Event) => {
            event.preventDefault()
            console.log(getMenuAtual())
            if (getMenuAtual() == 2) {
                if (GetDeleteMode()) {
                    AdicionarPlayerShip(numberToShip[tableF[lineN][index]])
                    deleteShipFromTable(getAtualPlayerPos(), index, lineN);
                }
            }
            if (getMenuAtual() == 3) {
                squareClickInGame(square,lineN,index);
                // destroyTable(false)
                // createVisualTable(1)
                // showTable();
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
    createVisualTable(getAtualPlayerPos())

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

const insertShip = (posx: number, posy: number, ship: string, table: number[][]) => {
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

const hasColission = (table: number[][], posX: number, posY: number, ship: string) => {
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

const createNeigbor = (table: number[][], posX: number, posY: number) => {
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

