// TypeScript file

namespace tgame {


    // easy ai
    export class EasyAI {
        public _left: boolean = false;
        public _right: boolean = false;

        private _actor: Mecha = null;
        private _state: number = 0;
        private _lastTime: number = new Date().getTime();
        private _player: boolean = false;

        private static _says: Array<string> = ["呵呵呵", "哈哈哈", "嘿嘿嘿", "叽叽叽叽", "O(∩_∩)O哈哈哈~", "吼吼吼"];

        public constructor() {
        }

        public setActor(a: Mecha) {
            this._actor = a;
        }

        public getActor(): Mecha {
            return this._actor;
        }

        public enablePlayer(e: boolean) {
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
        }

        public update() {
            if (this._player) {
                return;
            }

            let now: number = new Date().getTime();
            if (now > this._lastTime) {

                let new_state = Math.floor(Math.random() * 9);

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
            } else {
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
        }

        public _updateMove(dir: number): void {
            if (this._player) {
                egret.log("updateMove");
            }

            if (this._left && this._right) {
                this._actor.move(dir);
            } else if (this._left) {
                this._actor.move(-1);
            } else if (this._right) {
                this._actor.move(1);
            } else {
                this._actor.move(0);
            }
        }

        public saySome(s: string) {
            this._actor.saySome(s);
        }

        public moveLeft(isDown: boolean) {
            this._left = isDown;
            this._updateMove(-1);
        }

        public moveRight(isDown: boolean) {
            this._right = isDown;
            this._updateMove(1);
        }

        public jump(isDown: boolean) {
            if (isDown) {
                this._actor.jump();
            }
        }

        public squat(isDown: boolean) {
            this._actor.squat(isDown);
        }

        public switchWeaponR(isDown: boolean) {
            if (isDown) {
                this._actor.switchWeaponR();
            }
        }

        public switchWeaponL(isDown: boolean) {
            if (isDown) {
                this._actor.switchWeaponL();
            }
        }

    }
}
