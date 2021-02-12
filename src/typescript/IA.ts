import { CPUshoot, getGameStarted, nextPlayer, endGame } from "./game.js";
import { getPlayersShipQuant } from "./menu.js";
import { getTable, getTableSize, setTable, createNeigbor, shipSize, shipNameType, destroyTable, createVisualTable } from "./table.js";

const FINDMODE = 1;
const ATTACKMODE = 0;
const VERTICAL = 0;
const HORIZONTAL = 1;
const NODIRECTION = 2;
let up = true;
let down = true;
let left = true;
let rigth = true;
let mode = FINDMODE;
let direction = NODIRECTION;
let lastX: number | null = null;
let lastY: number | null = null;

export const initIA = () => {
}

const resetIAToFindMode = () => {
    up = true;
    down = true;
    left = true;
    rigth = true;
    lastX = null;
    lastY = null
    direction = NODIRECTION
}

export const shoot = (): any => {
    destroyTable(false)
    createVisualTable()
    let tableSize = getTableSize();
    if (getGameStarted() == false) {
        return
    }
    if (mode == FINDMODE) {
        // CPU não sabe onde tem um navio
        let retorno = 'INVALIDO';
        let x = 0;
        let y = 0;
        while (retorno == 'INVALIDO') {
            x = Math.floor(Math.random() * tableSize);
            y = Math.floor(Math.random() * tableSize);
            retorno = CPUshoot(x, y, 0);
        }
        if (retorno == 'AGUA') {
            nextPlayer();
            return;
        }
        mode = ATTACKMODE;
        lastX = x;
        lastY = y;
        shoot();
    }
    else {
        if (lastY == null || lastX == null) {
            return;
        }
        if (up == false && down == false) {
            direction = HORIZONTAL;
        }
        if (direction == NODIRECTION) {
            // CPU sabe onde tem um navio mas não sabe qual a direção dele
            if (lastY - 1 >= 0 && up == true) {
                let retorno = CPUshoot(lastX, lastY - 1, 0);
                if (retorno == "INVALIDO"){
                    up = false
                    return shoot()
                }
                if (retorno == "AGUA") {
                    up = false;
                    nextPlayer();
                    return;
                }
                if (retorno == "ACERTOU") {
                    direction = VERTICAL;
                    return shoot()
                }
                if (retorno == "AFUNDOU") {
                    mode = FINDMODE;
                    resetIAToFindMode()
                    endGame()
                    return shoot()
                }
            }
            else {
                up = false;
            }
            if (lastY + 1 < tableSize && down == true) {
                let retorno = CPUshoot(lastX, lastY + 1, 0);
                if (retorno == "INVALIDO"){
                    down = false
                    return shoot()
                }
                if (retorno == "AGUA") {
                    down = false;
                    nextPlayer();
                    return;
                }
                if (retorno == "ACERTOU") {
                    direction = VERTICAL;
                    return shoot()
                }
                if (retorno == "AFUNDOU") {
                    mode = FINDMODE;
                    resetIAToFindMode()
                    endGame()
                    return shoot()
                }
            }
        }
        if (direction == VERTICAL) {
            // CPU sabe onde tem um navio e sabe que está na vertical
            let y = lastY;
            while (y - 1 >= 0 && up == true) {
                let result = CPUshoot(lastX, y - 1, 0);
                if (result == "INVALIDO") {
                    y -= 1;
                    continue;
                }
                if (result == "AGUA") {
                    up = false;
                    nextPlayer()
                    return;
                }
                if (result == "ACERTOU") {
                    shoot()
                    return;
                }
                if (result == "AFUNDOU") {
                    mode = FINDMODE;
                    resetIAToFindMode()
                    shoot();
                    endGame()
                    return;
                }
            }
            y = lastY;
            while (y + 1 < tableSize && down == true) {
                let result = CPUshoot(lastX, y + 1, 0);
                if (result == "INVALIDO") {
                    y += 1;
                    continue;
                }
                if (result == "AGUA") {
                    down = false;
                    nextPlayer()
                    return;
                }
                if (result == "ACERTOU") {
                    shoot()
                    return;
                }
                if (result == "AFUNDOU") {
                    mode = FINDMODE;
                    resetIAToFindMode()
                    endGame()
                    shoot();
                    return;
                }
            }
        }
        if (direction == HORIZONTAL) {
            // CPU sabe onde tem um navio e sabe que está na horizontal
            let x = lastX;
            while (x - 1 >= 0 && left == true) {
                let result = CPUshoot(x - 1, lastY, 0);
                if (result == "INVALIDO") {
                    x -= 1;
                    continue;
                }
                if (result == "AGUA") {
                    left = false;
                    nextPlayer()
                    return;
                }
                if (result == "ACERTOU") {
                    shoot()
                    return;
                }
                if (result == "AFUNDOU") {
                    mode = FINDMODE;
                    resetIAToFindMode()
                    endGame()
                    shoot();
                    return;
                }
            }
            x = lastX;
            while (x + 1 < tableSize && rigth == true) {
                let result = CPUshoot(x + 1, lastY, 0);
                if (result == "INVALIDO") {
                    x += 1;
                    continue;
                }
                if (result == "AGUA") {
                    rigth = false;
                    nextPlayer()
                    return;
                }
                if (result == "ACERTOU") {
                    shoot()
                    return;
                }
                if (result == "AFUNDOU") {
                    mode = FINDMODE;
                    resetIAToFindMode()
                    endGame()
                    shoot();
                    return;
                }
            }
        }
        // Detectar se em qual orientação está
        // Afundar o navio
        // Atirar em Y + 1 se possivel
        // Atirar em Y - 1 se possivel
        // Atirar em X + 1 se possivel
        // Atirar em X - 1 se possivel
        //  CPUshoot () 
    }

}

