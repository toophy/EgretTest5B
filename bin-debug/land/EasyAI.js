// TypeScript file
var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var tgame;
(function (tgame) {
    // easy ai
    var EasyAI = (function () {
        function EasyAI() {
            this._left = false;
            this._right = false;
            this._actor = null;
            this._state = 0;
            this._lastTime = new Date().getTime();
            this._player = false;
        }
        EasyAI.prototype.setActor = function (a) {
            this._actor = a;
        };
        EasyAI.prototype.getActor = function () {
            return this._actor;
        };
        EasyAI.prototype.enablePlayer = function (e) {
            this._player = e;
            if (this._player) {
                //"null":
                this._state = 0;
                this._left = false;
                this._right = false;
                this._actor.attack(false);
                this._updateMove(0);
                this._lastTime = new Date().getTime() + 1000;
            }
        };
        EasyAI.prototype.update = function () {
            if (this._player) {
                return;
            }
            var now = new Date().getTime();
            if (now > this._lastTime) {
                var new_state = Math.floor(Math.random() * 9);
                if (new_state != this._state || this._state != 0) {
                    this._state = new_state;
                    switch (this._state) {
                        case 0://"null":
                            this._left = false;
                            this._right = false;
                            this._updateMove(0);
                            this._lastTime = new Date().getTime() + 1000;
                            break;
                        case 1://"left_walk":
                            this._left = true;
                            this._right = false;
                            this._updateMove(-1);
                            this._lastTime = new Date().getTime() + 3000;
                            break;
                        case 2://"right_walk":
                            this._right = true;
                            this._left = false;
                            this._updateMove(1);
                            this._lastTime = new Date().getTime() + 3000;
                            break;
                        case 3://"jump":
                            this._actor.jump();
                            this._lastTime = new Date().getTime() + 3000;
                            break;
                        case 4://
                            this._actor.switchWeaponR();
                            this._lastTime = new Date().getTime() + 500;
                            break;
                        case 5://
                            this._actor.switchWeaponL();
                            this._lastTime = new Date().getTime() + 500;
                            break;
                        case 6://
                            this._actor.attack(true);
                            this._lastTime = new Date().getTime() + 1000;
                            break;
                        case 7://
                            this._actor.attack(false);
                            this._lastTime = new Date().getTime() + 500;
                            break;
                        case 8:// 喊话
                            this.saySome(EasyAI._says[Math.floor(Math.random() * EasyAI._says.length)]);
                            break;
                    }
                }
            }
            else {
                switch (this._state) {
                    case 1://"left_walk":
                        this._left = true;
                        this._right = false;
                        this._updateMove(-1);
                        break;
                    case 2://"right_walk":
                        this._right = true;
                        this._left = false;
                        this._updateMove(1);
                        break;
                    case 3://"jump":
                        this._actor.jump();
                        break;
                    case 4://
                        break;
                }
            }
        };
        EasyAI.prototype._updateMove = function (dir) {
            if (this._player) {
                egret.log("updateMove");
            }
            if (this._left && this._right) {
                this._actor.move(dir);
            }
            else if (this._left) {
                this._actor.move(-1);
            }
            else if (this._right) {
                this._actor.move(1);
            }
            else {
                this._actor.move(0);
            }
        };
        EasyAI.prototype.saySome = function (s) {
            this._actor.saySome(s);
        };
        EasyAI.prototype.moveLeft = function (isDown) {
            this._left = isDown;
            this._updateMove(-1);
        };
        EasyAI.prototype.moveRight = function (isDown) {
            this._right = isDown;
            this._updateMove(1);
        };
        EasyAI.prototype.jump = function (isDown) {
            if (isDown) {
                this._actor.jump();
            }
        };
        EasyAI.prototype.squat = function (isDown) {
            this._actor.squat(isDown);
        };
        EasyAI.prototype.switchWeaponR = function (isDown) {
            if (isDown) {
                this._actor.switchWeaponR();
            }
        };
        EasyAI.prototype.switchWeaponL = function (isDown) {
            if (isDown) {
                this._actor.switchWeaponL();
            }
        };
        EasyAI._says = ["呵呵呵", "哈哈哈", "嘿嘿嘿", "叽叽叽叽", "O(∩_∩)O哈哈哈~", "吼吼吼"];
        return EasyAI;
    }());
    tgame.EasyAI = EasyAI;
    __reflect(EasyAI.prototype, "tgame.EasyAI");
})(tgame || (tgame = {}));
//# sourceMappingURL=EasyAI.js.map