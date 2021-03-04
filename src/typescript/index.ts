import { Table } from "./table.js"
import { Menu } from './menu.js'
import { Game } from "./game.js"
import { IA } from "./IA.js"


document.addEventListener("readystatechange", (event: any) => {
    if (event.target.readyState == "complete") {
        const menu = new Menu()
        const table = new Table(menu)
        const game = new Game(table, menu)
        const ia = new IA(table, game, menu)
    }
})