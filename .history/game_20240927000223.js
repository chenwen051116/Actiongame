let ACT = 1;
var T = {
    W: 15, // Width of the grid
    H: 15, // Height of the grid
    coins: [0, 0], // Player coins
    fighters: [[], []], // Fighters for each player
    selected: [0, 0], // Selected fighter index for each player
    colors: [0xCD5C5C, 0x4169E1], // Player colors
    coinRate: 1000, // Coin increment rate in milliseconds

    init: function() {
        PS.gridSize(this.W, this.H);
        PS.gridColor(0x303030);
        PS.statusText("Player 1's turn");
        this.startCoinTimer();
    },

    startCoinTimer: function() {
        setInterval(() => {
            this.coins[0]++;
            this.coins[1]++;
            this.updateStatus();
        }, this.coinRate);
    },

    addFighter: function(player) {
        if (this.fighters[player].length < 6 && this.coins[player] >= 10) {
            let x = player === 0 ? 0 : this.W - 1;
            let y = Math.floor(Math.random() * this.H);
            this.fighters[player].push({ x: x, y: y, h: 10 });
            this.coins[player] -= 10;
            this.drawFighter(player, this.fighters[player].length - 1);
        }
        this.updateStatus();
    },

    drawFighter: function(player, index) {
        let fighter = this.fighters[player][index];
        PS.color(fighter.x, fighter.y, this.colors[player]);
        PS.glyph(fighter.x, fighter.y, 'F');
    },

    moveFighter: function(player, dx, dy) {
        let fighter = this.fighters[player][this.selected[player]];
        let nx = fighter.x + dx;
        let ny = fighter.y + dy;
        if (nx >= 0 && nx < this.W && ny >= 0 && ny < this.H) {
            PS.color(fighter.x, fighter.y, PS.COLOR_WHITE);
            PS.glyph(fighter.x, fighter.y, '');
            fighter.x = nx;
            fighter.y = ny;
            this.drawFighter(player, this.selected[player]);
        }
    },

    switchFighter: function(player) {
        this.selected[player] = (this.selected[player] + 1) % this.fighters[player].length;
        this.updateStatus();
    },

    updateStatus: function() {
        PS.statusText("Player 1 Coins: " + this.coins[0] + " | Player 2 Coins: " + this.coins[1]);
    },

    handleKey: function(key, down) {
        if (!down) return;
        switch (key) {
            case PS.KEY_ARROW_UP:
                this.moveFighter(1, 0, -1);
                break;
            case PS.KEY_ARROW_DOWN:
                this.moveFighter(1, 0, 1);
                break;
            case PS.KEY_ARROW_LEFT:
                this.moveFighter(1, -1, 0);
                break;
            case PS.KEY_ARROW_RIGHT:
                this.moveFighter(1, 1, 0);
                break;
            case PS.KEY_W:
                this.moveFighter(0, 0, -1);
                break;
            case PS.KEY_S:
                this.moveFighter(0, 0, 1);
                break;
            case PS.KEY_A:
                this.moveFighter(0, -1, 0);
                break;
            case PS.KEY_D:
                this.moveFighter(0, 1, 0);
                break;
            case PS.KEY_E:
                this.addFighter(0);
                break;
            case PS.KEY_P:
                this.addFighter(1);
                break;
            case PS.KEY_Q:
                this.switchFighter(0);
                break;
            case PS.KEY_O:
                this.switchFighter(1);
                break;
        }
    }
};

PS.init = function(system, options) {
    T.init();
};

PS.keyDown = function(key, shift, ctrl, options) {
    T.handleKey(key, true);
};

PS.keyUp = function(key, shift, ctrl, options) {
    T.handleKey(key, false);
};
