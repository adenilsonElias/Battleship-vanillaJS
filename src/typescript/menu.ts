import { startGame } from "./game.js";
import { createTable, destroyTable, setTableSize, createVisualTable, getTableSize, getTable } from "./table.js";

let menu: number = 1;
let player2Name: string = "";
let atualPlayerPos = 1;
let orientation = 'vertical'
let deleteMode = false;
let shipCollected = "";
let playerQuant = 0;

interface playerShipCount {
    "crusador": number;
    "encolracado": number;
    "porta_aviao": number
}

let player1Ship: playerShipCount;
let player2Ship: playerShipCount;
let player1ShipInGame: playerShipCount;
let player2ShipInGame: playerShipCount;

export const initMenu = () => {
    let continue1 = document.getElementById('continue1') as HTMLElement;
    let nextPlayerButton = document.getElementById('nextPlayerButton') as HTMLElement;
    let continue2 = document.getElementById("continue2") as HTMLElement;
    let configButton = document.getElementById("config") as HTMLElement;
    let resetButton = document.getElementById("reset") as HTMLElement;
    let vertical = document.getElementById('vertical') as HTMLElement;
    let horizontal = document.getElementById('horizontal') as HTMLElement;
    setEventsShip()
    initButtonContinue1(continue1, nextPlayerButton, continue2);
    initContinueButton2(continue2, nextPlayerButton);
    initButtonConfig(configButton);
    initResetButton(resetButton);
    initOrientationButton(vertical, horizontal);
    initRemoverButton();
    showMenu(menu)
}

export const moveForwardMenu = () => {
    if (menu < 3) {
        menu += 1;
        showMenu(menu);
    }
}

export const moveBackMenu = () => {
    if (menu > 1) {
        menu -= 1;
        showMenu(menu);
    }
}

export const getAtualPlayerPos = () => {
    return atualPlayerPos;
}

export const getPlayerQuant = () => {
    return playerQuant;
}

export const setOrientation = (orientationP: 'vertical' | 'horizontal') => {
    orientation = orientationP;
}

export const getOrientation = () => {
    return orientation;
}

export const getMenuAtual = () => {
    return menu;
}

export const GetDeleteMode = () => {
    return deleteMode;
}


const reset = () => {
    menu = 1;
    destroyTable();
}

const config = () => {
    menu = 2;
    destroyTable()
    createTable()
    initPlayerShips()
}

const setEventsShip = () => {
    let crusador = document.getElementById('crusador');
    let encolracado = document.getElementById('encolraçado');
    let porta_aviao = document.getElementById('porta-aviao');
    crusador?.addEventListener('dragstart', (event: DragEvent) => {
        event.dataTransfer?.setData("text/plain", 'crusador')
        shipCollected = 'crusador'
    })
    crusador?.addEventListener("dragend", dragEndFunction)
    encolracado?.addEventListener('dragstart', (event: DragEvent) => {
        event.dataTransfer?.setData("text/plain", 'encolracado')
        shipCollected = 'encolracado'
    })
    encolracado?.addEventListener("dragend", dragEndFunction)
    porta_aviao?.addEventListener('dragstart', (event: DragEvent) => {
        event.dataTransfer?.setData("text/plain", 'porta_aviao')
        shipCollected = 'porta_aviao'
    })
    porta_aviao?.addEventListener("dragend", dragEndFunction)
}

const dragEndFunction = (event: DragEvent) => {
    shipCollected = "";
}

export const getShipCollected = () => {
    return shipCollected
}

const initButtonContinue1 = (continue1: HTMLElement, nextPlayerButton: HTMLElement, continue2: HTMLElement) => {
    if (continue1 && nextPlayerButton) {
        continue1.addEventListener("click", (event: any) => {
            let dimensao: HTMLSelectElement | null = <HTMLSelectElement>document.getElementById("dimensao");
            let radio = <NodeListOf<HTMLInputElement>>document.getElementsByName("playerQuant");
            radio.forEach((value) => {
                if (value.checked) {
                    if (value.value === '1') {
                        player2Name = "Maquina";
                        playerQuant = 1;
                        nextPlayerButton?.classList.add("deactivate")
                        continue2?.classList.remove("deactivate")
                    }
                    else {
                        player2Name = "Player 2";
                        playerQuant = 2;
                        nextPlayerButton?.classList.remove("deactivate")
                        continue2?.classList.add("deactivate")
                    }
                }
            })
            let secondPlayerLayer = document.getElementById('2Player');
            if (secondPlayerLayer) {
                secondPlayerLayer.innerText = player2Name;
            }
            if (dimensao) {
                let size = Number.parseFloat(dimensao.value);
                setTableSize(size);
                createTable()
                moveForwardMenu();
                initPlayerShips()
                setShipQuantScreen();
            }
        })
    }
}

