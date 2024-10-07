// Perlenspiel 3.3 Game Code

/* jshint browser: true, devel: true, esversion: 6, freeze: true */
/* globals PS: true */

"use strict";

const game = (function () {
    const WIDTH = 15; // grid width
    const HEIGHT = 15; // grid height
    const MAX_UNITS = 6; // max units per player
    const UNIT_COST = 10; // cost of one fighter
    const COIN_INTERVAL = 60; // frames between each coin increment
    const PLAYER_1 = 1; // Player 1 identifier
    const PLAYER_2 = 2; // Player 2 identifier

    let fighters = []; // Array of fighter positions
    let coins = { 1: 5, 2: 5 }; // Starting coins for players
    let playerTurn = 1; // Track player turn

    // Function to place a fighter on the grid
    function placeFighter(x, y, player) {
        PS.color(x, y, player === PLAYER_1 ? PS.COLOR_RED : PS.COLOR_BLUE);
        PS.data(x, y, player);
        fighters.push({ x, y, player });
    }

    // Initialize game grid and fighters
    function initGame() {
        PS.gridSize(WIDTH, HEIGHT);
        PS.gridColor(PS.COLOR_GRAY);
        PS.statusColor(PS.COLOR_WHITE);
        PS.statusText("Player 1's Turn - WASD to move");

        // Place initial fighters
        placeFighter(3, HEIGHT - 1, PLAYER_1);
        placeFighter(WIDTH - 4, 0, PLAYER_2);
    }

    // Check for move validity
    function isValidMove(x, y, player) {
        if (x < 0 || y < 0 || x >= WIDTH || y >= HEIGHT) {
            return false;
        }
        let data = PS.data(x, y);
        return data === 0 || data !== player;
    }

    // Move fighter on the grid
    function moveFighter(oldX, oldY, newX, newY, player) {
        if (isValidMove(newX, newY, player)) {
            PS.color(oldX, oldY, PS.COLOR_GRAY);
            PS.data(oldX, oldY, 0);
            placeFighter(newX, newY, player);
            return true;
        }
        return false;
    }

    // Handler for keyboard input
    function keyDown(key, shift, ctrl, options) {
        let moved = false;
        if (playerTurn === PLAYER_1 && (key === PS.KEY_W || key === PS.KEY_S || key === PS.KEY_A || key === PS.KEY_D)) {
            fighters.forEach((fig, index) => {
                if (fig.player === PLAYER_1) {
                    let newX = fig.x;
                    let newY = fig.y;
                    switch (key) {
                        case PS.KEY_W: newY--; break;
                        case PS.KEY_S: newY++; break;
                        case PS.KEY_A: newX--; break;
                        case PS.KEY_D: newX++; break;
                    }
                    if (moveFighter(fig.x, fig.y, newX, newY, PLAYER_1)) {
                        fighters[index] = { x: newX, y: newY, player: PLAYER_1 };
                        moved = true;
                    }
                }
            });
        } else if (playerTurn === PLAYER_2 && (key === PS.KEY_ARROW_UP || key === PS.KEY_ARROW_DOWN || key === PS.KEY_ARROW_LEFT || key === PS.KEY_ARROW_RIGHT)) {
            fighters.forEach((fig, index) => {
                if (fig.player === PLAYER_2) {
                    let newX = fig.x;
                    let newY = fig.y;
                    switch (key) {
                        case PS.KEY_ARROW_UP: newY--; break;
                        case PS.KEY_ARROW_DOWN: newY++; break;
                        case PS.KEY_ARROW_LEFT: newX--; break;
                        case PS.KEY_ARROW_RIGHT: newX++; break;
                    }
                    if (moveFighter(fig.x, fig.y, newX, newY, PLAYER_2)) {
                        fighters[index] = { x: newX, y: newY, player: PLAYER_2 };
                        moved = true;
                    }
                }
            });
        }

        // Check if move was made to update status and toggle turn
        if (moved) {
            playerTurn = playerTurn === PLAYER_1 ? PLAYER_2 : PLAYER_1;
            PS.statusText("Player " + playerTurn + "'s Turn - " + (playerTurn === PLAYER_1 ? "WASD to move" : "Arrows to move"));
        }
    }

    // Timed function to increase coins
    function increaseCoins() {
        coins[PLAYER_1]++;
        coins[PLAYER_2]++;
        if (coins[PLAYER_1] >= UNIT_COST && fighters.filter(f => f.player === PLAYER_1).length < MAX_UNITS) {
            // Player 1 can buy a unit
        }
        if (coins[PLAYER_2] >= UNIT_COST && fighters.filter(f => f.player === PLAYER_2).length < MAX_UNITS) {
            // Player 2 can buy a unit
        }
    }

    PS.init = function (system, options) {
        initGame();
        PS.timerStart(COIN_INTERVAL, increaseCoins);
    };

    PS.keyDown = keyDown;

    return {
        init: initGame,
        keyDown: keyDown
    };
}());

PS.init = game.init;
PS.keyDown = game.keyDown;
