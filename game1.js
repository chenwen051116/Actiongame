let ACT=1;
var T = {
    W: 15, // Width of grid
    H: 15, // Height of grid
    P: 1, // Current player
    S: null, // Selected unit
    U: [], // Units on board
    mountains: [], // Mountain locations
    coinBoostAreas: [], // Coin boost locations
    skip: { x: 7, y: 15 }, // Skip button coordinates
    P1coin: 0, // Player 1 coins
    P2coin: 0, // Player 2 coins
    P1Fighter: 0xCD5C5C,  
    P1Archer: 0xF08080,  
    P1Rider: 0x8B0000,  
    P2Fighter: 0x4169E1,  
    P2Archer: 0x6495ED,  
    P2Rider: 0x0000FF,  
    P1Castle: 0xB22222,  
    P2Castle: 0x4682B4,  
    F: 4, // Fighter cost
    A: 6, // Archer cost
    R: 8, // Rider cost
    M_C: 0x8B4513, // Mountain color
    M_D_C: 0x228B22, // Mountain during attack
    C_B_C: 0xFFD700, // Coin boost color
    H_B_C: 0xFFFFFF, // Blink color
    init: function() {
        PS.gridSize(this.W, this.H + 1);
        PS.gridColor(0x303030);
        this.addSkip();
        this.spawnUnits(1);
        this.spawnUnits(2);
        this.spawnCastles();
        this.gMountains();
        this.gCoinAreas();
        this.updateBoard();
        PS.statusText("Player 1's turn");
        this.addMusic();
    },
    addMusic: function(){
        // Load sound effects
        PS.audioLoad("fx_click");
        PS.audioLoad("fx_bloop");
        PS.audioLoad("fx_beep");
        PS.audioLoad("fx_coin7");
    },
    addSkip: function() {
        // Limit coins to 99
        if (this.P1coin >= 100) {
            this.P1coin = 99;
        }
        if (this.P2coin >= 100) {
            this.P2coin = 99;
        }
        // Display skip button and coin counters
        PS.color(this.skip.x, this.skip.y, 0xFF0000);
        PS.glyph(this.skip.x, this.skip.y, "S");
        PS.color(0, this.H, 0xB22222);
        PS.glyph(0, this.H, String(Math.floor(this.P1coin / 10)));
        PS.color(this.W - 1, this.H, 0x4682B4);
        PS.glyph(this.W - 1, this.H, String(this.P2coin % 10));
        PS.color(1, this.H, 0xB22222);
        PS.glyph(1, this.H, String(this.P1coin % 10));
        PS.color(this.W - 2, this.H, 0x4682B4);
        PS.glyph(this.W - 2, this.H, String(Math.floor(this.P2coin / 10)));
        PS.glyph(3, this.H, String(this.F));
        PS.glyph(4, this.H, String(this.A));
        PS.glyph(5, this.H, String(this.R));
        PS.glyph(this.W - 6, this.H, String(this.F));
        PS.glyph(this.W - 5, this.H, String(this.A));
        PS.glyph(this.W - 4, this.H, String(this.R));
    },
    spawnUnits: function(p) {
        // Spawn units at game start
        if (p === 1) {
            this.U.push(this.createU('r', p, 1, this.H - 1));
            this.U.push(this.createU('a', p, 2, this.H - 1));
            this.U.push(this.createU('f', p, 3, this.H - 1));
        } else {
            this.U.push(this.createU('r', p, this.W - 2, 0));
            this.U.push(this.createU('a', p, this.W - 3, 0));
            this.U.push(this.createU('f', p, this.W - 4, 0));
        }
    },
    spawnCastles: function() {
        // Place castles for each player
        this.U.push(this.createCastle(1, 0, this.H - 1));
        this.U.push(this.createCastle(2, this.W - 1, 0));
    },
    gMountains: function() {
        // Generate mountain locations
        var numMountains = 20;  
        for (var i = 0; i < numMountains; i++) {
            var x, y;
            do {
                x = PS.random(this.W) - 1;
                y = PS.random(this.H) - 1;
            } while (this.getUnitAt(x, y) || this.isMountain(x, y));  
            this.mountains.push({ x: x, y: y });
        }
    },
    gCoinAreas: function() {
        // Generate coin boost locations
        var numBoostAreas = 5;  
        for (var i = 0; i < numBoostAreas; i++) {
            var x, y;
            do {
                x = PS.random(this.W) - 1;
                y = PS.random(this.H) - 1;
            } while (this.getUnitAt(x, y) || this.isMountain(x, y) || this.isCoinBoost(x, y));  
            this.coinBoostAreas.push({ x: x, y: y });
        }
    },
    createCastle: function(p, x, y) {
        // Initialize castle properties
        var color;
        if (p === 1) {
           color = this.P1Castle;
        } else {
           color = this.P2Castle;
        }
        return { t: 'castle', x: x, y: y, p: p, h: 3, c: color, m: 0 };
    },
    createU: function(t, p, x, y) {
        // Initialize unit properties
        var color;
        if (p === 1) {
            if (t === 'r') color = this.P1Rider;
            else if (t === 'a') color = this.P1Archer;
            else color = this.P1Fighter;
        } else {
            if (t === 'r') color = this.P2Rider;
            else if (t === 'a') color = this.P2Archer;
            else color = this.P2Fighter;
        }
        if (t === 'r') {
            return { t: 'r', x: x, y: y, p: p, h: 3, mR: 3, aR: 1, c: color, m: 3 };
        }
        if (t === 'a') {
            return { t: 'a', x: x, y: y, p: p, h: 2, mR: 1, aR: 3, c: color, m: 1 };
        }
        return { t: 'f', x: x, y: y, p: p, h: 4, mR: 1, aR: 1, c: color, m: 1 };
    },
    updateBoard: function() {
        // Redraw the board
        if(ACT == 1){
        var x, y, i, unit;
        for (x = 0; x < this.W; x++) {
            for (y = 0; y < this.H; y++) {
                PS.color(x, y, PS.COLOR_WHITE);
                PS.glyph(x, y, "");
            }
        }
        for (i = 0; i < this.mountains.length; i++) {
            var mountain = this.mountains[i];
            PS.color(mountain.x, mountain.y, this.M_C);
        }
        for (i = 0; i < this.coinBoostAreas.length; i++) {
            var boostArea = this.coinBoostAreas[i];
            PS.color(boostArea.x, boostArea.y, this.C_B_C);
        }
        for (i = 0; i < this.U.length; i++) {
            unit = this.U[i];
            if (this.isMountain(unit.x, unit.y)) {
                PS.color(unit.x, unit.y, this.M_D_C);  // Unit on mountain
            } else {
                PS.color(unit.x, unit.y, unit.c);
            }
            PS.glyph(unit.x, unit.y, String(unit.h));
        }
        this.addSkip();
    }
    },
    getUnitAt: function(x, y) {
        // Return unit at given position
        for (var i = 0; i < this.U.length; i++) {
            if (this.U[i].x === x && this.U[i].y === y) {
                return this.U[i];
            }
        }
        return null;
    },
    isMountain: function(x, y) {
        // Check if position has mountain
        for (var i=0; i < this.mountains.length; i++) {
            if (this.mountains[i].x === x && this.mountains[i].y === y) {
                return true;
            }
        }
        return false;
    },
    isCoinBoost: function(x, y) {
        // Check if position has coin boost
        for (var i = 0; i < this.coinBoostAreas.length; i++) {
            if (this.coinBoostAreas[i].x === x && this.coinBoostAreas[i].y === y) {
                return true;
            }
        }
        return false;
    },
    showRange: function(unit) {
        // Display movement and attack ranges
        var x, y, dx, dy;
        for (x = 0; x < this.W; x++) {
            for (y = 0; y < this.H; y++) {
                dx = Math.abs(x - unit.x);
                dy = Math.abs(y - unit.y);
                if (dx + dy <= unit.m && this.getUnitAt(x, y) == null) {
                    PS.color(x, y, 0xDDDDDD); // Movement range
                }
                if (unit.t === 'a' && dx + dy <= unit.aR && dx + dy > unit.m && this.getUnitAt(x, y) == null) {
                    PS.color(x, y, 0xFFAAAA); // Archer attack range
                }
                if (unit.t !== 'a' && dx + dy <= unit.aR && this.getUnitAt(x, y) == null) {
                    PS.color(x, y, 0xFFAAAA); // Non-archer attack range
                }
            }
        }
    },
    clearRange: function() {
        // Clear displayed ranges
        var x, y, unit;
        for (x = 0; x < this.W; x++) {
            for (y = 0; y < this.H; y++) {
                unit = this.getUnitAt(x, y);
                if (!unit && !this.isMountain(x, y) && !this.isCoinBoost(x, y)) {
                    PS.color(x, y, PS.COLOR_WHITE); // Clear color
                } else if (this.isMountain(x, y)) {
                    PS.color(x, y, this.M_C); // Mountain color
                } else if (this.isCoinBoost(x, y)) {
                    PS.color(x, y, this.C_B_C); // Coin boost color
                }
            }
        }
    },
    handleUnitClick: function(x, y) {
        // Handle click on unit
        var unit = this.getUnitAt(x, y);
        if (unit && unit.p === this.P && unit.m > 0) {
            PS.audioPlay("fx_click");
            this.clearRange();
            this.S = unit;
            this.showRange(unit);
            PS.statusText("Unit selected: " + unit.t);
        } else if (this.S) {
            PS.audioPlay("fx_click");
            if (this.isValidMove(x, y, this.S)) {
                this.moveUnit(this.S, x, y);
                this.clearRange();
            } else if (this.inAtk(x, y, this.S)) {
                this.attackUnit(x, y, this.S);
                this.clearRange();
            }
        }
    },
    moveUnit: function(unit, x, y) {
        // Move selected unit
        var dx = Math.abs(x - unit.x);
        var dy = Math.abs(y - unit.y);
        if (unit.m > 0) {
            if (this.isMountain(unit.x, unit.y)) {
                PS.color(unit.x, unit.y, this.M_C);
            } else {
                PS.color(unit.x, unit.y, PS.COLOR_WHITE);
            }
            PS.glyph(unit.x, unit.y, "");
            unit.x = x;
            unit.y = y;
            if (this.isMountain(x, y)) {
                PS.color(x, y, this.M_D_C);
            } else {
                PS.color(x, y, unit.c);
            }
            PS.glyph(x, y, String(unit.h));
            unit.m -= dx + dy;
        }
    },
    isValidMove: function(x, y, unit) {
        // Validate unit move
        var dx = Math.abs(x - unit.x);
        var dy = Math.abs(y - unit.y);
        if (dx + dy > unit.mR) {
            return false;
        }
        if (this.getUnitAt(x, y) !== null) {
            return false;
        }
        return true;
    },
    inAtk: function(x, y, unit) {
        // Check if target is within attack range
        var target = this.getUnitAt(x, y);
        if (target && target.p !== unit.p) {
            var dx = Math.abs(x - unit.x);
            var dy = Math.abs(y - unit.y);
            return (dx + dy <= unit.aR);
        }
        return false;
    },
    attackUnit: function(x, y, unit) {
        // Attack action
        if (unit.m > 0) {
            PS.audioPlay("fx_bang");
            var target = this.getUnitAt(x, y);
            if (target) {
                var isMountain = this.isMountain(target.x, target.y);
                var blockChance = false;
            if (isMountain) {
                if (PS.random(100) <= 50) {
                    blockChance = true;
                }
            }
                if (blockChance) {
                    PS.statusText("Attack blocked! Target is on a mountain.");
                } 
                else {
                    target.h -= 1;
                    PS.statusText("Player " + unit.p + " attacks!");
                    this.blinkU(target.x, target.y, target.c, target.h);
                    if (target.t === 'castle' && target.h <= 0) {
                        if (unit.p === 1) {
                            this.announceWinner(2);
                        } else {
                            this.announceWinner(1);
                        }
                    } else if (target.h <= 0) {
                        this.removeU(target);
                        this.updateBoard();
                    } else {
                        PS.glyph(target.x, target.y, String(target.h));
                    }
                }
                unit.m -= 1;
            }
        }
    },
    blinkU: function(x, y, originalColor, health) {
        // Blink unit upon attack
        var currentUnit = this.getUnitAt(x, y);
        PS.color(x, y, this.H_B_C);
        var tim=PS.timerStart(6, function() {
            PS.color(x, y, originalColor);
            PS.glyph(x,y,String(health));
            PS.timerStop(tim);
        });
    },
    removeU: function(unit) {
        // Remove defeated unit
        PS.color(unit.x, unit.y, PS.COLOR_WHITE);
        PS.glyph(unit.x, unit.y, "");
        this.U = this.U.filter(function(u) {
            return u !== unit;
        });
        PS.statusText("Unit eliminated!");
    },
    switchPlayer: function() {
        // Switch turn between players
        PS.audioPlay("fx_beep");
        if (this.P === 1) {
            this.P = 2;
            this.P1coin++;
        } else {
            this.P = 1;
            this.P2coin++;
        }
        for (var i = 0; i < this.U.length; i++) {
            var unit = this.U[i];
            if (unit.p === this.P && this.isCoinBoost(unit.x, unit.y)) {
                if (this.P === 1) {
                    this.P1coin++;
                } else {
                    this.P2coin++;
                }
            }
        }
        PS.statusText("Player " + this.P + "'s turn");
        this.S = null;
        this.U.forEach(function(u) {
            if (u.p === T.P) {
                u.m = u.mR;
            }
        });
        this.updateBoard();
    },
    announceWinner: function(winner) {
        // Display winner and reset game
        PS.statusText("Player " + winner + " wins!");
        for (x = 0; x < this.W; x++) {
            for (y = 0; y < this.H; y++) {
                PS.fade(x, y, 15);
            }
        }
        if(winner==1){
            for (x = 0; x < this.W; x++) {
                for (y = 0; y < this.H; y++) {
                    PS.color(x, y, this.P1Fighter);
                }
            }
        }
        else{
            for (x = 0; x < this.W; x++) {
                for (y = 0; y < this.H; y++) {
                    PS.color(x, y, this.P2Fighter);
                }
            }
        }
        var tpt=PS.timerStart(30, function() { 
            for (x = 0; x < this.W; x++) {
                for (y = 0; y < this.H; y++) {
                    PS.color(x, y, this.COLOR_WHITE);
                }
            }
            this.U = [];
            this.mountains = [];
            this.coinBoostAreas = [];
            this.P = 1;
            ACT=0;
            PS.timerStop(tpt);
        });
    },
    resetGame: function() {
        // Reset the game to initial state
        for (x = 0; x < this.W; x++) {
            for (y = 0; y < this.H; y++) {
                PS.fade(x, y, 0);
            }
        }
        this.U = [];
        this.mountains = [];
        this.coinBoostAreas = [];
        this.P = 1;
        ACT=1;
        this.init();
    },

    handleClick: function(x, y) {
        // Handle clicks on the game grid
        if (x === this.skip.x && y === this.skip.y) {
            this.switchPlayer();
            return;
        }
        if (y === this.H) {
            PS.audioPlay("fx_coin7");
            this.handleCoinPurchase(x);
            return;
        }
        this.handleUnitClick(x, y);
    },

    handleCoinPurchase: function(x) {
        // Manage coin purchases for units
        var isOccupied;
        if (x === 3 && this.P === 1 && this.P1coin >= this.F) {
            isOccupied = this.checkOccupied(1, this.H - 1);
            if (!isOccupied) {
                this.U.push(this.createU('f', 1, 1, this.H - 1));
                this.P1coin -= this.F;
                this.updateBoard();
            }
        }
        if (x === 4 && this.P === 1 && this.P1coin >= this.A) {
            isOccupied = this.checkOccupied(2, this.H - 1);
            if (!isOccupied) {
                this.U.push(this.createU('a', 1, 2, this.H - 1));
                this.P1coin -= this.A;
                this.updateBoard();
            }
        }
        if (x === 5 && this.P === 1 && this.P1coin >= this.R) {
            isOccupied = this.checkOccupied(3, this.H - 1);
            if (!isOccupied) {
                this.U.push(this.createU('r', 1, 1, this.H - 1));
                this.P1coin -= this.R;
                this.updateBoard();
            }
        }
        if (x === this.W - 6 && this.P === 2 && this.P2coin >= this.F) {
            isOccupied = this.checkOccupied(this.W - 2, 0);
            if (!isOccupied) {
                this.U.push(this.createU('f', 2, this.W - 2, 0));
                this.P2coin -= this.F;
                this.updateBoard();
            }
        }
        if (x === this.W - 5 && this.P === 2 && this.P2coin >= this.A) {
            isOccupied = this.checkOccupied(this.W - 3, 0);
            if (!isOccupied) {
                this.U.push(this.createU('a', 2, this.W - 3, 0));
                this.P2coin -= this.A;
                this.updateBoard();
            }
        }
        if (x === this.W - 4 && this.P === 2 && this.P2coin >= this.R) {
            isOccupied = this.checkOccupied(this.W - 2, 0);
            if (!isOccupied) {
                this.U.push(this.createU('r', 2, this.W - 2, 0));
                this.P2coin -= this.R;
                this.updateBoard();
            }
        }
    },

    checkOccupied: function(x, y) {
        // Check if position is occupied
        for (var i = 0; i < this.U.length; i++) {
            if (this.U[i].x === x && this.U[i].y === y) {
                return true;
            }
        }
        return false;
    }
}

PS.enter = function( x, y, data, options ) {
    // Trigger reset if game is not active
    if(ACT!=1){
        T.resetGame();
    }
};

PS.init = function(system, options) {
    // Initialize the game
    T.init();
};

PS.touch = function(x, y, data, options) {
    // Handle touch events on the grid
    T.handleClick(x, y);
};
