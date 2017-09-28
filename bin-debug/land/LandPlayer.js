// TypeScript file
// TypeScript file
var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var tgame;
(function (tgame) {
    var LandPlayer = (function () {
        function LandPlayer(l) {
            this._player = null;
            this._playerAI = null;
            this.landView = null;
            this.landView = l;
        }
        LandPlayer.prototype.update = function () {
            if (this._player != null) {
                var point = new egret.Point();
                this._player.getPoint(point);
                this.landView._base.SetTargetViewPos(point);
            }
        };
        LandPlayer.prototype.randomPlayer = function () {
            if (this.landView._easyActorAI.length > 0) {
                if (this._playerAI != null) {
                    this._playerAI.enablePlayer(false);
                    this._player = null;
                    this._playerAI = null;
                }
                var nextPlayer = Math.floor(Math.random() * this.landView._easyActorAI.length);
                if (nextPlayer < this.landView._easyActorAI.length) {
                    this._playerAI = this.landView._easyActorAI[nextPlayer];
                    this._player = this._playerAI.getActor();
                    this._playerAI.enablePlayer(true);
                }
            }
        };
        LandPlayer.prototype._touchMove = function (x, y) {
            if (this._player != null) {
                this._player.aim(x, y);
            }
        };
        LandPlayer.prototype._touchHandler = function (event) {
            if (this._player != null) {
                this._player.aim(event.stageX, event.stageY);
                if (event.type == egret.TouchEvent.TOUCH_BEGIN) {
                    this._player.attack(true);
                }
                else {
                    this._player.attack(false);
                }
                //this.TouchNewActor(event.stageX, event.stageY);
            }
        };
        LandPlayer.prototype._keyHandler = function (event) {
            var isDown = event.type == "keydown";
            if (event.keyCode == 13) {
                if (!isDown) {
                    this.randomPlayer();
                }
                return;
            }
            if (this._player == null) {
                return;
            }
            switch (event.keyCode) {
                case 37:
                case 65:
                    {
                        this._playerAI._left = isDown;
                        this._playerAI._updateMove(-1);
                    }
                    break;
                case 39:
                case 68:
                    {
                        this._playerAI._right = isDown;
                        this._playerAI._updateMove(1);
                    }
                    break;
                case 38:
                case 87:
                    if (isDown) {
                        this._player.jump();
                    }
                    break;
                case 83:
                case 40:
                    {
                        this._player.squat(isDown);
                    }
                    break;
                case 81:
                    if (isDown) {
                        this._player.switchWeaponR();
                    }
                    break;
                case 69:
                    if (isDown) {
                        this._player.switchWeaponL();
                    }
                    break;
                case 32:
                    if (isDown) {
                        this._player.switchWeaponR();
                        this._player.switchWeaponL();
                    }
                    break;
            }
        };
        return LandPlayer;
    }());
    tgame.LandPlayer = LandPlayer;
    __reflect(LandPlayer.prototype, "tgame.LandPlayer");
})(tgame || (tgame = {}));
//# sourceMappingURL=LandPlayer.js.map