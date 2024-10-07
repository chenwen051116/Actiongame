var T = {
    W: 32,
    H: 32,
    p1: { x: 0, y: 0, c: 0xCD5C5C, h: 5, spd: 1, fx: 1, fy: 0, pn: 1},
    p2: { x: 31, y: 31, c: 0x4169E1, h: 5, spd: 1, fx: -1, fy: 0, pn: 2},
    obs: [],
    bullets: [],
    timer: null,
    over: false,
    obsnum: 20,
    
    init: function() {
        PS.gridSize(this.W, this.H);
        PS.gridColor(0x303030);
        this.addObs();
        this.update();
        PS.statusText("P1: Arrows P2: WASD Shoot: Space/Enter");
    
        this.startTimer();
        p1 = { x: 0, y: 0, c: 0xCD5C5C, h: 5, spd: 1, fx: 1, fy: 0, pn: 1},
        p2 = { x: 31, y: 31, c: 0x4169E1, h: 5, spd: 1, fx: -1, fy: 0, pn: 2}
    },

    startTimer: function() {
        this.timer = PS.timerStart(3, this.updateBullets.bind(this));
    },

    addObs: function() {
        for (let i = 0; i < this.obsnum; i++) {
            let x = Math.floor(Math.random() * this.W);
            let y = Math.floor(Math.random() * this.H);
            this.obs.push({ x: x, y: y });
        }
    },

    update: function() {
        if (this.over) PS.init();
        for (let x = 0; x < this.W; x++) {
            for (let y = 0; y < this.H; y++) {
                PS.color(x, y, PS.COLOR_WHITE);
            }
        }

        for (let i = 0; i < this.obs.length; i++) {
            let o = this.obs[i];
            PS.color(o.x, o.y, 0x808080);
        }

        PS.color(this.p1.x, this.p1.y, this.p1.c);
        PS.color(this.p2.x, this.p2.y, this.p2.c);

        for (let i = 0; i < this.bullets.length; i++) {
            let b = this.bullets[i];
            PS.color(b.x, b.y, 0xFF0000);
        }

        PS.statusText(`P1 HP: ${this.p1.h} | P2 HP: ${this.p2.h}`);

        if (this.p1.h <= 0) {
            PS.statusText("Player 2 Wins!");
            this.over = true;
        } else if (this.p2.h <= 0) {
            PS.statusText("Player 1 Wins!");
            this.over = true;
        }
    },

    move: function(p, dx, dy) {
        let newX = p.x + dx * p.spd;
        let newY = p.y + dy * p.spd;

        if (this.isValid(newX, newY)) {
            p.x = newX;
            p.y = newY;
            p.fx = dx;
            p.fy = dy;
            this.update();
        }
    },

    isValid: function(x, y) {
        if (x < 0 || x >= this.W || y < 0 || y >= this.H) return false;
        for (let i = 0; i < this.obs.length; i++) {
            if (this.obs[i].x === x && this.obs[i].y === y) {
                return false;
            }
        }
        return true;
    },

    shoot: function(p) {
        this.bullets.push({ x: p.x, y: p.y, dx: p.fx, dy: p.fy, pn: p.pn});
    },

    updateBullets: function() {
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            let b = this.bullets[i];
            b.x += b.dx;
            b.y += b.dy;

            if (b.x < 0 || b.x >= this.W || b.y < 0 || b.y >= this.H) {
                this.bullets.splice(i, 1);
                continue;
            }

            if (b.x === this.p1.x && b.y === this.p1.y && b.pn != this.p1.pn) {
                this.p1.h -= 1;
                this.bullets.splice(i, 1);
                continue;
            }

            if (b.x === this.p2.x && b.y === this.p2.y && b.pn != this.p2.pn) {
                this.p2.h -= 1;
                this.bullets.splice(i, 1);
                continue;
            }
        }

        this.update();
    },

    handleKey: function(key) {
        if (this.over) return;

        if (key === PS.KEY_ARROW_UP) this.move(this.p1, 0, -1);
        if (key === PS.KEY_ARROW_DOWN) this.move(this.p1, 0, 1);
        if (key === PS.KEY_ARROW_LEFT) this.move(this.p1, -1, 0);
        if (key === PS.KEY_ARROW_RIGHT) this.move(this.p1, 1, 0);
        if (key === 13) this.shoot(this.p1);

        if (key === 119) this.move(this.p2, 0, -1);  
        if (key === 115) this.move(this.p2, 0, 1);   
        if (key === 97) this.move(this.p2, -1, 0);   
        if (key === 100) this.move(this.p2, 1, 0);   
        if (key === PS.KEY_SPACE) this.shoot(this.p2);
    }
};

PS.init = function(system, options) {
    T.init();
};

PS.keyDown = function(key, shift, ctrl, options) {
    T.handleKey(key);
};
