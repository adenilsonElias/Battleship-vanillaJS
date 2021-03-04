import { playerName, shipNameType, shipSizeD } from "./interfaces.js";
import { Menu } from "./menu";
import { Table } from "./table";

export class Game {
    atualPlayer = 0;
    gameStarted = false;
    table: Table
    menu: Menu
    resetIAToFindMode: Function
    shoot: Function
    pause : boolean = false
    visualTable1 : HTMLElement
    visualTable2 : HTMLElement

    constructor(table: Table, menu: Menu) {
        this.table = table
        this.menu = menu
        this.menu.startGame = this.startGame
        this.menu.randonPos = this.randonPos
        this.table.squareClickInGame = this.squareClickInGame
        this.visualTable1 = document.getElementById("tabuleiro1")!!;
        this.visualTable2 = document.getElementById("tabuleiro2")!!;
        this.resetIAToFindMode = () => {
            console.log("Nenhuma função adicionada")
        }
        this.shoot = () => {
            console.log("Nenhuma função adicionada")
        }
    }

    squareClickInGame = (element: HTMLElement | null = null, y: number, x: number, classname: playerName) => {
        let playerAtual: playerName = this.atualPlayer == 0 ? "PLAYER1" : "PLAYER2"
        if (this.gameStarted == false || playerAtual == classname) return; // função so pode ser execultada se estiver no jogo
        let matrizInt = (this.atualPlayer + 1) % 2
        let matrizWork = matrizInt == 0 ? this.table.table1!! : this.table.table2!!;
        let acertou: boolean = true;
        if (matrizWork[y][x] == 1 || matrizWork[y][x] > 20) return; // Espaço que ja deu um tiro
        if (matrizWork[y][x] == 0) {
            // Tiro na agua e passa para o proximo jogador
            matrizWork[y][x] = 1;
            acertou = false;
        }
        else {
            // Acertou um barco
            matrizWork[y][x] = Number.parseFloat(matrizWork[y][x] + '1');
            acertou = true;
        }
        if (acertou) {
            if (matrizWork[y][x] != 1) {
                // se não acertou a agua verifica se o barco foi afundado
                if (this.shipDestroyed(matrizWork.map((value) => value.map((value) => value)), y, x, 1)) {
                    let sound = new Audio("/assets/sounds/ship-destroyed-explosion.wav")
                    sound.play()
                    this.endGame(); // verifica se o jogo acabou
                } else {
                    let sound = new Audio("/assets/sounds/ship-explosion.wav")
                    sound.play()
                }
            }
            // Remonta o tabuleiro
            this.table.destroyTable(false)
            this.table.createVisualTable()
            // verifica se todos os barcos do jogador foram afundados
        } else {
            let sound = new Audio("/assets/sounds/water-shoot.wav")
            sound.play()
            this.table.destroyTable(false)
            this.table.createVisualTable()
            this.nextPlayer()
        }
    }

    nextPlayer = () => {
        if (this.menu.playerQuant == 0) {
            if (this.atualPlayer == 0) {
                this.atualPlayer = 1;
                this.atualPlayerBorder()
                this.menu.playerAtualInGameVisual(1);
                this.shoot();
                console.log("SHOOT")
                this.table.destroyTable(false)
                this.table.createVisualTable()
            }
            else {
                this.atualPlayer = 0;
                this.atualPlayerBorder()
                this.menu.playerAtualInGameVisual(0);
            }
        }
        else {
            if (this.atualPlayer == 0) {
                this.atualPlayer = 1;
                this.atualPlayerBorder()
                this.menu.playerAtualInGameVisual(1)
            }
            else {
                this.atualPlayer = 0;
                this.atualPlayerBorder()
                this.menu.playerAtualInGameVisual(0)
            }
            console.log(this.atualPlayer);
        }
    }

    atualPlayerBorder = () =>{
        if(this.gameStarted == true){
            this.visualTable1.style.backgroundColor = this.atualPlayer == 1 ? "lightcoral" : "transparent"
            this.visualTable2.style.backgroundColor = this.atualPlayer == 0 ? "lightcoral" : "transparent"
        } else {
            this.visualTable1.style.backgroundColor = "transparent";
            this.visualTable2.style.backgroundColor = "transparent";
        }

    }


    startGame = () => {
        let [table1, table2] = [this.table.table1!!, this.table.table2!!]

        table1.forEach((value, indexY, table) => {
            value.forEach((value, indexX) => {
                if (value < 0) {
                    table[indexY][indexX] = 0
                }
            })
        });
        table2.forEach((value, indexY, table) => {
            value.forEach((value, indexX) => {
                if (value < 0) {
                    table[indexY][indexX] = 0
                }
            })
        });
        this.table.destroyTable(false)
        this.table.createVisualTable()
        this.gameStarted = true;
        this.atualPlayer = 0;
        this.atualPlayerBorder()
        this.resetIAToFindMode()
    }