const initContinueButton2 = (continue2: HTMLElement, nextPlayerButton: HTMLElement) => {
    if (continue2) {
        if (nextPlayerButton) {
            nextPlayerButton.addEventListener("click", (event: any) => {
                let player = getPlayersShipQuant()[atualPlayerPos - 1]
                if (player.crusador == 0 && player.encolracado == 0 && player.porta_aviao == 0) {
                    continue2?.classList.remove('deactivate')
                    nextPlayerButton?.classList.add('deactivate')
                    document.getElementById('player1Text')?.classList.replace('playerActived', 'playerNotActived')
                    document.getElementById('2Player')?.classList.replace('playerNotActived', 'playerActived')
                    atualPlayerPos = 2;
                    destroyTable(false)
                    createVisualTable(getAtualPlayerPos());
                    initPlayerShips()
                    setShipQuantScreen();
                }
            })
        }
        continue2.addEventListener("click", (event: any) => {
            let player = getPlayersShipQuant()[atualPlayerPos - 1]
            if (player.crusador == 0 && player.encolracado == 0 && player.porta_aviao == 0) {
                moveForwardMenu();
                startGame();
                initMenu3();
                destroyTable(false);
                createVisualTable(1);
            }
        })
    }
}

const initRemoverButton = () => {
    let remove = document.getElementById('removerButton')
    remove?.addEventListener('click', (event => {
        event.preventDefault();
        if (remove) {
            if (deleteMode) {
                remove.style.borderStyle = 'none'
                deleteMode = false
            }
            else {
                remove.style.borderStyle = 'solid';
                remove.style.borderColor = "red";
                remove.style.borderWidth = '2px'
                deleteMode = true;

            }
        }
    }))
}

const initButtonConfig = (configButton: HTMLElement) => {
    if (configButton) {
        configButton.addEventListener("click", (event: any) => {
            config()
            setPlayerShipQuantVisual()
            showMenu(menu)
            document.getElementById('player1Text')?.classList.replace('playerNotActived', 'playerActived')
            document.getElementById('2Player')?.classList.replace('playerActived', 'playerNotActived')
            atualPlayerPos = 1;
            document.getElementById('winnerText')?.classList.add('deactivate')
        })
    }
}

const initResetButton = (resetButton: HTMLElement) => {
    if (resetButton) {
        resetButton.addEventListener("click", (event: any) => {
            reset()
            showMenu(menu)
            document.getElementById('player1Text')?.classList.replace('playerNotActived', 'playerActived')
            document.getElementById('2Player')?.classList.replace('playerActived', 'playerNotActived')
            document.getElementById('winnerText')?.classList.add('deactivate')
            atualPlayerPos = 1;
        })
    }
}

const initOrientationButton = (vertical: HTMLElement, horizontal: HTMLElement) => {
    if (vertical && horizontal) {
        vertical.classList.add('buttonActivate');
        horizontal.classList.add('buttonDeactivate')
        vertical.addEventListener('click', (event: Event) => {
            setOrientation("vertical");
            vertical?.classList.replace('buttonDeactivate', 'buttonActivate')
            horizontal?.classList.replace('buttonActivate', 'buttonDeactivate')



        })
        horizontal.addEventListener('click', (event: Event) => {
            setOrientation("horizontal");
            horizontal?.classList.replace('buttonDeactivate', 'buttonActivate')
            vertical?.classList.replace('buttonActivate', 'buttonDeactivate')
        })
    }
}

const initPlayerShips = () => {
    let crus = 0;
    let enc = 0;
    let por = 0;

    switch (getTableSize()) {
        case 6:
        case 7:
        case 8:
            crus = 3;
            enc = 2;
            por = 1;
            break;
        case 9:
        case 10:
            crus = 5;
            enc = 3;
            por = 1;
            break;
        case 11:
        case 12:
            crus = 6;
            enc = 4;
            por = 2;
            break;
        default:
            console.log("eita porra como você fez isso ???")
    }

    player1Ship = {
        crusador: crus,
        encolracado: enc,
        porta_aviao: por
    }
    player1ShipInGame = {
        crusador: crus,
        encolracado: enc,
        porta_aviao: por
    }
    player2Ship = {
        crusador: crus,
        encolracado: enc,
        porta_aviao: por
    }
    player2ShipInGame = {
        crusador: crus,
        encolracado: enc,
        porta_aviao: por
    }
}

