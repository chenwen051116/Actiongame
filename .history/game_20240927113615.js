"use strict";

// Define constants for the game
const W = 15, H = 15; // Grid width and height
const MAX_UNITS = 6;  // Maximum units per player
const COIN_INCREASE_INTERVAL = 60;  // Coin increase every 60 frames

// Unit and Player Colors
const P1_UNIT_COLOR = 0xCD5C5C, P2_UNIT_COLOR = 0x4169E1;
const P1_KEY_CODES = { UP: 87, DOWN: 83, LEFT: 65, RIGHT: 68, SWITCH: 81, BUY: 69 }; // W, S, A, D, Q, E
const P2_KEY_CODES = { UP: 38, DOWN: 40, LEFT: 37, RIGHT: 39, SWITCH: 188, BUY: 190 }; // Arrow keys, <, >

// Game State
let players = [
    { coins: 0, fighters: [], selected: 0 },
    { coins: 0, fighters: [], selected: 0 }
];

// Initialize Perlenspiel grid
PS.init = function (system, options) {
    PS.gridSize(W, H);
    PS.gridColor(PS.COLOR_GRAY_DARK);
    PS.statusColor(PS.COLOR_WHITE);
    PS.statusText("Player 1's Turn");

    setupGame();
    PS.timerStart(COIN_INCREASE_INTERVAL, increaseCoins);
};

// Set up initial game state
function setupGame() {
    for (let p = 0; p < 2; p++) {
        for (let i = 0; i < MAX_UNITS; i++) {
            createFighter(p, Math.floor(W / (MAX_UNITS + 1)) * (i + 1), (p === 0 ? 1 : H - 2));
        }
    }
}

// Create a fighter
function createFighter(playerIndex, x, y) {
    if (players[playerIndex].fighters.length >= MAX_UNITS) return;
    let color = playerIndex === 0 ? P1_UNIT_COLOR : P2_UNIT_COLOR;
    players[playerIndex].fighters.push({ x, y, alive: true });
    PS.color(x, y, color);
}

// Handle key input
PS.keyDown = function (key, shift, ctrl, options) {
    let currentPlayer = keyData(key);
    if (!currentPlayer) return;

    let fighter = players[currentPlayer.index].fighters[players[currentPlayer.index].selected];
    if (!fighter || !fighter.alive) return;

    switch (key) {
        case currentPlayer.keys.UP:
            moveFighter(currentPlayer.index, 0, -1);
            break;
        case currentPlayer.keys.DOWN:
            moveFighter(currentPlayer.index, 0, 1);
            break;
        case currentPlayer.keys.LEFT:
            moveFighter(currentPlayer.index, -1, 0);
            break;
        case currentPlayer.keys.RIGHT:
            moveFighter(currentPlayer.index, 1, 0);
            break;
        case currentPlayer.keys.SWITCH:
            switchFighter(currentPlayer.index);
            break;
        case currentPlayer.keys.BUY:
            buyFighter(currentPlayer.index);
            break;
    }
};

// Move fighter
function moveFighter(playerIndex, dx, dy) {
    let fighter = players[playerIndex].fighters[players[playerIndex].selected];
    let newX = fighter.x + dx;
    let newY = fighter.y + dy;
    if (newX >= 0 && newX < W && newY >= 0 && newY < H) {
        PS.color(fighter.x, fighter.y, PS.COLOR_GRAY_DARK); // Erase the old position
        fighter.x = newX;
        fighter.y = newY;
        PS.color(newX, newY, playerIndex === 0 ? P1_UNIT_COLOR : P2_UNIT_COLOR); // Draw new position
    }
}

// Switch selected fighter
function switchFighter(playerIndex) {
    let player = players[playerIndex];
    player.selected = (player.selected + 1) % player.fighters.length;
    PS.statusText(`Player ${playerIndex + 1} selected fighter ${player.selected + 1}`);
}

// Buy new fighter
function buyFighter(playerIndex) {
    if (players[playerIndex].coins >= 100 && players[playerIndex].fighters.length < MAX_UNITS) {
        createFighter(playerIndex, Math.floor(Math.random() * W), playerIndex === 0 ? 1 : H - 2);
        players[playerIndex].coins -= 100;
        PS.statusText(`Player ${playerIndex + 1} buys a new fighter`);
    } else {
        PS.statusText(`Not enough coins or maximum units reached`);
    }
}

// Increase coins over time
function increaseCoins() {
    for (let p = 0; p < players.length; p++) {
        players[p].coins += 1; // Increase each player's coins
        PS.statusText(`Player ${p + 1} Coins: ${players[p].coins}`);
    }
}

// Determine which player the key belongs to
function keyData(key) {
    if (Object.values(P1_KEY_CODES).includes(key)) {
        return { index: 0, keys: P1_KEY_CODES };
    } else if (Object.values(P2_KEY_CODES).includes(key)) {
        return { index: 1, keys: P2_KEY_CODES };
    }
    return null;
}
