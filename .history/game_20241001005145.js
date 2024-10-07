var T = {
    W: 32,
    H: 32,
    P1: { x: 1, y: 7, color: 0xCD5C5C, health: 5, speed: 1 },
    P2: { x: 30, y: 7, color: 0x4169E1, health: 5, speed: 1 },
    obstacles: [],
    powerUps: [],
    projectiles: [],
    projectileTimer: null,
    gameOver: false,

    init: function() {
        PS.gridSize(this.W, this.H);
        PS.gridColor(0x303030);
        this.placeObstacles();
        this.updateBoard();
        PS.statusText("P1: Arrows | P2: WASD | Attack: Space/Shift");
        this.startProjectileTimer();  // Start the projectile timer
    },

    startProjectileTimer: function() {
        this.projectileTimer = PS.timerStart(6, this.updateProjectiles.bind(this));
    },

    placeObstacles: function() {
        for (let i = 0; i < 10; i++) {
            let x = Math.floor(Math.random() * this.W);
            let y = Math.floor(Math.random() * this.H);
            this.obstacles.push({ x: x, y: y });
        }
    },

    updateBoard: function() {
        if (this.gameOver) return;
        for (let x = 0; x < this.W; x++) {
            for (let y = 0; y < this.H; y++) {
                PS.color(x, y, PS.COLOR_WHITE);  // Clear the grid
            }
        }

        // Draw obstacles
        for (let i = 0; i < this.obstacles.length; i++) {
            let obs = this.obstacles[i];
            PS.color(obs.x, obs.y, 0x808080);  // Gray obstacles
        }

        for (let i = 0; i < this.powerUps.length; i++) {
            let power = this.powerUps[i];
            PS.color(power.x, power.y, 0x00FF00);  
        }

        PS.color(this.P1.x, this.P1.y, this.P1.color);
        PS.color(this.P2.x, this.P2.y, this.P2.color);

        for (let i = 0; i < this.projectiles.length; i++) {
            let proj = this.projectiles[i];
            PS.color(proj.x, proj.y, 0xFF0000);  // Red projectile
        }

        // Display health
        PS.statusText(`P1 Health: ${this.P1.health} | P2 Health: ${this.P2.health}`);

        if (this.P1.health <= 0) {
            PS.statusText("Player 2 Wins!");
            this.gameOver = true;
        } else if (this.P2.health <= 0) {
            PS.statusText("Player 1 Wins!");
            this.gameOver = true;
        }
    },

    movePlayer: function(player, dx, dy) {
        let newX = player.x + dx * player.speed;
        let newY = player.y + dy * player.speed;

        if (this.isValidMove(newX, newY)) {
            player.x = newX;
            player.y = newY;
            this.checkPowerUp(player);
            this.updateBoard();
        }
    },

    isValidMove: function(x, y) {
        if (x < 0 || x >= this.W || y < 0 || y >= this.H) return false;

        for (let i = 0; i < this.obstacles.length; i++) {
            if (this.obstacles[i].x === x && this.obstacles[i].y === y) {
                return false;
            }
        }
        return true;
    },

    checkPowerUp: function(player) {
        for (let i = 0; i < this.powerUps.length; i++) {
            let power = this.powerUps[i];
            if (power.x === player.x && power.y === player.y) {
                player.health += 1;
                this.powerUps.splice(i, 1);
                break;
            }
        }
    },

    shootProjectile: function(player, dx, dy) {
        this.projectiles.push({ x: player.x, y: player.y, dx: dx, dy: dy });
    },

    updateProjectiles: function() {
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            let proj = this.projectiles[i];
            proj.x += proj.dx;
            proj.y += proj.dy;

            if (proj.x < 0 || proj.x >= this.W || proj.y < 0 || proj.y >= this.H) {
                this.projectiles.splice(i, 1);  
                continue;
            }
            if (proj.x === this.P1.x && proj.y === this.P1.y) {
                this.P1.health -= 1;
                this.projectiles.splice(i, 1);
                continue;
            }
            if (proj.x === this.P2.x && proj.y === this.P2.y) {
                this.P2.health -= 1;
                this.projectiles.splice(i, 1);
                continue;
            }
        }

        this.updateBoard();
    },

    handleKeyPress: function(key) {
        if (this.gameOver) return;
        PS.debug(key);
        if (key === PS.KEY_ARROW_UP) this.movePlayer(this.P1, 0, -1);
        if (key === PS.KEY_ARROW_DOWN) this.movePlayer(this.P1, 0, 1);
        if (key === PS.KEY_ARROW_LEFT) this.movePlayer(this.P1, -1, 0);
        if (key === PS.KEY_ARROW_RIGHT) this.movePlayer(this.P1, 1, 0);
        if (key === 13) this.shootProjectile(this.P1, 1, 0);  

        if (key === 119) this.movePlayer(this.P2, 0, -1);  // W
        if (key === 115) this.movePlayer(this.P2, 0, 1);   // S
        if (key === 97) this.movePlayer(this.P2, -1, 0);   // A
        if (key === 100) this.movePlayer(this.P2, 1, 0);   // D
        if (key === PS.KEY_SPACE) this.shootProjectile(this.P2, -1, 0);  
    }
};

PS.init = function(system, options) {
    T.init();
};

PS.keyDown = function(key, shift, ctrl, options) {
    T.handleKeyPress(key);
};
