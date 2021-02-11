import { shoot } from "./IA.js";
import { getPlayerQuant, getPlayerShipInGame, initMenu3, playerAtualInGameVisual, setPlayerShipInGame, setPlayerShipQuantVisual } from "./menu.js";
import { createVisualTable, destroyTable, getTable, getTableSize, setTable, playerName } from "./table.js";

let mocked = false;
let atualPlayer = 0;
let gameStarted = false;


export const getGameStarted = () => {
    return gameStarted
}

const shipSize: any = {
    21: 2,
    31: 3,
    41: 4
}

export const initGame = () => {
    startGame()
    createVisualTable();
    initMenu3()
}

export const CPUshoot = (x: number, y: number, player: number) => {
    let allmatriz = getTable();
    let matrizWork = allmatriz[player];

    if (matrizWork[y][x] == 1 || matrizWork[y][x] > 20) return 'INVALIDO'; // Espaço que ja deu um tiro
    if (matrizWork[y][x] == 0) {
        // Tiro na agua e passa para o proximo jogador
        matrizWork[y][x] = 1;
        setTable(matrizWork, allmatriz[1])
        return 'AGUA'
    }
    else {
        // Acertou um barco
        matrizWork[y][x] = Number.parseFloat(matrizWork[y][x] + '1');
        setTable(matrizWork, allmatriz[1])
        if (shipDestroyed(matrizWork.map((value) => value.map((value) => value)), y, x, 1)) {
            return 'AFUNDOU';
        }
        return 'ACERTOU'
    }
}

export const squareClickInGame = (element: HTMLElement | null = null, y: number, x: number, classname : playerName) => {
    let playerAtual: playerName = atualPlayer == 0 ? "PLAYER1" : "PLAYER2"
    if (gameStarted == false || playerAtual == classname ) return; // função so pode ser execultada se estiver no jogo
    let allmatriz = getTable();
    let matrizInt = (atualPlayer + 1) % 2
    let matrizWork = allmatriz[matrizInt];
    let oldPlayer = atualPlayer;
    let time: number = 0;
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
        allmatriz[matrizInt] = matrizWork;
        if (matrizWork[y][x] != 1) {
            // se não acertou a agua verifica se o barco foi afundado
            if (shipDestroyed(matrizWork.map((value) => value.map((value) => value)), y, x, 1)){
                endGame(); // verifica se o jogo acabou
            }
        }
        // Remonta o tabuleiro
        setTable(...allmatriz);
        destroyTable(false);
        createVisualTable()
        // verifica se todos os barcos do jogador foram afundados
    } else {
        allmatriz[matrizInt] = matrizWork;
        setTable(...allmatriz);
        destroyTable(false);
        createVisualTable();
        nextPlayer()
    }



}

export const nextPlayer = () => {
    if (getPlayerQuant() == 1) {
        if (atualPlayer == 0) {
            atualPlayer = 1;
            playerAtualInGameVisual(2);
            shoot();
            destroyTable(false)
            createVisualTable()
        }
        else {
            atualPlayer = 0;
            playerAtualInGameVisual(1);
        }
    }
    else {
        if (atualPlayer == 0) {
            atualPlayer = 1;
            playerAtualInGameVisual(1)
        }
        else {
            atualPlayer = 0;
            playerAtualInGameVisual(0)
        }
        console.log(atualPlayer);
    }
}

export const startGame = () => {
    if (mocked) {
        autoPos();
    }
    let [table1, table2] = getTable();

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
    setTable(table1, table2);
    destroyTable(false)
    createVisualTable()
    gameStarted = true;
}

const shipDestroyed = (table: number[][], y: number, x: number, quant: number) => {
    let ship = table[y][x]

    if (shipDestroyedAux(table, y, x, ship) == shipSize[ship]) {
        let playermatriz = getPlayerShipInGame()
        let player = playermatriz[(atualPlayer + 1) % 2]
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
        playermatriz[(atualPlayer + 1) % 2] = player;
        setPlayerShipInGame(playermatriz[0], playermatriz[1]);
        setPlayerShipQuantVisual()
        return true
    }
    return false
}

const shipDestroyedAux = (table: number[][], y: number, x: number, ship: number) => {
    if (table[y][x] != ship) {
        return 0;
    }
    table[y][x] = 0;
    let sized = 1;
    if (y + 1 < getTableSize()) {
        sized += shipDestroyedAux(table, y + 1, x, ship);
    }
    if (y - 1 >= 0) {
        sized += shipDestroyedAux(table, y - 1, x, ship);
    }
    if (x + 1 < getTableSize()) {
        sized += shipDestroyedAux(table, y, x + 1, ship);
    }
    if (x - 1 >= 0) {
        sized += shipDestroyedAux(table, y, x - 1, ship);
    }
    return sized;
}

const shipIs = (ship: number) => {
    switch (ship) {
        case 2:
        case 3:
        case 4:
            return true;
        default:
            return false
    }
}

const autoPos = () => {
    let [p1, p2] = getPlayerShipInGame()
    let [table1, table2] = getTable()
    table1 = [
        [0, 0, 0, 0, - 1, 0, -1, 0, -1, 0],
        [0, 0, 0, -1, 2, -2, 2, -2, 3, -1],
        [0, -1, -1, -2, 2, -2, 2, -2, 3, -1],
        [-1, 3, 3, 3, -3, 0, -2, -1, 3, -1],
        [0, -2, -1, -2, 2, -2, 2, -1, -1, 0],
        [-1, 4, -1, -1, 2, -2, 2, -1, -1, 0],
        [-1, 4, -1, 0, -1, -1, -1, -1, 3, -1],
        [-1, 4, -1, 0, -1, 2, -1, -1, 3, -1],
        [-1, 4, -1, 0, -1, 2, -1, -1, 3, -1],
        [0, -1, 0, 0, 0, -1, 0, 0, -1, 0,]
    ]
    table2 = [[]]
    p1 = {
        crusador: 5,
        encolracado: 3,
        porta_aviao: 1
    }
    setPlayerShipInGame(p1, p2)
    setTable(table1, table2)
}

export const endGame = () => {
    let [pl1, pl2] = getPlayerShipInGame()
    let score1 = pl1.crusador + pl1.encolracado + pl1.porta_aviao
    let score2 = pl2.crusador + pl2.encolracado + pl2.porta_aviao
    if (score1 != 0 && score2 != 0) return;
    if (score1 == 0) {
        // player 2 ganhou
        showWinner('Player 2')
    }
    else {
        // player 1 ganhou
        showWinner('Player 1')
    }
    gameStarted = false
}

const showWinner = (player: string) => {
    let playerName = document.getElementById('playerName')
    let textWinner = document.getElementById('winnerText');
    if (playerName && textWinner) {
        playerName.innerText = player;
        textWinner.classList.remove('deactivate')
    }
}