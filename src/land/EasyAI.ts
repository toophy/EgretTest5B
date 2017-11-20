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

        public _tilemapObj: tgame.Obj = new tgame.Obj(); // 准确位置
        // 模拟位置(当前模拟位置---用于显示)
        // 模拟位置用 "时间" 来计算具体位置, 时间到, 计算下一个"准确位置", 再次进行模拟
        // 模拟位置 追随 准确位置, 追到了就设定下一个准确位置

        public constructor() {
        }

        public setActor(a: Mecha) {
            this._actor = a;
            this._tilemapObj.Init(this._actor._land._accountEnv.MakeObjID(), 0, 0, 100, 100);
            a.setEasyAI(this);
        }

        public getActor(): Mecha {
            return this._actor;
        }

        public updateActorShow(point: egret.Point) {
            this._tilemapObj.Pos.X = point.x - Math.floor(this._tilemapObj.Pos.W / 2);
            this._tilemapObj.Pos.Y = point.y - this._tilemapObj.Pos.H;
            this._actor._land._tilemap.Insert(this._tilemapObj, this._tilemapObj.Pos);
        }

        public isStopMove(): boolean {
            return !this._player && this._state == 0 ;
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

        public updateNextFrame() {

        }

        public update() {
            if (this._player) {
                return;
            }

            if (this._state != 0) {
                let point = new egret.Point();
                this._actor.getPoint(point);
                let currX = point.x;
                let currY = point.y;
                let currSpeedX = this._actor._speedX;
                let currSpeedY = this._actor._speedY;
                let moveRangeWidth = 1136;
                let moveRangeHeight = 640;

                let nextX = 0;
                let nextY = 0;
                let nextSpeedX = 0;
                let nextSpeedY = 0;

                let tmpX = currX;
                let tmpY = currY;
                if (currSpeedX != 0) {
                    tmpX += currSpeedX;
                    if (tmpX < 0) {
                        tmpX = 0;
                    } else if (tmpX > moveRangeWidth) {
                        tmpX = moveRangeWidth;
                    }
                }

                if (currSpeedY != 0) {
                    currSpeedY += this._actor._accountEnv.G;
                    tmpY += currSpeedY;
                }

                if (this._actor._parent.stage != null) {
                    let newRect = new Rect();
                    newRect.W = this._tilemapObj.Pos.W;
                    newRect.H = this._tilemapObj.Pos.H;
                    newRect.X = tmpX - Math.floor(this._tilemapObj.Pos.W / 2);
                    newRect.Y = tmpY - this._tilemapObj.Pos.H;


                    if (!this._actor._land._tilemap.CanInsert(newRect.X, newRect.Y, newRect.W, newRect.H, this._tilemapObj)) {
                        this._state = 0;
                        this._left = false;
                        this._right = false;
                        this._updateMove(0);
                        this._lastTime = new Date().getTime() + 1000;
                        return
                    } else {
                        nextX = tmpX;
                        nextY = tmpY;
                        this._actor._land._tilemap.Insert(this._tilemapObj, newRect);

                        // if (this._actor._land._tilemap.shapebg.parent == null) {
                        //     this._actor._accountEnv.GetRootDisplay().addChild(this._actor._land._tilemap.shapebg);
                        // }
                        // if (this._tilemapObj.ID == 2) {
                        //     this._actor._land._tilemap.FocusShape(newRect);
                        // }
                    }
                }
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
                        // case 3://"jump":
                        //     this._actor.jump();
                        //     this._lastTime = new Date().getTime() + 3000;
                        //     break;
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
