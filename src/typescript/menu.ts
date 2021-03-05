
interface playerShipCount {
    "crusador": number;
    "encolracado": number;
    "porta_aviao": number
}



export class Menu {
    player1ShipInGame: playerShipCount | null = null;
    player2ShipInGame: playerShipCount | null = null;
    player1Ship: playerShipCount | null = null;
    player2Ship: playerShipCount | null = null;
    menu: number = 1;
    player2Name: string = "";
    atualPlayerPos = 0;
    orientation = 'vertical'
    deleteMode = false;
    shipCollected = "";
    playerQuant = 0;
    continue1 = document.getElementById('continue1') as HTMLElement;
    nextPlayerButton = document.getElementById('nextPlayerButton') as HTMLElement;
    continue2 = document.getElementById("continue2") as HTMLElement;
    configButton = document.getElementById("config") as HTMLElement;
    resetButton = document.getElementById("reset") as HTMLElement;
    vertical = document.getElementById('vertical') as HTMLElement;
    horizontal = document.getElementById('horizontal') as HTMLElement;
    showtable: Function
    startGame: Function
    randonPos: Function
    posCPU : Function
    updateTableScreen : Function
    

    constructor() {
        this.showMenu(this.menu)
        this.setEventsShip()
        this.initButtonContinue1()
        this.initContinueButton2()
        this.initButtonConfig()
        this.initResetButton()
        this.initRemoverButton()
        this.initOrientationButton()
        this.initButtonRandon()
        this.showtable = () => {
            console.log("Nenhuma função adicionada")
        }
        this.startGame = () => {
            console.log("Nenhuma função adicionada")
        }
        this.randonPos = () => {
            console.log("Nenhuma função adicionada")
        }
        this.posCPU = () => {
            console.log("Nenhuma função adicionada")
        }
        this.updateTableScreen = () => {
            console.log("Nenhuma função adicionada")
        }
    }


    /** Adiciona eventos de drag para os barcos do menu */
    setEventsShip = () => {
        let crusador = document.getElementById('crusador');
        let encolracado = document.getElementById('encolraçado');
        let porta_aviao = document.getElementById('porta-aviao');
        crusador?.addEventListener('dragstart', (event: DragEvent) => {
            event.dataTransfer?.setData("text/plain", 'crusador')
            this.shipCollected = 'crusador'
        })
        crusador?.addEventListener("dragend", this.dragEndFunction)
        encolracado?.addEventListener('dragstart', (event: DragEvent) => {
            event.dataTransfer?.setData("text/plain", 'encolracado')
            this.shipCollected = 'encolracado'
        })
        encolracado?.addEventListener("dragend", this.dragEndFunction)
        porta_aviao?.addEventListener('dragstart', (event: DragEvent) => {
            event.dataTransfer?.setData("text/plain", 'porta_aviao')
            this.shipCollected = 'porta_aviao'
        })
        porta_aviao?.addEventListener("dragend", this.dragEndFunction)
    }

    /** Inicializa o botão continue */
    initButtonContinue1 = () => {
        this.continue1.addEventListener("click", (event: any) => {
            let radio = <NodeListOf<HTMLInputElement>>document.getElementsByName("playerQuant");
            radio.forEach((value) => {
                if (value.checked) {
                    if (value.value === '1') {
                        this.player2Name = "Maquina";
                        this.playerQuant = 0;
                        this.nextPlayerButton?.classList.add("deactivate")
                        this.continue2.classList.remove("deactivate")
                    }
                    else {
                        this.player2Name = "Player 2";
                        this.playerQuant = 1;
                        this.nextPlayerButton?.classList.remove("deactivate")
                        this.continue2.classList.add("deactivate")
                    }
                }
            })
            let secondPlayerLayer = document.getElementById('2Player');
            if (secondPlayerLayer) {
                secondPlayerLayer.innerText = this.player2Name;
            }

            this.moveForwardMenu();
            this.initPlayerShips()
            this.setShipQuantScreen();

        })
    }