const setShipQuantScreen = () => {
    let crusadorQuant = document.getElementById('crusadorQuant') as HTMLElement;
    let encolracadoQuant = document.getElementById('encolracadoQuant') as HTMLElement;
    let porta_aviaoQuant = document.getElementById('porta_aviaoQuant') as HTMLElement;
    if (getAtualPlayerPos() == 1) {
        crusadorQuant.innerText = player1Ship.crusador.toString()
        encolracadoQuant.innerText = player1Ship.encolracado.toString();
        porta_aviaoQuant.innerText = player1Ship.porta_aviao.toString();
    }
    else {
        crusadorQuant.innerText = player2Ship.crusador.toString()
        encolracadoQuant.innerText = player2Ship.encolracado.toString();
        porta_aviaoQuant.innerText = player2Ship.porta_aviao.toString();
    }

}

export const getPlayersShipQuant = () => {
    return [player1Ship, player2Ship]
}

export const getPlayerShipInGame = () => {
    return [player1ShipInGame, player2ShipInGame]
}

export const setPlayerShipInGame = (player1: playerShipCount, player2: playerShipCount) => {
    player1ShipInGame = player1;
    player2ShipInGame = player2;
}

export const removePlayerShip = (ship: string) => {
    let player;
    if (atualPlayerPos == 1) {
        player = player1Ship
    } else {
        player = player2Ship;
    }
    if (ship == 'crusador') {
        if (player.crusador == 0) {
            return false;
        }
        player.crusador -= 1
    }
    if (ship == 'encolracado') {
        if (player.encolracado == 0) {
        }
        player.encolracado -= 1
    }
    if (ship == 'porta_aviao') {
        if (player.porta_aviao == 0) {
            return false
        }
        player.porta_aviao -= 1
    }
    setShipQuantScreen()
    return true;
}

export const AdicionarPlayerShip = (ship: string) => {
    let player;
    if (atualPlayerPos == 1) {
        player = player1Ship
    } else {
        player = player2Ship;
    }
    if (ship == 'crusador') {
        player.crusador += 1
    }
    if (ship == 'encolracado') {
        player.encolracado += 1
    }
    if (ship == 'porta_aviao') {
        player.porta_aviao += 1
    }
    setShipQuantScreen()
}

const showMenu = (index: number) => {
    let conf = document.getElementById("menuConf");
    let post = document.getElementById("menuPos");
    let game = document.getElementById("menuGame");
    if (conf && post && game) {
        conf.style.display = index == 1 ? 'flex' : 'none'
        post.style.display = index == 2 ? 'flex' : 'none'
        game.style.display = index == 3 ? 'flex' : 'none'
    }
}

export const initMenu3 = () => {
    setPlayerShipQuantVisual()
}

export const setPlayerShipQuantVisual = () => {
    
    let cruQ = document.getElementById('cQ')
    let encQ = document.getElementById('eQ')
    let cPAQ = document.getElementById('paQ')
    let cruQ2 = document.getElementById('cQ2')
    let encQ2 = document.getElementById('eQ2')
    let cPAQ2 = document.getElementById('paQ2')
    if(cruQ && encQ && cPAQ){
        cruQ.innerText = player1ShipInGame.crusador.toString();
        encQ.innerText = player1ShipInGame.encolracado.toString();
        cPAQ.innerText = player1ShipInGame.porta_aviao.toString();
    }
    if(cruQ2 && encQ2 && cPAQ2){
        cruQ2.innerText = player2ShipInGame.crusador.toString();
        encQ2.innerText = player2ShipInGame.encolracado.toString();
        cPAQ2.innerText = player2ShipInGame.porta_aviao.toString(); 
    }
}

export const playerAtualInGameVisual = (player : number) => {
    let player1 = document.getElementById('player1InGame')
    let player2 = document.getElementById('player2InGame')
    if(player1 && player2){
        player1.style.fontWeight = player == 0 ? 'bold' : 'lighter'
        player2.style.fontWeight = player == 1 ? 'bold' : 'lighter'
    }
}