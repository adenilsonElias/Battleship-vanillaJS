import { initTable } from "./table.js"
import { initMenu } from './menu.js'


document.addEventListener("readystatechange", (event: any) => {
    if (event.target.readyState == "complete") {
        initMenu();
        initTable();
        // initGame();
    }

})