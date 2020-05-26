const boardHeight = 42
const boardWidth = 80

const board = document.getElementById("board")
const rulesTable = document.getElementById("rulesTbl")
const boardArray = new Array()

const ruleElements = [2]
ruleElements[0] = [9]
ruleElements[1] = [9]

var simulationID = 0
var running = false

var generationCounter = 0


class Cell {
    constructor(x, y, td) {
        this.x = x
        this.y = y
        this.td = td

        this.alive = false
        this.nextState = false

        this.td.onmousedown = (e) => {
            this.swap()
        } 
            
    }

    neighbours() {
        let result = 0

        if (this.y > 0 && boardArray[this.x][this.y - 1].alive) result++
        if (this.x > 0 && boardArray[this.x - 1][this.y].alive) result++
        if (this.x > 0 && this.y > 0 && boardArray[this.x - 1][this.y - 1].alive) result++
        if (this.y < boardWidth - 1 && boardArray[this.x][this.y + 1].alive) result++
        if (this.x < boardHeight - 1 && boardArray[this.x + 1][this.y].alive) result++
        if (this.x < boardHeight - 1 && this.y < boardWidth - 1 && boardArray[this.x + 1][this.y + 1].alive) result++
        if (this.x < boardHeight - 1 && this.y > 0 && boardArray[this.x + 1][this.y - 1].alive) result++
        if (this.y < boardWidth - 1 && this.x > 0 && boardArray[this.x - 1][this.y + 1].alive) result++

        console.log(result);
        return result
    }

    setNextState(value) {
        this.nextState = value
    }

    setAlive(value) {
        this.alive = value

        this.td.classList = ""
        if (this.alive) this.td.classList.add("alive")
        else this.td.classList.add("dead")
    }

    swap() {
        this.setAlive(!this.alive)
    }
}

toggleRulesPanel = function() {
    let panel = document.getElementById("rulesPnl")

    if (panel.style.display === "block")
        panel.style.display = "none"
    else
        panel.style.display = "block"
}

nextGeneration = function() {
    for (let i = 0; i < boardHeight; i++) {
        for (let j = 0; j < boardWidth; j++) {
            let e = boardArray[i][j]
            let neighbours = e.neighbours()

            // if (neighbours < 2 && e.alive) e.setNextState(false)
            // else if (neighbours > 3 && e.alive) e.setNextState(false)
            // else if (neighbours == 3 && !e.alive) e.setNextState(true)
            // else if ((neighbours == 2 || neighbours == 3) && e.alive) e.setNextState(true)

            
            let tr = null

            if (e.alive)
                tr = ruleElements[1][neighbours]
            else 
                tr = ruleElements[0][neighbours]

            e.setNextState(tr.classList.contains("aliveRule"))

        }
    }

    for (let i = 0; i < boardHeight; i++) {
        for (let j = 0; j < boardWidth; j++) {
            let e = boardArray[i][j]
            e.setAlive(e.nextState)
        }
    }
    
    document.getElementById("generationCounter").textContent = "Generation: " + generationCounter++
}

simulate = function() {
    if (!running) {
        simulationID = setInterval(nextGeneration, 100)
        running = true

        document.getElementById("startStopBtn").innerText = "Stop Simulation"
        document.getElementById("clearBtn").disabled = true
        document.getElementById("randomizeBtn").disabled = true
    }
    else {
        clearInterval(simulationID)
        running = false

        document.getElementById("startStopBtn").innerText = "Start Simulation"
        document.getElementById("clearBtn").disabled = false
        document.getElementById("randomizeBtn").disabled = false
    }
}

clear = function() {
    for (let i = 0; i < boardHeight; i++) {
        for (let j = 0; j < boardWidth; j++) {
            let e = boardArray[i][j]
            e.setAlive(false)
            e.setNextState(false)
        }
    }

    document.getElementById("generationCounter").textContent = "Generation: " + 0
    generationCounter = 0
}

randomize = function() {
    clear()

    for (let i = 0; i < boardHeight; i++) {
        for (let j = 0; j < boardWidth; j++) {
            let e = boardArray[i][j]
            let random = Math.random() > 0.5

            e.setAlive(random)
        }
    }
}

ruleSwap = function(td) {
    if (td.classList.contains("deadRule")) {
        td.classList.remove("deadRule")
        td.classList.add("aliveRule")
    }
    else if (td.classList.contains("aliveRule")) {
        td.classList.remove("aliveRule")
        td.classList.add("deadRule")
    }
}

/* Create rules table */
for (let row = 0; row < 3; row++) {
    let tr = document.createElement("tr")
    rulesTable.appendChild(tr)
    for (let col = 0; col < 10; col++) {
        if (row == 0) {
            let td = document.createElement("td")
            td.classList.add("headline")
            tr.appendChild(td)
            if (col == 0) continue
            td.innerText = col - 1
        }  
        else {
            let td = document.createElement("td")
            tr.appendChild(td)
            if (row == 1 && col == 0) {
                td.innerText = "dead"
                td.classList.add("headline")
            }
            else if (row == 2 && col == 0) {
                td.innerText = "alive"
                td.classList.add("headline")
            }
            else {
                ruleElements[row - 1][col - 1] = td
                td.classList.add("deadRule")
                td.onmousedown = (e) => ruleSwap(td);
            }
        }                      
    }
}

/* Set Game of Life rules by default */
ruleSwap(ruleElements[0][3])
ruleSwap(ruleElements[1][2])
ruleSwap(ruleElements[1][3])

/* Create board */
for (let i = 0; i < boardHeight; i++) {
    let tr = document.createElement("tr")
    let rowArray = new Array()
    for (let j = 0; j < boardWidth; j++) {
        let td = document.createElement("td")
        td.classList.add("dead")
        tr.appendChild(td)
        rowArray.push(new Cell(i, j, td))
    }
    board.appendChild(tr)
    boardArray.push(rowArray)
}

document.getElementById("startStopBtn").onclick = simulate
document.getElementById("clearBtn").onclick = clear
document.getElementById("randomizeBtn").onclick = randomize