    shipDestroyed = (table: number[][], y: number, x: number, quant: number) => {
        let ship = table[y][x]

        if (this.shipDestroyedAux(table, y, x, ship) == shipSizeD[ship]) {
            // let player = playermatriz[(atualPlayer + 1) % 2]
            let player = this.atualPlayer == 0 ? this.menu.player2ShipInGame!! : this.menu.player1ShipInGame!!
            if (ship == 21) {
                if (player.crusador == 0) {
                    return false;
                }
                player.crusador -= 1
            }
            if (ship == 31) {
                if (player.encolracado == 0) {
                    return false;
                }
                player.encolracado -= 1
            }
            if (ship == 41) {
                if (player.porta_aviao == 0) {
                    return false;
                }
                player.porta_aviao -= 1
            }
            this.menu.setPlayerShipQuantVisual()
            return true
        }
        return false
    }

    shipDestroyedAux = (table: number[][], y: number, x: number, ship: number) => {
        if (table[y][x] != ship) {
            return 0;
        }
        table[y][x] = 0;
        let sized = 1;
        if (y + 1 < this.table.tableSize) {
            sized += this.shipDestroyedAux(table, y + 1, x, ship);
        }
        if (y - 1 >= 0) {
            sized += this.shipDestroyedAux(table, y - 1, x, ship);
        }
        if (x + 1 < this.table.tableSize) {
            sized += this.shipDestroyedAux(table, y, x + 1, ship);
        }
        if (x - 1 >= 0) {
            sized += this.shipDestroyedAux(table, y, x - 1, ship);
        }
        return sized;
    }

    shipIs = (ship: number) => {
        switch (ship) {
            case 2:
            case 3:
            case 4:
                return true;
            default:
                return false
        }
    }

    randonPos = () => {
        const shipSize: any = {
            "crusador": 2,
            "encolracado": 3,
            "porta_aviao": 4
        }
        let shipInGame = [this.menu.player1Ship!!, this.menu.player2Ship!!]
        let tables = [this.table.table1!!, this.table.table2!!]
        let player = this.menu.atualPlayerPos

        while (shipInGame[player].crusador > 0) {
            let x = Math.floor(Math.random() * 10)
            let y = Math.floor(Math.random() * 10)
            let direction: 'vertical' | "horizontal" = Math.floor(Math.random() * 2) == 0 ? "vertical" : "horizontal"
            if (this.Colission(tables[player], x, y, "crusador", direction) == false) {
                shipInGame[player].crusador -= 1;
                for (let i = 0; i < shipSize["crusador"]; i += 1) {
                    if (direction == 'horizontal') {
                        tables[player][y][x + i] = 2
                        console.log(tables[player])
                        this.table.createNeigbor(tables[player], x + i, y);
                    } else {
                        tables[player][y + i][x] = 2
                        console.log(tables[player])
                        this.table.createNeigbor(tables[player], x, y + i);
                    }
                }
            }
        }
        while (shipInGame[player].encolracado > 0) {
            let x = Math.floor(Math.random() * 10)
            let y = Math.floor(Math.random() * 10)
            let direction: 'vertical' | "horizontal" = Math.floor(Math.random() * 2) == 0 ? "vertical" : "horizontal"
            if (this.Colission(tables[player], x, y, "encolracado", direction) == false) {
                shipInGame[player].encolracado -= 1;

                for (let i = 0; i < shipSize["encolracado"]; i += 1) {
                    if (direction == 'horizontal') {
                        tables[player][y][x + i] = 3
                        this.table.createNeigbor(tables[player], x + i, y);
                    } else {
                        tables[player][y + i][x] = 3
                        this.table.createNeigbor(tables[player], x, y + i);
                    }

                }
                continue
            }
        }
        while (shipInGame[player].porta_aviao > 0) {
            let x = Math.floor(Math.random() * 10)
            let y = Math.floor(Math.random() * 10)
            let direction: 'vertical' | "horizontal" = Math.floor(Math.random() * 2) == 0 ? "vertical" : "horizontal"
            if (this.Colission(tables[player], x, y, "porta_aviao", direction) == false) {
                shipInGame[player].porta_aviao -= 1;

                for (let i = 0; i < shipSize["porta_aviao"]; i += 1) {
                    if (direction == 'horizontal') {
                        tables[player][y][x + i] = 4
                        this.table.createNeigbor(tables[player], x + i, y);
                    } else {
                        tables[player][y + i][x] = 4
                        this.table.createNeigbor(tables[player], x, y + i);
                    }


                }
            }
        }
        this.menu.setShipQuantScreen()
        this.table.destroyTable(false)
        this.table.createVisualTable()
    }

    endGame = () => {
        let [pl1, pl2] = [this.menu.player1ShipInGame!!, this.menu.player2ShipInGame!!]
        let score1 = pl1.crusador + pl1.encolracado + pl1.porta_aviao
        let score2 = pl2.crusador + pl2.encolracado + pl2.porta_aviao
        if (score1 != 0 && score2 != 0) return;
        if (score1 == 0) {
            // player 2 ganhou
            this.showWinner('Player 2')
        }
        else {
            // player 1 ganhou
            this.showWinner('Player 1')
        }
        this.gameStarted = false
        this.atualPlayerBorder()
    }

    showWinner = (player: string) => {
        let playerName = document.getElementById('playerName')
        let textWinner = document.getElementById('winnerText');
        if (playerName && textWinner) {
            playerName.innerText = player;
            textWinner.classList.remove('deactivate')
        }
    }

    Colission = (table: number[][], posX: number, posY: number, ship: shipNameType, orientation: "vertical" | "horizontal") => {
        const shipSize: any = {
            "crusador": 2,
            "encolracado": 3,
            "porta_aviao": 4
        }
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