export const posCPU = () => {
    let tables = getTable();
    let CPUTable: number[][] = tables[1];
    let CPUShips = getPlayersShipQuant()[1]
    while (CPUShips.porta_aviao > 0) {
        let x = Math.floor(Math.random() * 10);
        let y = Math.floor(Math.random() * 10);
        if (IAColission(CPUTable, x, y, "porta_aviao", "horizontal") == false) {
            CPUShips.porta_aviao -= 1;
            for (let i = 0; i < shipSize["porta_aviao"]; i += 1) {
                CPUTable[y][x + i] = 4
                createNeigbor(CPUTable, x + i, y);

            }
            continue
        }
        if (IAColission(CPUTable, x, y, "porta_aviao", "vertical") == false) {
            CPUShips.porta_aviao -= 1;
            for (let i = 0; i < shipSize["porta_aviao"]; i += 1) {
                CPUTable[y + i][x] = 4
                createNeigbor(CPUTable, x, y + i);

            }
            continue
        }
    }
    while (CPUShips.encolracado > 0) {
        let x = Math.floor(Math.random() * 10);
        let y = Math.floor(Math.random() * 10);
        if (IAColission(CPUTable, x, y, "encolracado", "horizontal") == false) {
            CPUShips.encolracado -= 1;
            for (let i = 0; i < shipSize["encolracado"]; i += 1) {
                CPUTable[y][x + i] = 3
                createNeigbor(CPUTable, x + i, y);
            }
            continue
        }
        if (IAColission(CPUTable, x, y, "encolracado", "vertical") == false) {
            CPUShips.encolracado -= 1;
            for (let i = 0; i < shipSize["encolracado"]; i += 1) {
                CPUTable[y + i][x] = 3
                createNeigbor(CPUTable, x, y + i);

            }
            continue
        }
    }
    while (CPUShips.crusador > 0) {
        let x = Math.floor(Math.random() * 10);
        let y = Math.floor(Math.random() * 10);
        if (IAColission(CPUTable, x, y, "crusador", "horizontal") == false) {
            CPUShips.crusador -= 1;
            for (let i = 0; i < shipSize["crusador"]; i += 1) {
                CPUTable[y][x + i] = 2
                createNeigbor(CPUTable, x + i, y);
            }
            continue
        }
        if (IAColission(CPUTable, x, y, "crusador", "vertical") == false) {
            CPUShips.crusador -= 1;
            for (let i = 0; i < shipSize["crusador"]; i += 1) {
                CPUTable[y + i][x] = 2
                createNeigbor(CPUTable, x, y + i);

            }
            continue
        }
    }
    // @ts-ignore
    tables[1] = CPUTable;
    setTable(...tables);
}

const IAColission = (table: number[][], posX: number, posY: number, ship: shipNameType, orientation: "vertical" | "horizontal") => {
    let tableSize = 10
    if (orientation == 'vertical') {
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