// TypeScript file

namespace xgame {

    // easy ai
    export class LgcRole extends Obj {
        public _left: boolean = false;
        public _right: boolean = false;
        
        public _isJumpingA: boolean = false;
        public _isJumpingB: boolean = false;
        private _isSquating: boolean = false;
        private _isAttackingA: boolean = false;
        private _isAttackingB: boolean = false;
        private _weaponRIndex: number = 0;
        private _weaponLIndex: number = 0;
        private _faceDir: number = 1;
        private _aimDir: number = 0;
        private _moveDir: number = 0;
        private _aimRadian: number = 0;
        public _speedX: number = 0;
        public _speedY: number = 0;

        private _state: number = 0;

        private _ground_y: number = 0;
        private _moveRangeWidth: number = 0;
        private _moveRangeHeight: number = 0;
        public _land: LgcMap = null;

        public constructor() {
            super();
        }

        public setActor() {
            this.Init(GetMain().MakeObjID(), 50, 50, 100, 100);
        }

        public updateActorShow(point: egret.Point) {
            this.Pos.X = point.x - Math.floor(this.Pos.W / 2);
            this.Pos.Y = point.y - this.Pos.H;
            this._land.Insert(this, this.Pos);
        }

        public isStopMove(): boolean {
            return !this._player && this._state == 0;
        }

        public update() {

            // if (this._state != 0 || this._player) {
            let point = new egret.Point();
            this._actor.getPoint(point);
            let currX = point.x;
            let currY = point.y;
            let currSpeedX = this._speedX;
            let currSpeedY = this._speedY;
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
                currSpeedY += GetMain().G;
                tmpY += currSpeedY;
            }

            if (this._actor._parent.stage != null) {
                let newRect = new Rect();
                newRect.W = this.Pos.W;
                newRect.H = this.Pos.H;
                newRect.X = tmpX - Math.floor(this.Pos.W / 2);
                newRect.Y = tmpY - this.Pos.H;


                if (!this._land._tilemap.CanInsert(newRect.X, newRect.Y, newRect.W, newRect.H, this._tilemapObj)) {
                    if (this._state == 9) {
                        this._state = 0;
                        this._left = false;
                        this._right = false;
                        this._actor.toIdle();
                    } else {

                        let newGRect = new Rect();
                        newGRect.W = this.Pos.W;
                        newGRect.H = this.Pos.H;
                        newGRect.X = currX - Math.floor(this.Pos.W / 2);
                        newGRect.Y = tmpY - this.Pos.H;

                        if (!this._land._tilemap.CanInsert(newGRect.X, newGRect.Y, newGRect.W, newGRect.H, this._tilemapObj)) {
                            if (this._state != 0) {
                                this._state = 0;
                                this._left = false;
                                this._right = false;
                                this._actor.toIdle();
                            }
                        } else {
                            this._state = 9;
                            this._left = false;
                            this._right = false;
                            this._speedX = 0;

                            nextX = tmpX;
                            nextY = tmpY;
                            this._land._tilemap.Insert(this._tilemapObj, newGRect);
                            return;
                        }
                    }

                    this._updateMove(0);
                    return;
                } else {
                    nextX = tmpX;
                    nextY = tmpY;
                    this._land._tilemap.Insert(this._tilemapObj, newRect);
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
    }
}
