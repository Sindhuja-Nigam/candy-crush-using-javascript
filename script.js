let board = [];
let rows = 9;
let columns = 9;

let score = 0;

let candies = [
    "blue.png",
    "green.png",
    "orange.png",
    "purple.png",
    "red.png",
    "yellow.png"
];

window.onload = function () {
    startGame();

    // Recheck matches every 100 ms
    window.setInterval(function () {
        crushThree();
        slideCandies();
        generateCandies();
    }, 100);
};

function startGame() {
    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement("img");
            tile.id = r.toString() + "-" + c.toString();
            tile.src = getRandomCandy();

            // Drag & Drop Event Listeners
            tile.addEventListener("dragstart", dragStart);
            tile.addEventListener("dragover", dragOver);
            tile.addEventListener("dragenter", dragEnter);
            tile.addEventListener("dragleave", dragLeave);
            tile.addEventListener("drop", dragDrop);
            tile.addEventListener("dragend", dragEnd);

            document.getElementById("board").append(tile);
            row.push(tile);
        }
        board.push(row);
    }
    document.getElementById("score").innerText = score;
}

function getRandomCandy() {
    return candies[Math.floor(Math.random() * candies.length)];
}

// Drag functionality
let currTile;
let otherTile;

function dragStart() {
    currTile = this;
}
function dragOver(e) {
    e.preventDefault();
}
function dragEnter(e) {
    e.preventDefault();
}
function dragLeave() {}
function dragDrop() {
    otherTile = this;
}
function dragEnd() {
    if (!currTile || !otherTile) return;

    let currCoords = currTile.id.split("-");
    let r1 = parseInt(currCoords[0]);
    let c1 = parseInt(currCoords[1]);

    let otherCoords = otherTile.id.split("-");
    let r2 = parseInt(otherCoords[0]);
    let c2 = parseInt(otherCoords[1]);

    let isAdjacent = Math.abs(r1 - r2) + Math.abs(c1 - c2) === 1;

    if (isAdjacent) {
        let temp = currTile.src;
        currTile.src = otherTile.src;
        otherTile.src = temp;

        if (isMatch()) {
            return;
        } else {
            // Invalid move
            temp = currTile.src;
            currTile.src = otherTile.src;
            otherTile.src = temp;
        }
    }
}

// Check for any match
function isMatch() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns - 2; c++) {
            let t1 = board[r][c];
            let t2 = board[r][c + 1];
            let t3 = board[r][c + 2];
            if (
                t1.src === t2.src &&
                t2.src === t3.src &&
                !t1.src.includes("blank")
            ) return true;
        }
    }

    for (let c = 0; c < columns; c++) {
        for (let r = 0; r < rows - 2; r++) {
            let t1 = board[r][c];
            let t2 = board[r + 1][c];
            let t3 = board[r + 2][c];
            if (
                t1.src === t2.src &&
                t2.src === t3.src &&
                !t1.src.includes("blank")
            ) return true;
        }
    }
    return false;
}

// Crush 3 or more candies
function crushThree() {
    let crushed = false;

    // Horizontal
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns - 2; c++) {
            let t1 = board[r][c];
            let t2 = board[r][c + 1];
            let t3 = board[r][c + 2];

            if (
                t1.src === t2.src &&
                t2.src === t3.src &&
                !t1.src.includes("blank")
            ) {
                addCrushEffect(t1);
                addCrushEffect(t2);
                addCrushEffect(t3);
                crushed = true;
                score += 30;
            }
        }
    }

    // Vertical
    for (let c = 0; c < columns; c++) {
        for (let r = 0; r < rows - 2; r++) {
            let t1 = board[r][c];
            let t2 = board[r + 1][c];
            let t3 = board[r + 2][c];

            if (
                t1.src === t2.src &&
                t2.src === t3.src &&
                !t1.src.includes("blank")
            ) {
                addCrushEffect(t1);
                addCrushEffect(t2);
                addCrushEffect(t3);
                crushed = true;
                score += 30;
            }
        }
    }

    if (crushed) {
        document.getElementById("score").innerText = score;
    }
}

// Apply visual effect and blank tile
function addCrushEffect(tile) {
    tile.classList.add("crushed");
    tile.addEventListener(
        "animationend",
        () => {
            tile.classList.remove("crushed");
            tile.src = "blank.png";
        },
        { once: true }
    );
}

// Move candies down into blanks
function slideCandies() {
    for (let c = 0; c < columns; c++) {
        let pointer = rows - 1;
        for (let r = rows - 1; r >= 0; r--) {
            if (!board[r][c].src.includes("blank")) {
                board[pointer][c].src = board[r][c].src;
                pointer -= 1;
            }
        }

        // Fill remaining with blanks
        for (let r = pointer; r >= 0; r--) {
            board[r][c].src = "blank.png";
        }
    }
}

// Generate random candies at the top
function generateCandies() {
    for (let c = 0; c < columns; c++) {
        for (let r = 0; r < rows; r++) {
            if (board[r][c].src.includes("blank")) {
                board[r][c].src = getRandomCandy();
            }
        }
    }
}
