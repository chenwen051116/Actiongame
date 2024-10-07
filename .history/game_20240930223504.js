var T = {
    // Grid dimensions
    W: 15,
    H: 15,

    // Players
    players: {
        1: {
            coins: 100,
            units: [],
            currentUnitIndex: 0,
            color: 0xB22222, // Castle color
            castle: null,
            controls: {
                up: 'W',
                down: 'S',
                left: 'A',
                right: 'D',
                switchUnit: 'Q',
                buyFighter: 'E',
                buyArcher: 'R',
                buyRider: 'T'
            },
            unitCosts: {
                fighter: 20,
                archer: 30,
                rider: 40
            }
        },
        2: {
            coins: 100,
            units: [],
            currentUnitIndex: 0,
            color: 0x4682B4, // Castle color
            castle: null,
            controls: {
                up: 'UP',
                down: 'DOWN',
                left: 'LEFT',
                right: 'RIGHT',
                switchUnit: 'M',
                buyFighter: 'N',
                buyArcher: 'B',
                buyRider: 'V'
            },
            unitCosts: {
                fighter: 20,
                archer: 30,
                rider: 40
            }
        }
    },

    // Units
    unitTypes: {
        fighter: {
            type: 'f',
            colorP1: 0xCD5C5C,
            colorP2: 0x4169E1,
            health: 4,
            moveRange: 3,
            attackRange: 1,
            damage: 1
        },
        archer: {
            type: 'a',
            colorP1: 0xF08080,
            colorP2: 0x6495ED,
            health: 2,
            moveRange: 1,
            attackRange: 3,
            damage: 1
        },
        rider: {
            type: 'r',
            colorP1: 0x8B0000,
            colorP2: 0x0000FF,
            health: 3,
            moveRange: 3,
            attackRange: 1,
            damage: 1
        }
    },

    // Game state
    units: [], // All units on the board
    castles: [], // Castles
    keysPressed: {}, // Currently pressed keys

    init: function() {
        PS.gridSize(this.W, this.H);
        PS.gridColor(0x303030);
        PS.statusColor(PS.COLOR_WHITE);
        this.spawnCastles();
        this.updateBoard();
        PS.statusText("Real-Time Two Player Action Game");
        PS.timerStart(10, this.gameLoop.bind(this));
    },

    spawnCastles: function() {
        // Player 1 Castle
        var castle1 = this.createCastle(1, 0, this.H - 1);
        this.players[1].castle = castle1;
        this.units.push(castle1);

        // Player 2 Castle
        var castle2 = this.createCastle(2, this.W - 1, 0);
        this.players[2].castle = castle2;
        this.units.push(castle2);
    },

    createCastle: function(player, x, y) {
        var color = this.players[player].color;
        return {
            id: PS.random(10000),
            type: 'castle',
            player: player,
            x: x,
            y: y,
            color: color,
            health: 10
        };
    },

    createUnit: function(player, type, x, y) {
        var unitType = this.unitTypes[type];
        var color = (player === 1) ? unitType.colorP1 : unitType.colorP2;
        return {
            id: PS.random(10000),
            type: unitType.type,
            player: player,
            x: x,
            y: y,
            color: color,
            health: unitType.health,
            moveRange: unitType.moveRange,
            attackRange: unitType.attackRange,
            damage: unitType.damage,
            target: null // For attack purposes
        };
    },

    updateBoard: function() {
        // Clear grid
        for (var x = 0; x < this.W; x++) {
            for (var y = 0; y < this.H; y++) {
                PS.color(x, y, PS.COLOR_WHITE);
                PS.glyph(x, y, '');
            }
        }

        // Draw units
        for (var i = 0; i < this.units.length; i++) {
            var unit = this.units[i];
            PS.color(unit.x, unit.y, unit.color);
            if (unit.type === 'castle') {
                PS.glyph(unit.x, unit.y, 'C');
            } else {
                PS.glyph(unit.x, unit.y, unit.type.toUpperCase());
            }
        }
    },

    handleKeyPress: function(key, shift, ctrl, options) {
        var keyStr = PS.keyToChar(key);
        this.keysPressed[keyStr] = true;
    },

    handleKeyRelease: function(key, shift, ctrl, options) {
        var keyStr = PS.keyToChar(key);
        delete this.keysPressed[keyStr];
    },

    gameLoop: function() {
        // Handle inputs for both players
        this.handlePlayerInput(1);
        this.handlePlayerInput(2);

        // Handle attacks
        this.handleAttacks();

        // Update board
        this.updateBoard();

        // Check win conditions
        this.checkWinConditions();
    },

    handlePlayerInput: function(player) {
        var controls = this.players[player].controls;
        var currentUnit = this.players[player].units[this.players[player].currentUnitIndex];

        if (!currentUnit || currentUnit.type === 'castle') return; // Can't control castle

        // Movement
        if (this.keysPressed[controls.up]) {
            this.moveUnit(player, currentUnit, 0, -1);
        }
        if (this.keysPressed[controls.down]) {
            this.moveUnit(player, currentUnit, 0, 1);
        }
        if (this.keysPressed[controls.left]) {
            this.moveUnit(player, currentUnit, -1, 0);
        }
        if (this.keysPressed[controls.right]) {
            this.moveUnit(player, currentUnit, 1, 0);
        }

        // Switching Units
        if (this.keysPressed[controls.switchUnit]) {
            this.switchUnit(player);
            delete this.keysPressed[controls.switchUnit]; // Prevent continuous switching
        }

        // Buying Units
        if (this.keysPressed[controls.buyFighter]) {
            this.buyUnit(player, 'fighter');
            delete this.keysPressed[controls.buyFighter];
        }
        if (this.keysPressed[controls.buyArcher]) {
            this.buyUnit(player, 'archer');
            delete this.keysPressed[controls.buyArcher];
        }
        if (this.keysPressed[controls.buyRider]) {
            this.buyUnit(player, 'rider');
            delete this.keysPressed[controls.buyRider];
        }
    },

    moveUnit: function(player, unit, dx, dy) {
        var newX = unit.x + dx;
        var newY = unit.y + dy;

        // Boundary check
        if (newX < 0 || newX >= this.W || newY < 0 || newY >= this.H) return;

        // Check if the target cell is occupied
        var occupied = this.units.some(function(u) {
            return u.x === newX && u.y === newY;
        });
        if (occupied) return;

        // Move unit
        unit.x = newX;
        unit.y = newY;
    },

    switchUnit: function(player) {
        if (this.players[player].units.length === 0) return;
        this.players[player].currentUnitIndex = (this.players[player].currentUnitIndex + 1) % this.players[player].units.length;
        var unit = this.players[player].units[this.players[player].currentUnitIndex];
        PS.statusText("Player " + player + " switched to " + unit.type.toUpperCase());
    },

    buyUnit: function(player, unitType) {
        var cost = this.players[player].unitCosts[unitType];
        if (this.players[player].coins < cost) {
            PS.statusText("Player " + player + " doesn't have enough coins!");
            return;
        }

        // Find spawn position near castle
        var castle = this.players[player].castle;
        var spawnX = castle.x;
        var spawnY = castle.y;

        // Simple spawn logic: adjacent cell
        var directions = [
            { dx: 1, dy: 0 },
            { dx: -1, dy: 0 },
            { dx: 0, dy: 1 },
            { dx: 0, dy: -1 }
        ];

        var spawned = false;
        for (var i = 0; i < directions.length; i++) {
            var nx = spawnX + directions[i].dx;
            var ny = spawnY + directions[i].dy;

            if (nx < 0 || nx >= this.W || ny < 0 || ny >= this.H) continue;

            var occupied = this.units.some(function(u) {
                return u.x === nx && u.y === ny;
            });
            if (!occupied) {
                var newUnit = this.createUnit(player, unitType, nx, ny);
                this.units.push(newUnit);
                this.players[player].units.push(newUnit);
                this.players[player].coins -= cost;
                PS.statusText("Player " + player + " bought " + unitType.toUpperCase() + "!");
                spawned = true;
                break;
            }
        }

        if (!spawned) {
            PS.statusText("Player " + player + " cannot spawn " + unitType.toUpperCase() + "!");
        }
    },

    handleAttacks: function() {
        // Simple attack logic: adjacent enemy units are attacked
        for (var i = 0; i < this.units.length; i++) {
            var unit = this.units[i];
            if (unit.type === 'castle') continue;

            // Check for enemies in range
            var enemies = this.units.filter(function(u) {
                return u.player !== unit.player && u.type !== 'castle' && T.distance(unit.x, unit.y, u.x, u.y) <= unit.attackRange;
            });

            if (enemies.length > 0) {
                // Attack the first enemy found
                var target = enemies[0];
                target.health -= unit.damage;
                PS.statusText("Player " + unit.player + " " + unit.type.toUpperCase() + " attacks Player " + target.player + "!");
                if (target.health <= 0) {
                    // Remove target
                    PS.color(target.x, target.y, PS.COLOR_WHITE);
                    PS.glyph(target.x, target.y, '');
                    this.units.splice(i, 1);
                    var playerUnits = this.players[target.player].units;
                    for (var j = 0; j < playerUnits.length; j++) {
                        if (playerUnits[j].id === target.id) {
                            playerUnits.splice(j, 1);
                            break;
                        }
                    }
                    i--; // Adjust index after removal
                    PS.statusText("Player " + target.player + "'s " + target.type.toUpperCase() + " has been eliminated!");
                }
            }
        }
    },

    distance: function(x1, y1, x2, y2) {
        return Math.abs(x1 - x2) + Math.abs(y1 - y2);
    },

    checkWinConditions: function() {
        var castles = this.units.filter(function(u) {
            return u.type === 'castle';
        });

        if (castles.length < 2) {
            if (castles.length === 1) {
                PS.statusText("Player " + castles[0].player + " wins!");
            } else {
                PS.statusText("It's a draw!");
            }
            PS.timerStopAll();
            return;
        }
    },

    PSInit: function(system, options) {
        this.init();
    },

    PSTouch: function(x, y, data, options) {
        // Optional: Implement touch interactions if needed
    },

    PSKeyDown: function(key, shift, ctrl, options) {
        var keyName = this.keyCodeToName(key);
        this.handleKeyPress(key, shift, ctrl, options);
    },

    PSKeyUp: function(key, shift, ctrl, options) {
        var keyName = this.keyCodeToName(key);
        this.handleKeyRelease(key, shift, ctrl, options);
    },

    keyCodeToName: function(key) {
        // Map key codes to key names
        // Perlenspiel key codes are based on ASCII for letters and specific constants for arrows
        if (key === PS.KEY_ARROW_UP) return 'UP';
        if (key === PS.KEY_ARROW_DOWN) return 'DOWN';
        if (key === PS.KEY_ARROW_LEFT) return 'LEFT';
        if (key === PS.KEY_ARROW_RIGHT) return 'RIGHT';
        return String.fromCharCode(key).toUpperCase();
    },

    PSLoop: function(system, options) {
        // Not used since we have a separate timer
    }
};

// Perlenspiel Event Handlers
PS.init = function(system, options) {
    T.PSInit(system, options);
};

PS.touch = function(x, y, data, options) {
    T.PSTouch(x, y, data, options);
};

PS.keyDown = function(key, shift, ctrl, options) {
    T.PSKeyDown(key, shift, ctrl, options);
};

PS.keyUp = function(key, shift, ctrl, options) {
    T.PSKeyUp(key, shift, ctrl, options);
};
