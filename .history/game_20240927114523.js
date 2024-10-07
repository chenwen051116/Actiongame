let ACT = 1;
let player1 = {
    x: 0,
    y: 14,
    coins: 0,
    fighters: [],
    color: 0xCD5C5C,
    controlKeys: {
        up: 87, // W
        down: 83, // S
        left: 65, // A
        right: 68, // D
        switchUnit: 69, // E
        buyUnit: 81 // Q
    }
};
let player2 = {
    x: 14,
    y: 0,
    coins: 0,
    fighters: [],
    color: 0x4169E1,
    controlKeys: {
        up: PS.KEY_ARROW_UP,
        down: PS.KEY_ARROW_DOWN,
        left: PS.KEY_ARROW_LEFT,
        right: PS.KEY_ARROW_RIGHT,
        switchUnit: PS.KEY_ENTER,
        buyUnit: PS.KEY_BACKSPACE
    }
};

let game = {
    W: 15,
    H: 15,
    P: 1,
    maxUnits: 6,
    unitCost: 10,
    selectedUnit1: 0,
    selectedUnit2: 0,
    interval: null,
    init: function () {
        PS.gridSize(this.W, this.H);
        PS.gridColor(0x303030);
        PS.statusText("Real-Time Game");
        this.spawnUnit(player1);
        this.spawnUnit(player2);
        this.startCoinAccumulation();
    },
    spawnUnit: function (player) {
        if (player.fighters.length < this.maxUnits && player.coins >= this.unitCost) {
            player.fighters.push({ x: player.x, y: player.y, color: player.color });
            player.coins -= this.unitCost;
            this.updateBoard();
        }
    },
    moveUnit: function (player, dx, dy) {
        let unit = player.fighters[player === player1 ? this.selectedUnit1 : this.selectedUnit2];
        if (unit) {
            unit.x = Math.min(Math.max(unit.x + dx, 0), this.W - 1);
            unit.y = Math.min(Math.max(unit.y + dy, 0), this.H - 1);
            this.updateBoard();
        }
    },
    switchUnit: function (player) {
        if (player === player1) {
            this.selectedUnit1 = (this.selectedUnit1 + 1) % player.fighters.length;
        } else {
            this.selectedUnit2 = (this.selectedUnit2 + 1) % player.fighters.length;
        }
    },
    updateBoard: function () {
        PS.color(PS.ALL, PS.ALL, PS.COLOR_WHITE);
        player1.fighters.forEach(unit => {
            PS.color(unit.x, unit.y, player1.color);
        });
        player2.fighters.forEach(unit => {
            PS.color(unit.x, unit.y, player2.color);
        });
    },
    startCoinAccumulation: function () {
        this.interval = setInterval(() => {
            player1.coins++;
            player2.coins++;
        }, 1000);
    }
};

PS.init = function (system, options) {
    game.init();
};

PS.keyDown = function (key, shift, ctrl, options) {
    switch (key) {
        // Player 1 controls
        case player1.controlKeys.up: game.moveUnit(player1, 0, -1); break;
        case player1.controlKeys.down: game.moveUnit(player1, 0, 1); break;
        case player1.controlKeys.left: game.moveUnit(player1, -1, 0); break;
        case player1.controlKeys.right: game.moveUnit(player1, 1, 0); break;
        case player1.controlKeys.switchUnit: game.switchUnit(player1); break;
        case player1.controlKeys.buyUnit: game.spawnUnit(player1); break;

        // Player 2 controls
        case player2.controlKeys.up: game.moveUnit(player2, 0, -1); break;
        case player2.controlKeys.down: game.moveUnit(player2, 0, 1); break;
        case player2.controlKeys.left: game.moveUnit(player2, -1, 0); break;
        case player2.controlKeys.right: game.moveUnit(player2, 1, 0); break;
        case player2.controlKeys.switchUnit: game.switchUnit(player2); break;
        case player2.controlKeys.buyUnit: game.spawnUnit(player2); break;
    }
};
