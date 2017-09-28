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
            this._account = "";
            this.landView = l;
        }
        LandPlayer.prototype.update = function () {
            if (this._player != null) {
                var point = new egret.Point();
                this._player.getPoint(point);
                this.landView._base.SetTargetViewPos(point);
            }
        };
        LandPlayer.prototype.setAccount = function (a, ai) {
            this._account = a;
            this._playerAI = ai;
            this._player = ai.getActor();
        };
        // private randomPlayer() {
        //     if (this.landView._easyActorAI.length > 0) {
        //         if (this._playerAI != null) {
        //             this._playerAI.enablePlayer(false);
        //             this._player = null;
        //             this._playerAI = null;
        //         }
        //         let nextPlayer: number = Math.floor(Math.random() * this.landView._easyActorAI.length);
        //         if (nextPlayer < this.landView._easyActorAI.length) {
        //             this._playerAI = this.landView._easyActorAI[nextPlayer];
        //             this._player = this._playerAI.getActor();
        //             this._playerAI.enablePlayer(true);
        //         }
        //     }
        // }
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
        // private TouchNewActor(x: number, y: number) {
        //     // 新建演员
        //     // 属于谁?
        //     let newPos: egret.Point = new egret.Point();
        //     this.citySprite[2].globalToLocal(x, y, newPos)
        //     let tmpActor: Mecha = new Mecha();
        //     tmpActor.setParent(this, this.citySprite[2], newPos.x, 150 /*newPos.y*/);
        //     tmpActor.setMoveRange(3 * 1136, 640);
        //     this._actors.push(tmpActor);
        //     let tmpActorAI: EasyAI = new EasyAI();
        //     tmpActorAI.setActor(tmpActor);
        //     this._easyActorAI.push(tmpActorAI);
        // }
        LandPlayer.prototype._keyHandler = function (event) {
            var isDown = event.type == "keydown";
            // if (event.keyCode == 13) {
            //     if (!isDown) {
            //         this.randomPlayer();
            //     }
            //     return;
            // }
            if (this._player == null) {
                return;
            }
            switch (event.keyCode) {
                case 37:
                case 65:
                    this.landView._netWork.send("Scene", "Skill", { "account": this._account, "name": "move_left", "isDown": isDown });
                    this._playerAI.moveLeft(isDown);
                    break;
                case 39:
                case 68:
                    this.landView._netWork.send("Scene", "Skill", { "account": this._account, "name": "move_right", "isDown": isDown });
                    this._playerAI.moveRight(isDown);
                    break;
                case 38:
                case 87:
                    if (isDown) {
                        this.landView._netWork.send("Scene", "Skill", { "account": this._account, "name": "jump", "isDown": isDown });
                        this._playerAI.jump(isDown);
                    }
                    break;
                case 83:
                case 40:
                    {
                        this.landView._netWork.send("Scene", "Skill", { "account": this._account, "name": "squat", "isDown": isDown });
                        this._playerAI.squat(isDown);
                    }
                    break;
                case 81:
                    if (isDown) {
                        this.landView._netWork.send("Scene", "Skill", { "account": this._account, "name": "switchWeaponR", "isDown": isDown });
                        this._playerAI.switchWeaponR(isDown);
                    }
                    break;
                case 69:
                    if (isDown) {
                        this.landView._netWork.send("Scene", "Skill", { "account": this._account, "name": "switchWeaponL", "isDown": isDown });
                        this._playerAI.switchWeaponL(isDown);
                    }
                    break;
                case 32:
                    if (isDown) {
                        this.landView._netWork.send("Scene", "Skill", { "account": this._account, "name": "switchWeaponR", "isDown": isDown });
                        this.landView._netWork.send("Scene", "Skill", { "account": this._account, "name": "switchWeaponL", "isDown": isDown });
                        this._playerAI.switchWeaponR(isDown);
                        this._playerAI.switchWeaponL(isDown);
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