    /** Adiciona eventos para o Continue 2 e nextPlayer */
    initContinueButton2 = () => {
        this.nextPlayerButton.addEventListener("click", (event: any) => {
            let player = this.atualPlayerPos == 0 ? this.player1Ship!! : this.player2Ship!!

            if (player.crusador == 0 && player.encolracado == 0 && player.porta_aviao == 0) {
                this.continue2.classList.remove('deactivate')
                this.nextPlayerButton?.classList.add('deactivate')
                document.getElementById('player1Text')?.classList.replace('playerActived', 'playerNotActived')
                document.getElementById('2Player')?.classList.replace('playerNotActived', 'playerActived')
                this.atualPlayerPos = 1;
                this.initPlayerShips()
                this.setShipQuantScreen();
                this.updateTableScreen()
            }
        })
        this.continue2.addEventListener("click", (event: any) => {
            console.log(this.atualPlayerPos)
            let player = this.atualPlayerPos == 0 ? this.player1Ship!! : this.player2Ship!!
            console.log("player", player)
            if (player.crusador == 0 && player.encolracado == 0 && player.porta_aviao == 0) {
                this.moveForwardMenu();
                if (this.playerQuant == 0) {
                    this.posCPU();
                }
                this.startGame();
                this.initMenu3();
            }
        })
    }

    /** Adiciona os eventos no botão config */
    initButtonConfig = () => {
        this.configButton.addEventListener("click", (event: any) => {
            this.atualPlayerPos = 0;
            this.config()
            this.showMenu(this.menu)
            this.setShipQuantScreen()
            document.getElementById('player1Text')?.classList.replace('playerNotActived', 'playerActived')
            document.getElementById('2Player')?.classList.replace('playerActived', 'playerNotActived')
            document.getElementById('winnerText')?.classList.add('deactivate')
            this.showtable()
        })
    }

    /** Adicona os enventos do botão reset */
    initResetButton = () => {
        this.resetButton.addEventListener("click", (event: any) => {
            this.atualPlayerPos = 0;
            this.reset()
            this.showMenu(this.menu)
            document.getElementById('player1Text')?.classList.replace('playerNotActived', 'playerActived')
            document.getElementById('2Player')?.classList.replace('playerActived', 'playerNotActived')
            document.getElementById('winnerText')?.classList.add('deactivate')
            this.showtable()
        })

    }

    /** Adiciona os eventos dos botoẽs de oritentação */
    initOrientationButton = () => {
        this.vertical.classList.add('buttonActivate');
        this.horizontal.classList.add('buttonDeactivate')
        this.vertical.addEventListener('click', (event: Event) => {
            this.orientation = "vertical";
            this.vertical.classList.replace('buttonDeactivate', 'buttonActivate')
            this.horizontal.classList.replace('buttonActivate', 'buttonDeactivate')



        })
        this.horizontal.addEventListener('click', (event: Event) => {
            this.orientation = "horizontal";
            this.horizontal.classList.replace('buttonDeactivate', 'buttonActivate')
            this.vertical.classList.replace('buttonActivate', 'buttonDeactivate')
        })

    }

    /** Adiciona os eventos no botão remover */
    initRemoverButton = () => {
        let remove = document.getElementById('removerButton')
        remove!!.addEventListener('click', (event => {
            event.preventDefault();
            if (remove) {
                if (this.deleteMode) {
                    remove.style.borderStyle = 'none'
                    this.deleteMode = false
                }
                else {
                    remove.style.borderStyle = 'solid';
                    remove.style.borderColor = "red";
                    remove.style.borderWidth = '2px'
                    this.deleteMode = true;

                }
            }
        }))
    }

    moveForwardMenu = () => {
        if (this.menu < 3) {
            this.menu += 1;
            this.showMenu(this.menu);
        }
    }

    moveBackMenu = () => {
        if (this.menu > 1) {
            this.menu -= 1;
            this.showMenu(this.menu);
        }
    }

    reset = () => {
        this.menu = 1;
    }

    config = () => {
        this.menu = 2;
        this.initPlayerShips()
    }

    dragEndFunction = (event: DragEvent) => {
        this.shipCollected = "";
    }

