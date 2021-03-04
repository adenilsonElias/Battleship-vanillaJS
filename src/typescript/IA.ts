import { Game } from "./game";
import { shipNameType, shipSize, shootReturn } from "./interfaces.js";
import { Menu } from "./menu";
import { Table } from "./table";

export class IA {
    FINDMODE = 1;
    ATTACKMODE = 0;
    VERTICAL = 0;
    HORIZONTAL = 1;
    NODIRECTION = 2;
    up = true;
    down = true;
    left = true;
    rigth = true;
    mode = this.FINDMODE;
    direction = this.NODIRECTION;
    lastX: number | null = null;
    lastY: number | null = null;
    table: Table
    game: Game
    menu: Menu

    constructor(table: Table, game: Game, menu: Menu) {
        this.table = table
        this.game = game
        this.menu = menu
        this.game.shoot = this.shoot
        this.game.resetIAToFindMode = this.resetIAToFindMode
        this.menu.posCPU = this.posCPU
    }


    resetIAToFindMode = () => {
        this.up = true;
        this.down = true;
        this.left = true;
        this.rigth = true;
        this.lastX = null;
        this.lastY = null
        this.direction = this.NODIRECTION
        this.mode = this.FINDMODE
    }

    CPUshoot = (x: number, y: number, player: number): shootReturn => {
        let allmatriz = [this.table.table1!!, this.table.table2!!]
        let matrizWork = allmatriz[player];

        if (matrizWork[y][x] == 1 || matrizWork[y][x] > 20) return 'INVALIDO'; // Espaço que ja deu um tiro
        if (matrizWork[y][x] == 0) {
            // Tiro na agua e passa para o proximo jogador
            matrizWork[y][x] = 1;
            let sound = new Audio("/assets/sounds/water-shoot.wav")
            sound.play()
            this.table.destroyTable(false)
            this.table.createVisualTable()
            return 'AGUA'
        }
        else {
            // Acertou um barco
            matrizWork[y][x] = Number.parseFloat(matrizWork[y][x] + '1');
            if (this.game.shipDestroyed(matrizWork.map((value) => value.map((value) => value)), y, x, 1)) {
                let sound = new Audio("/assets/sounds/ship-destroyed-explosion.wav")
                sound.play()
                this.table.destroyTable(false)
                this.table.createVisualTable()
                return 'AFUNDOU';
            }
            let sound = new Audio("/assets/sounds/ship-explosion.wav")
            sound.play()
            this.table.destroyTable(false)
            this.table.createVisualTable()
            return 'ACERTOU'
        }
    }

