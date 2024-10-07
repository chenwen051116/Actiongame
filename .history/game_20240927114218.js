"use strict";

// Game constants
const GRID_WIDTH = 15, GRID_HEIGHT = 15;
const MAX_UNITS = 6; // Max units per player
const COIN_INCREASE_TIME = 300; // Time in frames for coin increase

// Player configurations
const PLAYERS = [
    { coins: 0, units: [], selectedUnit: 0, controlKeys: { up: 87, down: 83, left: 65, right: 68, switch: 81, buy: 69 } }, // WASD, Q, E for Player 1
    { coins: 0, units: [], selectedUnit: 0, controlKeys: { up: 38, down: 40, left: 37, right: 39, switch: 188, buy: 190 } } // Arrow keys, comma, period for Player 2
];

// Initialize the game grid and set up the game
PS.init = function (system, options) {
    PS.gridSize(GRID_WIDTH, GRID_HEIGHT);
    PS.gridColor(0x303030); // Dark grey background
    initializeGame();
    PS.timerStart(COIN_INCREASE_TIME, increaseCoins);
};

// Initialize units for each player
function initializeGame() {
    for (let i = 0; i < 2; i++) {
        for (let j = 0; j < MAX_UNITS; j++) {
            createUnit(i, 2 + j * 2, i === 0 ? 1 : GRID_HEIGHT - 2);
        }
    }
}

// Create a unit on the grid
function createUnit(playerIndex, x, y) {
    let player = PLAYERS[playerIndex];
    if (player.units.length < MAX_UNITS) {
        player.units.push({ x, y, active: true });
        PS.color(x, y, playerIndex === 0 ? PS.COLOR_RED : PS.COLOR_BLUE); // Color units red or blue
    }
}

// Handle key presses for movement and actions
PS.keyDown = function (key, shift, ctrl, options) {
    
    PLAYERS.forEach((player, index) => {
        let keys = player.controlKeys;
        let unit = player.units[player.selectedUnit];
        if (key === keys.up) moveUnit(index, 0, -1);
        else if (key === keys.down) moveUnit(index, 0, 1);
        else if (key === keys.left) moveUnit(index, -1, 0);
        else if (key === keys.right) moveUnit(index, 1, 0);
        else if (key === keys.switch) switchUnit(index);
        else if (key === keys.buy) buyUnit(index);
    });
};

// Move the currently selected unit
function moveUnit(playerIndex, dx, dy) {
    let player = PLAYERS[playerIndex];
    let unit = player.units[player.selectedUnit];
    let newX = unit.x + dx, newY = unit.y + dy;
    if (newX >= 0 && newX < GRID_WIDTH && newY >= 0 && newY < GRID_HEIGHT) {
        PS.color(unit.x, unit.y, PS.COLOR_GRAY); // Clear the old position
        unit.x = newX;
        unit.y = newY;
        PS.color(newX, newY, playerIndex === 0 ? PS.COLOR_RED : PS.COLOR_BLUE); // Move to new position
    }
}

// Switch the selected unit
function switchUnit(playerIndex) {
    let player = PLAYERS[playerIndex];
    player.selectedUnit = (player.selectedUnit + 1) % player.units.length;
    PS.statusText(`Player ${playerIndex + 1} selected unit ${player.selectedUnit + 1}`);
}

// Buy a new unit if coins are sufficient
function buyUnit(playerIndex) {
    let player = PLAYERS[playerIndex];
    if (player.coins >= 100 && player.units.length < MAX_UNITS) {
        createUnit(playerIndex, playerIndex === 0 ? 0 : GRID_WIDTH - 1, Math.floor(GRID_HEIGHT / 2));
        player.coins -= 100;
        PS.statusText(`Player ${playerIndex + 1} bought a new unit`);
    } else {
        PS.statusText("Not enough coins to buy a new unit");
    }
}

// Increment coins for both players periodically
function increaseCoins() {
    PLAYERS.forEach((player, index) => {
        player.coins++;
        if (index === 0) { // Update status text for Player 1
            PS.statusText(`Player 1 Coins: ${player.coins}`);
        }
    });
}
