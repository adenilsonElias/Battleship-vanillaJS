import { initTable } from "./table.js"
import { initMenu } from './menu.js'
import { initGame } from "./game.js";

document.addEventListener("readystatechange", (event: any) => {
    if (event.target.readyState == "complete") {
        initMenu();
        initTable();
        // initGame();
    }

})

