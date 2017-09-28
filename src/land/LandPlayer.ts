// TypeScript file
// TypeScript file

namespace tgame {
    export class LandPlayer {

        private _player: Mecha = null;
        private _playerAI: EasyAI = null;
        private landView: LandView = null;

        public constructor(l: LandView){
            this.landView = l;
        }

        public update()
        {
            if (this._player != null) {
                let point: egret.Point = new egret.Point();
                this._player.getPoint(point);
                this.landView._base.SetTargetViewPos(point);
            }
        }

        private randomPlayer() {
            if (this.landView._easyActorAI.length > 0) {
                if (this._playerAI != null) {
                    this._playerAI.enablePlayer(false);
                    this._player = null;
                    this._playerAI = null;
                }

                let nextPlayer: number = Math.floor(Math.random() * this.landView._easyActorAI.length);
                if (nextPlayer < this.landView._easyActorAI.length) {
                    this._playerAI = this.landView._easyActorAI[nextPlayer];
                    this._player = this._playerAI.getActor();
                    this._playerAI.enablePlayer(true);
                }
            }
        }

        public _touchMove(x: number, y: number) {
            if (this._player != null) {
                this._player.aim(x, y);
            }
        }

        public _touchHandler(event: egret.TouchEvent): void {
            if (this._player != null) {
                this._player.aim(event.stageX, event.stageY);

                if (event.type == egret.TouchEvent.TOUCH_BEGIN) {
                    this._player.attack(true);
                } else {
                    this._player.attack(false);
                }

                //this.TouchNewActor(event.stageX, event.stageY);
            }
        }

        public _keyHandler(event: KeyboardEvent): void {

            const isDown: boolean = event.type == "keydown";
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
        }

    }
}

