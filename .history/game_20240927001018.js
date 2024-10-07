"use strict";

const game = (function () {
    // Constants
    const GRID_WIDTH = 15;
    const GRID_HEIGHT = 15;
    const MAX_UNITS = 6;
    const COIN_INCREASE_INTERVAL = 5000; // in milliseconds

    // Game Variables
    let grid, units, coins, activeUnitIndices;

    // Initial Setup
    function setup() {
        PS.gridSize(GRID_WIDTH, GRID_HEIGHT);
        units = {
            1: [],
            2: []
        };
        coins = {
            1: 0,
            2: 0
        };
        activeUnitIndices = {
            1: 0,
            2: 0
        };
        PS.timerStart(COIN_INCREASE_INTERVAL / 100, incrementCoins);
        drawGrid();
    }

    // Draw the initial grid
    function drawGrid() {
        for (let x = 0; x < GRID_WIDTH; x++) {
            for (let y = 0; y < GRID_HEIGHT; y++) {
                PS.color(x, y, PS.COLOR_WHITE);
            }
        }
    }

    // Move unit
    function moveUnit(player, dx, dy) {
        let unit = units[player][activeUnitIndices[player]];
        let newX = unit.x + dx;
        let newY = unit.y + dy;

        if (newX >= 0 && newX < GRID_WIDTH && newY >= 0 && newY < GRID_HEIGHT) {
            PS.color(unit.x, unit.y, PS.COLOR_WHITE); // Clear old position
            unit.x = newX;
            unit.y = newY;
            PS.color(newX, newY, unit.color); // Draw new position
        }
    }

    // Switch active unit
    function switchUnit(player, direction) {
        let count = units[player].length;
        let index = (activeUnitIndices[player] + direction + count) % count;
        activeUnitIndices[player] = index;
    }

    // Buy unit
    function buyUnit(player) {
        if (coins[player] >= 10 && units[player].length < MAX_UNITS) {
            units[player].push({
                x: player === 1 ? 0 : GRID_WIDTH - 1,
                y: Math.floor(GRID_HEIGHT / 2),
                color: player === 1 ? PS.COLOR_BLUE : PS.COLOR_RED
            });
            coins[player] -= 10;
            drawUnits(); // Redraw units
        }
    }

    // Increment coins
    function incrementCoins() {
        coins[1]++;
        coins[2]++;
        PS.statusText(`Player 1 Coins: ${coins[1]} | Player 2 Coins: ${coins[2]}`);
    }

    // Draw all units
    function drawUnits() {
        units[1].forEach(unit => PS.color(unit.x, unit.y, unit.color));
        units[2].forEach(unit => PS.color(unit.x, unit.y, unit.color));
    }

    // Key handler
    PS.keyDown = function (key, shift, ctrl, options) {
        switch (key) {
            case PS.KEY_ARROW_UP:
            case 119: // 'w'
                moveUnit(2, 0, -1);
                break;
            case PS.KEY_ARROW_DOWN:
            case 115: // 's'
                moveUnit(2, 0, 1);
                break;
            case PS.KEY_ARROW_LEFT:
            case 97: // 'a'
                moveUnit(2, -1, 0);
                break;
            case PS.KEY_ARROW_RIGHT:
            case 100: // 'd'
                moveUnit(2, 1, 0);
                break;
            case 113: // 'q'
            case 33: // Page Up (Player 2 switch unit backward)
                switchUnit(1, -1);
                break;
            case 101: // 'e'
            case 34: // Page Down (Player 2 switch unit forward)
                switchUnit(1, 1);
                break;
            case 102: // 'f' (Buy Unit for both players)
                buyUnit(1);
                break;
        }
    };

    return {
        init: setup
    };
}());

PS.init = game.init;
