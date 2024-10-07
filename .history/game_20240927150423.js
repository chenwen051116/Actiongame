let ACT = 1;
var T = {
    W: 15, 
    H: 15, 
    P: 1, 
    S: null, 
    U: [], 
    maxUnits: 6, 
    P1coin: 0, 
    P2coin: 0, 
    coinRate: 1, 
    coinInterval: null, 
    P1Fighter: 0xCD5C5C,  
    P2Fighter: 0x4169E1, 
    init: function() {
        PS.gridSize(this.W, this.H + 1);
        PS.gridColor(0x303030);
        this.spawnUnits(1);
        this.spawnUnits(2);
        this.updateBoard();
        PS.statusText("Player 1's turn");

        this.coinInterval = PS.timerStart(60, this.incrementCoins.bind(this)); 
    },
    incrementCoins: function() {
        this.P1coin += this.coinRate;
        this.P2coin += this.coinRate;
        this.updateCoins();
    },
    updateCoins: function() {
        PS.color(0, this.H, 0xB22222);
        PS.glyph(0, this.H, String(this.P1coin % 100)); 
        PS.color(this.W - 1, this.H, 0x4682B4);
        PS.glyph(this.W - 1, this.H, String(this.P2coin % 100)); 
    },
    spawnUnits: function(p) {
        if (p === 1) {
            this.U.push(this.createUnit(p, 1, this.H - 1));
        } else {
            this.U.push(this.createUnit(p, this.W - 2, 0));
        }
    },
    createUnit: function(p, x, y) {
        var color = (p === 1) ? this.P1Fighter : this.P2Fighter;
        return { t: 'fighter', x: x, y: y, p: p, h: 3, m: 3, c: color };
    },
    updateBoard: function() {
        var x, y, i, unit;
        for (x = 0; x < this.W; x++) {
            for (y = 0; y < this.H; y++) {
                PS.color(x, y, PS.COLOR_WHITE);
                PS.glyph(x, y, "");
            }
        }
        for (i = 0; i < this.U.length; i++) {
            unit = this.U[i];
            PS.color(unit.x, unit.y, unit.c);
            PS.glyph(unit.x, unit.y, String(unit.h));
        }
    },
    moveUnit: function(unit, dx, dy) {
        var x = unit.x + dx;
        var y = unit.y + dy;

        if (x >= 0 && x < this.W && y >= 0 && y < this.H) {
            PS.color(unit.x, unit.y, PS.COLOR_WHITE);
            PS.glyph(unit.x, unit.y, "");
            unit.x = x;
            unit.y = y;
            PS.color(unit.x, unit.y, unit.c);
            PS.glyph(unit.x, unit.y, String(unit.h));
        }
    },
    handleKeyPress: function(key, player) {
        PS.statusText(key);
        var unit = this.U.find(u => u.p === player);
        if (!unit) return;

        switch (key) {
            case PS.KEY_ARROW_UP: // P2 up
            case 87: // P1 W key
                this.moveUnit(unit, 0, -1);
                break;
            case PS.KEY_ARROW_DOWN: // P2 down
            case 83: // P1 S key
                this.moveUnit(unit, 0, 1);
                break;
            case PS.KEY_ARROW_LEFT: // P2 left
            case 97: // P1 A key
                this.moveUnit(unit, -1, 0);
                break;
            case PS.KEY_ARROW_RIGHT: // P2 right
            case 100: // P1 D key
                this.moveUnit(unit, 1, 0);
                break;
            case 69: // P1 E key to buy unit
                if (player === 1 && this.P1coin >= 10 && this.U.filter(u => u.p === 1).length < this.maxUnits) {
                    this.U.push(this.createUnit(1, 1, this.H - 1));
                    this.P1coin -= 10;
                    this.updateBoard();
                    this.updateCoins();
                }
            case 76: // P2 L key to buy unit

                if (player === 2 && this.P2coin >= 10 && this.U.filter(u => u.p === 2).length < this.maxUnits) {
                    this.U.push(this.createUnit(2, this.W - 2, 0));
                    this.P2coin -= 10;
                    this.updateBoard();
                    this.updateCoins();
                }
                break;
        }
    }
};
PS.init = function() {
    T.init();
};
PS.keyDown = function(key) {
    if (key >= 37 && key <= 40) {
        T.handleKeyPress(key, 2); 
    } else {
        T.handleKeyPress(key, 1); 
    }
};