    shoot = (): any => {
        window.setTimeout(() => {
            console.info(this.up, this.down, this.left, this.rigth, this.mode, this.direction, this.lastX, this.lastY)
            let tableSize = this.table.tableSize;
            if (this.game.gameStarted == false) {
                return
            }
            if (this.mode == this.FINDMODE) {
                // CPU não sabe onde tem um navio
                let retorno = 'INVALIDO';
                let x = 0;
                let y = 0;
                while (retorno == 'INVALIDO') {
                    x = Math.floor(Math.random() * tableSize);
                    y = Math.floor(Math.random() * tableSize);
                    retorno = this.CPUshoot(x, y, 0);
                }
                if (retorno == 'AGUA') {
                    this.game.nextPlayer();
                    return;
                }
                this.mode = this.ATTACKMODE;
                this.lastX = x;
                this.lastY = y;
                this.shoot();
            }
            else {
                if (this.lastY == null || this.lastX == null) {
                    return;
                }
                if (this.up == false && this.down == false) {
                    this.direction = this.HORIZONTAL;
                }
                if (this.direction == this.NODIRECTION) {
                    // CPU sabe onde tem um navio mas não sabe qual a direção dele
                    if (this.lastY - 1 >= 0 && this.up == true) {
                        let retorno = this.CPUshoot(this.lastX, this.lastY - 1, 0);
                        if (retorno == "INVALIDO") {
                            this.up = false
                            return this.shoot()
                        }
                        if (retorno == "AGUA") {
                            this.up = false;
                            this.game.nextPlayer();
                            return;
                        }
                        if (retorno == "ACERTOU") {
                            this.direction = this.VERTICAL;
                            return this.shoot()
                        }
                        if (retorno == "AFUNDOU") {
                            this.mode = this.FINDMODE;
                            this.resetIAToFindMode()
                            this.game.endGame()
                            return this.shoot()
                        }
                    }
                    else {
                        this.up = false;
                    }
                    if (this.lastY + 1 < tableSize && this.down == true) {
                        let retorno = this.CPUshoot(this.lastX, this.lastY + 1, 0);
                        if (retorno == "INVALIDO") {
                            this.down = false
                            return this.shoot()
                        }
                        if (retorno == "AGUA") {
                            this.down = false;
                            this.game.nextPlayer();
                            return;
                        }
                        if (retorno == "ACERTOU") {
                            this.direction = this.VERTICAL;
                            return this.shoot()
                        }
                        if (retorno == "AFUNDOU") {
                            this.mode = this.FINDMODE;
                            this.resetIAToFindMode()
                            this.game.endGame()
                            return this.shoot()
                        }
                    } else {
                        this.down = false
                    }
                    return this.shoot()
                }
                if (this.direction == this.VERTICAL) {
                    // CPU sabe onde tem um navio e sabe que está na vertical
                    let y = this.lastY;
                    while (y - 1 >= 0 && this.up == true) {
                        let result = this.CPUshoot(this.lastX, y - 1, 0);
                        if (result == "INVALIDO") {
                            y -= 1;
                            continue;
                        }
                        if (result == "AGUA") {
                            this.up = false;
                            this.game.nextPlayer()
                            return;
                        }
                        if (result == "ACERTOU") {
                            this.shoot()
                            return;
                        }
                        if (result == "AFUNDOU") {
                            this.mode = this.FINDMODE;
                            this.resetIAToFindMode()
                            this.shoot();
                            this.game.endGame()
                            return;
                        }
                    }
                    y = this.lastY;
                    while (y + 1 < tableSize && this.down == true) {
                        let result = this.CPUshoot(this.lastX, y + 1, 0);
                        if (result == "INVALIDO") {
                            y += 1;
                            continue;
                        }
                        if (result == "AGUA") {
                            this.down = false;
                            this.game.nextPlayer()
                            return;
                        }
                        if (result == "ACERTOU") {
                            this.shoot()
                            return;
                        }
                        if (result == "AFUNDOU") {
                            this.mode = this.FINDMODE;
                            this.resetIAToFindMode()
                            this.game.endGame()
                            this.shoot();
                            return;
                        }
                    }
                }
                if (this.direction == this.HORIZONTAL) {
                    // CPU sabe onde tem um navio e sabe que está na horizontal
                    let x = this.lastX;
                    while (x - 1 >= 0 && this.left == true) {
                        let result = this.CPUshoot(x - 1, this.lastY, 0);
                        if (result == "INVALIDO") {
                            x -= 1;
                            continue;
                        }
                        if (result == "AGUA") {
                            this.left = false;
                            this.game.nextPlayer()
                            return;
                        }
                        if (result == "ACERTOU") {
                            this.shoot()
                            return;
                        }
                        if (result == "AFUNDOU") {
                            this.mode = this.FINDMODE;
                            this.resetIAToFindMode()
                            this.game.endGame()
                            this.shoot();
                            return;
                        }
                    }
                    x = this.lastX;
                    while (x + 1 < tableSize && this.rigth == true) {
                        let result = this.CPUshoot(x + 1, this.lastY, 0);
                        if (result == "INVALIDO") {
                            x += 1;
                            continue;
                        }
                        if (result == "AGUA") {
                            this.rigth = false;
                            this.game.nextPlayer()
                            return;
                        }
                        if (result == "ACERTOU") {
                            this.shoot()
                            return;
                        }
                        if (result == "AFUNDOU") {
                            this.mode = this.FINDMODE;
                            this.resetIAToFindMode()
                            this.game.endGame()
                            this.shoot();
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
        }, 1500)
    }

    posCPU = () => {
        let tables = [this.table.table1!!, this.table.table2!!]
        let CPUTable: number[][] = tables[1];
        let CPUShips = this.menu.player2Ship!!
        while (CPUShips.porta_aviao > 0) {
            let x = Math.floor(Math.random() * 10);
            let y = Math.floor(Math.random() * 10);
            if (this.IAColission(CPUTable, x, y, "porta_aviao", "horizontal") == false) {
                CPUShips.porta_aviao -= 1;
                for (let i = 0; i < shipSize["porta_aviao"]; i += 1) {
                    CPUTable[y][x + i] = 4
                    this.table.createNeigbor(CPUTable, x + i, y);

                }
                continue
            }
            if (this.IAColission(CPUTable, x, y, "porta_aviao", "vertical") == false) {
                CPUShips.porta_aviao -= 1;
                for (let i = 0; i < shipSize["porta_aviao"]; i += 1) {
                    CPUTable[y + i][x] = 4
                    this.table.createNeigbor(CPUTable, x, y + i);

                }
                continue
            }
        }
        while (CPUShips.encolracado > 0) {
            let x = Math.floor(Math.random() * 10);
            let y = Math.floor(Math.random() * 10);
            if (this.IAColission(CPUTable, x, y, "encolracado", "horizontal") == false) {
                CPUShips.encolracado -= 1;
                for (let i = 0; i < shipSize["encolracado"]; i += 1) {
                    CPUTable[y][x + i] = 3
                    this.table.createNeigbor(CPUTable, x + i, y);
                }
                continue
            }
            if (this.IAColission(CPUTable, x, y, "encolracado", "vertical") == false) {
                CPUShips.encolracado -= 1;
                for (let i = 0; i < shipSize["encolracado"]; i += 1) {
                    CPUTable[y + i][x] = 3
                    this.table.createNeigbor(CPUTable, x, y + i);

                }
                continue
            }
        }
        while (CPUShips.crusador > 0) {
            let x = Math.floor(Math.random() * 10);
            let y = Math.floor(Math.random() * 10);
            if (this.IAColission(CPUTable, x, y, "crusador", "horizontal") == false) {
                CPUShips.crusador -= 1;
                for (let i = 0; i < shipSize["crusador"]; i += 1) {
                    CPUTable[y][x + i] = 2
                    this.table.createNeigbor(CPUTable, x + i, y);
                }
                continue
            }
            if (this.IAColission(CPUTable, x, y, "crusador", "vertical") == false) {
                CPUShips.crusador -= 1;
                for (let i = 0; i < shipSize["crusador"]; i += 1) {
                    CPUTable[y + i][x] = 2
                    this.table.createNeigbor(CPUTable, x, y + i);

                }
                continue
            }
        }
    }

    IAColission = (table: number[][], posX: number, posY: number, ship: shipNameType, orientation: "vertical" | "horizontal") => {
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
}