    initPlayerShips = () => {
        let crus = 5;
        let enc = 3;
        let por = 1;

        this.player1Ship = {
            crusador: crus,
            encolracado: enc,
            porta_aviao: por
        }
        this.player1ShipInGame = {
            crusador: crus,
            encolracado: enc,
            porta_aviao: por
        }
        this.player2Ship = {
            crusador: crus,
            encolracado: enc,
            porta_aviao: por
        }
        this.player2ShipInGame = {
            crusador: crus,
            encolracado: enc,
            porta_aviao: por
        }
    }

    setShipQuantScreen = () => {
        let crusadorQuant = document.getElementById('crusadorQuant') as HTMLElement;
        let encolracadoQuant = document.getElementById('encolracadoQuant') as HTMLElement;
        let porta_aviaoQuant = document.getElementById('porta_aviaoQuant') as HTMLElement;
        if (this.atualPlayerPos == 0) {
            crusadorQuant.innerText = this.player1Ship!!.crusador.toString()
            encolracadoQuant.innerText = this.player1Ship!!.encolracado.toString();
            porta_aviaoQuant.innerText = this.player1Ship!!.porta_aviao.toString();
        }
        else {
            crusadorQuant.innerText = this.player2Ship!!.crusador.toString()
            encolracadoQuant.innerText = this.player2Ship!!.encolracado.toString();
            porta_aviaoQuant.innerText = this.player2Ship!!.porta_aviao.toString();
        }

    }

    removePlayerShip = (ship: string) => {
        let player;
        if (this.atualPlayerPos == 0) {
            player = this.player1Ship!!;
        } else {
            player = this.player2Ship!!;
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
        this.setShipQuantScreen()
        return true;
    }

    AdicionarPlayerShip = (ship: string) => {
        let player;
        if (this.atualPlayerPos == 0) {
            player = this.player1Ship!!;
        } else {
            player = this.player2Ship!!;
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
        this.setShipQuantScreen()
    }

    showMenu = (index: number) => {
        console.log(index)
        let conf = document.getElementById("menuConf")!!;
        let post = document.getElementById("menuPos")!!;
        let game = document.getElementById("menuGame")!!;
        conf.style.display = index == 1 ? 'flex' : 'none'
        post.style.display = index == 2 ? 'flex' : 'none'
        game.style.display = index == 3 ? 'flex' : 'none'
    }

    initMenu3 = () => {
        this.setPlayerShipQuantVisual()
    }

    setPlayerShipQuantVisual = () => {

        let cruQ = document.getElementById('cQ')
        let encQ = document.getElementById('eQ')
        let cPAQ = document.getElementById('paQ')
        let cruQ2 = document.getElementById('cQ2')
        let encQ2 = document.getElementById('eQ2')
        let cPAQ2 = document.getElementById('paQ2')
        if (cruQ && encQ && cPAQ) {
            cruQ.innerText = this.player1ShipInGame!!.crusador.toString();
            encQ.innerText = this.player1ShipInGame!!.encolracado.toString();
            cPAQ.innerText = this.player1ShipInGame!!.porta_aviao.toString();
        }
        if (cruQ2 && encQ2 && cPAQ2) {
            cruQ2.innerText = this.player2ShipInGame!!.crusador.toString();
            encQ2.innerText = this.player2ShipInGame!!.encolracado.toString();
            cPAQ2.innerText = this.player2ShipInGame!!.porta_aviao.toString();
        }
    }

    playerAtualInGameVisual = (player: number) => {
        let player1 = document.getElementById('player1InGame')
        let player2 = document.getElementById('player2InGame')
        if (player1 && player2) {
            player1.style.fontWeight = player == 0 ? 'bold' : 'lighter'
            player2.style.fontWeight = player == 1 ? 'bold' : 'lighter'
        }
    }

    initButtonRandon = () => {
        document.getElementById("aleatorioButton")?.addEventListener('click', (event: Event) => {
            console.log("chamei")
            event.preventDefault()
            this.randonPos()
        })
    }


}

export const initMenu = () => {
    // showMenu(menu)
}

