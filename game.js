var T = {
    W: 20,
    H: 20,
    p1: { x: 0, y: 0, c: 0xCD5C5C, h: 5, spd: 1, fx: 1, fy: 0, pn: 1, bnum: 50, bh: 9 },
    p2: { x: 19, y: 19, c: 0x4169E1, h: 5, spd: 1, fx: -1, fy: 0, pn: 2, bnum: 50, bh: 9 },
    obs: [],
    bullets: [],
    knives: [],
    powerUps: [],
    base: [],
    spdtower: [],
    attower: [],
    timer: null,
    powerUpTimer: null,
    over: false,
    obsnum:100,

    init: function() {
        PS.gridSize(this.W, this.H);
        PS.gridColor(PS.COLOR_WHITE);
        this.addObs();
        this.update();
        PS.statusText("P1: Arrows P2: WASD Shoot: G/[ Knife: F/' Obs: H/P");
        this.startTimers();
    },

    startTimers: function() {
        this.timer = PS.timerStart(3, this.updateBullets.bind(this));
        this.powerUpTimer = PS.timerStart(200, this.generatePowerUp.bind(this)); 
        this.spdTimer = PS.timerStart(120, this.updatespd.bind(this));
        this.atTimer = PS.timerStart(60, this.updateat.bind(this));
    },

    updatespd: function(){
        for(let i = 0; i < this.spdtower.length; i++){
            let spd = this.spdtower[i];
            this.bullets.push({ dfracx: 0, dfracy: 0, isfrac: 0  , fracx: 0.0, fracy: 0.0,   x: spd.x, y: spd.y, dx: 0, dy: -1, pn: spd.pn });
            this.bullets.push({ dfracx: 0, dfracy: 0, isfrac: 0  , fracx: 0.0, fracy: 0.0,   x: spd.x, y: spd.y, dx: 1, dy: 0, pn: spd.pn });
            this.bullets.push({ dfracx: 0, dfracy: 0, isfrac: 0  , fracx: 0.0, fracy: 0.0,   x: spd.x, y: spd.y, dx: -1, dy: 0, pn: spd.pn });
            this.bullets.push({ dfracx: 0, dfracy: 0, isfrac: 0  , fracx: 0.0, fracy: 0.0,   x: spd.x, y: spd.y, dx: 1, dy: 1, pn: spd.pn });
            this.bullets.push({ dfracx: 0, dfracy: 0, isfrac: 0  , fracx: 0.0, fracy: 0.0,   x: spd.x, y: spd.y, dx: -1, dy: -1, pn: spd.pn });
            this.bullets.push({ dfracx: 0, dfracy: 0, isfrac: 0  , fracx: 0.0, fracy: 0.0,   x: spd.x, y: spd.y, dx: 1, dy: -1, pn: spd.pn });
            this.bullets.push({ dfracx: 0, dfracy: 0, isfrac: 0  , fracx: 0.0, fracy: 0.0,   x: spd.x, y: spd.y, dx: -1, dy: 1, pn: spd.pn });
        }
    },

    updateat: function(){
        for(let i = 0; i < this.attower.length; i++){
            let at = this.attower[i];
            if(at.pn == 1){
                if((at.y-this.p2.y)/(at.x-this.p2.x)<=1){
                if(at.x > this.p2.x){
                    this.bullets.push({ dfracx: -1, dfracy: -1.0*(at.y-this.p2.y)/(at.x-this.p2.x), isfrac: 1  , fracx: 0.0, fracy: 0.0,   x: at.x, y: at.y, pn: at.pn });
                }
                else{
                    this.bullets.push({ dfracx: 1, dfracy: 1.0*(at.y-this.p2.y)/(at.x-this.p2.x), isfrac: 1  , fracx: 0.0, fracy: 0.0,   x: at.x, y: at.y,  pn: at.pn});
                }
            }
            else{
                if(at.y > this.p2.y){
                    this.bullets.push({ dfracx: -1.0*(at.x-this.p2.x)/(at.y-this.p2.y), dfracy: -1, isfrac: 1  , fracx: 0.0, fracy: 0.0,   x: at.x, y: at.y, pn: at.pn });
                }
                else{
                    this.bullets.push({ dfracx: 1.0*(at.x-this.p2.x)/(at.y-this.p2.y), dfracy: 1, isfrac: 1  , fracx: 0.0, fracy: 0.0,   x: at.x, y: at.y,  pn: at.pn});
                }
            }

            }
            if(at.pn == 2){
                if((at.y-this.p1.y)/(at.x-this.p1.x)<=1){
                    if(at.x > this.p1.x){
                        this.bullets.push({ dfracx: -1, dfracy: -1.0*(at.y-this.p1.y)/(at.x-this.p1.x), isfrac: 1  , fracx: 0.0, fracy: 0.0,   x: at.x, y: at.y, pn: at.pn });
                    }
                    else{
                        this.bullets.push({ dfracx: 1, dfracy: 1.0*(at.y-this.p1.y)/(at.x-this.p1.x), isfrac: 1  , fracx: 0.0, fracy: 0.0,   x: at.x, y: at.y,  pn: at.pn});
                    }
                }
                else{
                    if(at.y > this.p1.y){
                        this.bullets.push({ dfracx: -1.0*(at.x-this.p1.x)/(at.y-this.p1.y), dfracy: -1, isfrac: 1  , fracx: 0.0, fracy: 0.0,   x: at.x, y: at.y, pn: at.pn });
                    }
                    else{
                        this.bullets.push({ dfracx: 1.0*(at.x-this.p1.x)/(at.y-this.p1.y), dfracy: 1, isfrac: 1  , fracx: 0.0, fracy: 0.0,   x: at.x, y: at.y,  pn: at.pn});
                    }
                }

            }
        }
    },


    addObs: function() {
        for (let i = 0; i < this.obsnum; i++) {
            let x = Math.floor(Math.random() * this.W);
            let y = Math.floor(Math.random() * this.H);
            this.obs.push({ x: x, y: y, h: 20});
        }
    },

    addspd: function(p) {
        if(p == 1){
            if(this.p1.bnum >= 20 && this.isValid(this.p1.x + this.p1.fx, this.p1.y + this.p1.fy)){ 
                this.spdtower.push({ x: this.p1.x + this.p1.fx, y: this.p1.y + this.p1.fy, h: 8, pn: p});
                this.p1.bnum -= 20;
            }
        }
        else{
            if(this.p2.bnum >= 20 && this.isValid(this.p2.x + this.p2.fx, this.p2.y + this.p2.fy)){
                this.spdtower.push({ x: this.p2.x + this.p2.fx, y: this.p2.y + this.p2.fy, h: 8, pn: p});
                this.p2.bnum -= 20;

            }
        }        
    },

    addat: function(p) {
        if(p == 1){
            if(this.p1.bnum >= 20 && this.isValid(this.p1.x + this.p1.fx, this.p1.y + this.p1.fy)){ 
                this.attower.push({ x: this.p1.x + this.p1.fx, y: this.p1.y + this.p1.fy, h: 8, pn: p});
                this.p1.bnum -= 20;
            }
        }
        else{
            if(this.p2.bnum >= 20 && this.isValid(this.p2.x + this.p2.fx, this.p2.y + this.p2.fy)){
                this.attower.push({ x: this.p2.x + this.p2.fx, y: this.p2.y + this.p2.fy, h: 8, pn: p});
                this.p2.bnum -= 20;

            }
        }        
    },

    // updatemove: function(){
    //     this.move(1, this.p1.dx*this.p1.spd, this.p1.dx*this.p1.spd);
    //     this.move(2, this.p2.dx*this.p2.spd, this.p2.dx*this.p2.spd);
    // },

    PaddObs: function(p) {
        if(p == 1){
            if(this.p1.bnum >= 5 && this.isValid(this.p1.x + this.p1.fx, this.p1.y + this.p1.fy)){ 
                this.obs.push({ x: this.p1.x + this.p1.fx, y: this.p1.y + this.p1.fy, h: 20});
                this.p1.bnum -= 5;
            }
        }
        else{
            if(this.p2.bnum >= 5 && this.isValid(this.p2.x + this.p2.fx, this.p2.y + this.p2.fy)){
                this.obs.push({ x: this.p2.x + this.p2.fx, y: this.p2.y + this.p2.fy, h: 20});
                this.p2.bnum -= 5;

            }
        }        
    },

    update: function() {
        if (this.over) return;
        for (let x = 0; x < this.W; x++) {
            for (let y = 0; y < this.H; y++) {
                PS.color(x, y, PS.COLOR_WHITE);
                PS.glyph(x, y, "");
            }
        }

        for (let i = 0; i < this.obs.length; i++) {
            let o = this.obs[i];
            PS.color(o.x, o.y, PS.makeRGB(o.h*255/100,o.h*255/100,o.h*255/100));
        }

        for (let i = 0; i < this.spdtower.length; i++) {
            let spd = this.spdtower[i];
            if(spd.pn == 1){
                PS.color(spd.x, spd.y, PS.makeRGB(255,100,100));
                PS.glyph(spd.x, spd.y, String(spd.h));
            }
            if(spd.pn == 2){
                PS.color(spd.x, spd.y, PS.makeRGB(100,100,255));
                PS.glyph(spd.x, spd.y, String(spd.h));
            }
            if(spd.h <= 0){
                this.spdtower.splice(i, 1);
            }
        }

        for (let i = 0; i < this.attower.length; i++) {
            let spd = this.attower[i];
            if(spd.pn == 1){
                PS.color(spd.x, spd.y, PS.makeRGB(255,100,100));
                PS.glyph(spd.x, spd.y, String(spd.h));
            }
            if(spd.pn == 2){
                PS.color(spd.x, spd.y, PS.makeRGB(100,100,255));
                PS.glyph(spd.x, spd.y, String(spd.h));
            }
            if(spd.h <= 0){
                this.attower.splice(i, 1);
            }
        }

        PS.color(0,0,PS.makeRGB(255,100,100));
        PS.color(this.W-1, this.H-1,PS.makeRGB(100,100,255));
        PS.glyph(0,0,String(this.p1.bh));
        PS.glyph(this.W-1, this.H-1,String(this.p2.bh));
        PS.color(this.p1.x, this.p1.y, this.p1.c);
        PS.color(this.p2.x, this.p2.y, this.p2.c);

        for (let i = 0; i < this.bullets.length; i++) {
            let b = this.bullets[i];
            PS.color(b.x, b.y, 0xFF0000);
        }

        for (let i = 0; i < this.knives.length; i++) {
            let k = this.knives[i];
            PS.color(k.x, k.y, 0xFFA500); 
        }

        for (let i = 0; i < this.powerUps.length; i++) {
            let p = this.powerUps[i];
            PS.color(p.x, p.y, p.type === "health" ? 0x00FF00 : 0x0000FF);
        }

        PS.statusText(`P1 HP: ${this.p1.h} B: ${this.p1.bnum}| P2 HP: ${this.p2.h} B: ${this.p2.bnum}`);

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
            //this.checkPowerUp(p);
            this.update();
        }
        p.fx = dx;
        p.fy = dy;
    },

    isValid: function(x, y) {
        if (x < 0 || x >= this.W || y < 0 || y >= this.H) return false;
        for (let i = 0; i < this.obs.length; i++) {
            if (this.obs[i].x === x && this.obs[i].y === y) {
                return false;
            }
        }
        for (let i = 0; i < this.spdtower.length; i++) {
            if (this.spdtower[i].x === x && this.spdtower[i].y === y) {
                return false;
            }
        }

        for (let i = 0; i < this.attower.length; i++) {
            if (this.attower[i].x === x && this.attower[i].y === y) {
                return false;
            }
        }

        for (let i = 0; i < this.powerUps.length; i++) {
            if (this.powerUps[i].x === x && this.powerUps[i].y === y) {
                return false;
            }
        }
        if ((x == this.p1.x && y ==  this.p1.y) || (x == this.p2.x && y == this.p2.y)){
            return false; 
        }
        return true;
    },

    shoot: function(p) {
        if (p.bnum > 0) {
            this.bullets.push({ dfracx: 0, dfracy: 0, isfrac: 0  , fracx: 0.0, fracy: 0.0,   x: p.x, y: p.y, dx: p.fx, dy: p.fy, pn: p.pn });
            p.bnum -= 1;
        }
    },

    knifeAttack: function(p) {
        let knifeX = p.x + p.fx;
        let knifeY = p.y + p.fy;
        if (knifeX < 0 || knifeX >= this.W || knifeY < 0 || knifeY >= this.H) {
            return;
        }
        let knife = { x: knifeX, y: knifeY, pn: p.pn, blink: 2 }; 

        this.knives.push(knife);
    },

    generatePowerUp: function() {
        let x = Math.floor(Math.random() * this.W);
        let y = Math.floor(Math.random() * this.H);
        let type = Math.random() < 0.5 ? "health" : "bullets";
        this.powerUps.push({ x: x, y: y, type: type });
    },

    // checkPowerUp: function(p) {
    //     for (let i = this.powerUps.length - 1; i >= 0; i--) {
    //         let power = this.powerUps[i];
    //         if (power.x === p.x && power.y === p.y) {
    //             if (power.type === "health") {
    //                 p.h += 1;
    //             } else if (power.type === "bullets") {
    //                 p.bnum += 5;
    //             }
    //             this.powerUps.splice(i, 1);
    //         }
    //     }
    // },

    updateBullets: function() {
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            let b = this.bullets[i];
            if(b.isfrac == 1){
                b.fracx += b.dfracx;
                b.fracy += b.dfracy;
                if(b.fracx >= 1){
                    b.fracx -= 1;
                    b.x += 1;
                }
                if(b.fracx <= -1){
                    b.fracx += 1;
                    b.x -= 1;
                }
                if(b.fracy >= 1){
                    b.fracy -= 1;
                    b.y += 1;
                }
                if(b.fracy <= -1){
                    b.fracy += 1;
                    b.y -= 1;
                }
            }
            else{
                b.x += b.dx;
                b.y += b.dy;
            }
            for (let j = this.powerUps.length - 1; j >= 0; j--) {
                let power = this.powerUps[j];
                if (power.x === b.x && power.y === b.y) {
                    if (power.type === "health") {
                        if (b.pn == 1){
                            this.p1.h += 2;
                        }
                        else{
                            this.p2.h += 2;
                        }
                    } else if (power.type === "bullets") {
                        if (b.pn == 1){
                            this.p1.bnum += 10;
                        }
                        else{
                            this.p2.bnum += 10;
                        }
                    }
                    this.powerUps.splice(j, 1);
                    this.bullets.splice(i, 1);
                    break;
                }
            }

            for (let j = 0; j < this.obs.length; j++) {
                if (this.obs[j].x === b.x && this.obs[j].y === b.y) {
                    this.obs[j].h += 5;
                    if(this.obs[j].h>= 79){
                        this.obs.splice(j, 1);
                    }
                    this.bullets.splice(i, 1);
                    break;
                }
            }

            for (let j = 0; j < this.spdtower.length; j++) {
                let spd = this.spdtower[j];
                if (spd.x === b.x && spd.y === b.y && spd.pn != b.pn) {
                    this.spdtower[j].h -= 1;
                    this.bullets.splice(i, 1);
                    break;
                }
            }

            for (let j = 0; j < this.attower.length; j++) {
                let spd = this.attower[j];
                if (spd.x === b.x && spd.y === b.y && spd.pn != b.pn) {
                    this.attower[j].h -= 1;
                    this.bullets.splice(i, 1);
                    break;
                }
            }

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

            
            if (b.x === 0 && b.y === 0 && b.pn == 2 ) {
                this.p1.bh -= 1;
                if(this.p1.bh <= 0){
                    this.p1.h = 0;
                }
                this.bullets.splice(i, 1);
                continue;
            }

                        
            if (b.x === this.W-1 && b.y === this.H-1 && b.pn == 1 ) {
                this.p2.bh -= 1;
                if(this.p2.bh <= 0){
                    this.p2.h = 0;
                }
                this.bullets.splice(i, 1);
                continue;
            }

        }

        this.updateKnives();
        this.update();
    },

    updateKnives: function() {
        for (let i = this.knives.length - 1; i >= 0; i--) {
            let k = this.knives[i];
            for (let j = this.powerUps.length - 1; j >= 0; j--) {
                let power = this.powerUps[j];
                if (power.x === k.x && power.y === k.y) {
                    if (power.type === "health") {
                        if (k.pn == 1){
                            this.p1.h += 1;
                        }
                        else{
                            this.p2.h += 1;
                        }
                    } else if (power.type === "bullets") {
                        if (k.pn == 1){
                            this.p1.bnum += 20;
                        }
                        else{
                            this.p2.bnum += 20;
                        }
                    }
                    
                    this.powerUps.splice(j, 1);
                    this.knives.splice(i, 1);
                    break;
                }
            }

            for (let j = 0; j < this.obs.length; j++) {
                if (this.obs[j].x === k.x && this.obs[j].y === k.y) {
                    this.obs[j].h += 10;
                    this.knives.splice(i, 1);
                    if(this.obs[j].h >= 79){
                        this.obs.splice(j, 1);
                    }
                    break;
                }
            }

            for (let j = 0; j < this.spdtower.length; j++) {
                let spd = this.spdtower[j];
                if (spd.x === k.x && spd.y === k.y && spd.pn != k.pn) {
                    this.spdtower[j].h -= 1;
                    this.bullets.splice(i, 1);
                    break;
                }
            }

            for (let j = 0; j < this.attower.length; j++) {
                let spd = this.attower[j];
                if (spd.x === k.x && spd.y === k.y && spd.pn != k.pn) {
                    this.attower[j].h -= 1;
                    this.bullets.splice(i, 1);
                    break;
                }
            }

            if (k.blink > 0) {
                k.blink -= 1;
            } else {
                this.knives.splice(i, 1); 
                continue;
            }

            if (k.x === this.p1.x && k.y === this.p1.y && k.pn !== this.p1.pn) {
                this.p1.h -= 1;
                this.knives.splice(i, 1);
                continue;
            }

            if (k.x === this.p2.x && k.y === this.p2.y && k.pn !== this.p2.pn) {
                this.p2.h -= 1;
                this.knives.splice(i, 1);
                continue;
            }

            
        }
    },

    handleKey: function(key) {
       // PS.debug(key);
        if (this.over) return;

        if (key === PS.KEY_ARROW_UP) this.move(this.p1, 0, -1);
        if (key === PS.KEY_ARROW_DOWN) this.move(this.p1, 0, 1);
        if (key === PS.KEY_ARROW_LEFT) this.move(this.p1, -1, 0);
        if (key === PS.KEY_ARROW_RIGHT) this.move(this.p1, 1, 0);
        if (key === 91) this.shoot(this.p1);
        if (key === 93) this.knifeAttack(this.p1);
        if (key === 112) this.PaddObs(1);
        if (key === 187) this.addspd(1);
        if (key === 189) this.addat(1);

        if (key === 119) this.move(this.p2, 0, -1);  
        if (key === 115) this.move(this.p2, 0, 1);   
        if (key === 97) this.move(this.p2, -1, 0);   
        if (key === 100) this.move(this.p2, 1, 0);   
        if (key === 103) this.shoot(this.p2);
        if (key === 102) this.knifeAttack(this.p2);
        if (key === 104) this.PaddObs(2);
        if (key === 114) this.addspd(2);
        if (key === 116) this.addat(2);
    }
};

PS.init = function(system, options) {
    T.init();
};

PS.keyDown = function(key, shift, ctrl, options) {
    T.handleKey(key);
};


