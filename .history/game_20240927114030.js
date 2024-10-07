"use strict";

// Constants
const WIDTH = 15;
const HEIGHT = 15;
const COIN_INCREASE_RATE = 30; // frames
const COIN_AMOUNT = 1;

// Colors
const P1_COLOR = 0xCD5C5C;
const P2_COLOR = 0x4169E1;
const FLOOR_COLOR = PS.COLOR_WHITE;

// Key bindings
const P1_KEYS = { UP: 87, DOWN: 83, LEFT: 65, RIGHT: 68, BUY: 69 }; // W, S, A, D, E
const P2_KEYS = { UP: , DOWN: 40, LEFT: 37, RIGHT: 39, BUY: 190 }; // Arrow keys, >

// Game variables
let players = [
    { coins: 0, x: 2, y: HEIGHT - 2, color: P1_COLOR, keys: P1_KEYS },
    { coins: 0, x: WIDTH - 3, y: 1, color: P2_COLOR, keys: P2_KEYS }
];

// PS.init - Initialize the game
PS.init = function (system, options) {
    PS.gridSize(WIDTH, HEIGHT);
    PS.gridColor(FLOOR_COLOR);
    PS.statusText("Collect coins and buy fighters!");
    PS.timerStart(COIN_INCREASE_RATE, handleCoinIncrease);
    drawPlayers();
};

// Draw players
function drawPlayers() {
    players.forEach(player => {
        PS.color(player.x, player.y, player.color);
    });
}

// Handle key press
PS.keyDown = function (key, shift, ctrl, options) {
    PS.statusText(key);
    players.forEach((player, index) => {
        let dx = 0, dy = 0;

        if (key === player.keys.UP) {
            dy = -1;
        } else if (key === player.keys.DOWN) {
            dy = 1;
        } else if (key === player.keys.LEFT) {
            dx = -1;
        } else if (key === player.keys.RIGHT) {
            dx = 1;
        } else if (key === player.keys.BUY && player.coins >= 10) {
            PS.statusText("Player " + (index + 1) + " bought a fighter!");
            player.coins -= 10;
            return;
        }

        movePlayer(index, dx, dy);
    });
};

// Move player
function movePlayer(index, dx, dy) {
    let player = players[index];
    let nx = player.x + dx;
    let ny = player.y + dy;

    // Check boundaries
    if (nx < 0 || nx >= WIDTH || ny < 0 || ny >= HEIGHT) return;

    // Move player
    PS.color(player.x, player.y, FLOOR_COLOR);
    player.x = nx;
    player.y = ny;
    PS.color(nx, ny, player.color);
}

// Handle coin increase
function handleCoinIncrease() {
    players.forEach((player, index) => {
        player.coins += COIN_AMOUNT;
        PS.statusText("Player " + (index + 1) + " Coins: " + player.coins);
    });
}

PS.keyUp = function (key, shift, ctrl, options) {
    // This function can be used to handle key release events
};
