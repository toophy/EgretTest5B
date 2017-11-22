// TypeScript file

namespace xgame {
    export class ShowMap {

        public _accountEnv: tgame.AccountEnv;

        private stage_width: number = 1136;
        private stage_height: number = 640;

        private cnfs: CnfLand;
        private citySprite: Array<egret.Sprite> = [];

        public _viewPos: egret.Point = new egret.Point();
        private _targetViewPos: egret.Point = new egret.Point();
        private _targetViewSpeed: number = 0.1;
        private _targetViewRun: boolean = false;

        public _player: LandPlayer = null;

        private _roles: MapStr<Mecha>;
        private _actions: Array<Mecha> = [];
        private _bullets: Array<Bullet> = [];
        public _easyActorAI: Array<EasyAI> = [];
        private _bulletSprite: egret.Sprite = null;

        public _accountEasyAIs: MapStr<EasyAI>;

        public _tilemap: TileMap = new TileMap();



        public constructor(accountEnv: tgame.AccountEnv) {
            this._accountEnv = accountEnv;

            this._targetViewPos.x = this.stage_width / 2;
            this._targetViewPos.y = this.stage_height / 2;

            this._player = new LandPlayer(this);
            this._roles = new MapStr<Mecha>();

            this._bulletSprite = new egret.Sprite();

            this._accountEasyAIs = new MapStr<EasyAI>();
        }

        public InitNetWorkProc() {
            if (this._accountEnv && this._accountEnv.sceneConn) {
                this._accountEnv.sceneConn.bind("Scene.PlayerEnter", this.onPlayerEnter, this);
                this._accountEnv.sceneConn.bind("Scene.PlayerLeave", this.onPlayerLeave, this);
                this._accountEnv.sceneConn.bind("Scene.Skill", this.onSkill, this);
                this._accountEnv.sceneConn.bind("Scene.PlayerPoint", this.onPlayerPoint, this);
            }
        }

        public AddRole(name: string, x: number, y: number): EasyAI {

            let tmpActor: Mecha = new Mecha(this._accountEnv);
            tmpActor.setName(name);
            tmpActor.setParent(this, this.citySprite[0], x, y);
            tmpActor.setMoveRange(3 * this.stage_width, this.stage_height);

            if (name.length > 0 && tmpActor) {
                this._roles.add(name, tmpActor);
            }

            tmpActor._land = this;

            let tmpActorAI: EasyAI = new EasyAI();
            tmpActorAI.setActor(tmpActor);
            this.AddEasyAI(tmpActorAI);

            return tmpActorAI;
        }

        public SetTargetViewPos(p: egret.Point) {
            let distance: number = egret.Point.distance(this._targetViewPos, p);
            if (distance > 1.0) {
                this._targetViewRun = true;
                this._targetViewPos.x = p.x;
                this._targetViewPos.y = p.y;
                this._targetViewPos.y = this._viewPos.y;
                let speed: number = 5;
                if (distance > 30)
                    speed = 100;
                if (this._viewPos.x <= this._targetViewPos.x) {
                    this._targetViewSpeed = speed;
                } else {
                    this._targetViewSpeed = -speed;
                }
            }
        }

        public ScrollLand() {
            if (!this._targetViewRun) {
                return;
            }

            if (egret.Point.distance(this._targetViewPos, this._viewPos) > Math.abs(this._targetViewSpeed)) {
                let oldx: number = this._viewPos.x;
                this._viewPos.x = oldx + this._targetViewSpeed;
                for (let i = 0; i < this.citySprite.length; ++i) {
                    this.citySprite[i].x += (oldx - this._viewPos.x);
                }
            } else {
                this._targetViewRun = false;
                let oldx: number = this._viewPos.x;
                this._viewPos.x = this._targetViewPos.x;
                for (let i = 0; i < this.citySprite.length; ++i) {
                    this.citySprite[i].x += (oldx - this._viewPos.x);
                }
            }
        }

        public LoadLand(jsonData: any) {
            this.cnfs = <CnfLand>jsonData;

            let cts: egret.Sprite = new egret.Sprite();
            cts.x = 0;
            cts.y = 0;
            cts.width = this.stage_width;
            cts.height = this.stage_height;

            this.citySprite.push(cts);

            this._tilemap.Init(100, 100, 1136, 640);

            for (let i=0;i<this.cnfs.actors.length;++i){
                console.log(this.cnfs.actors[i].type)
            }

            for (let i in this.cnfs.actors) {
                let lc = this.cnfs.actors[i]

                if (lc.type == "shape") {
                    let bg: egret.Shape = new egret.Shape();
                    bg.graphics.beginFill(lc.data.color, 100);
                    bg.graphics.drawRect(0, 0, lc.data.width, lc.data.height);
                    bg.graphics.endFill();
                    bg.x = lc.data.x; 
                    bg.y = lc.data.y;
                    cts.addChild(bg);

                    let _tilemapObj: tgame.Obj = new tgame.Obj(); // 准确位置
                    _tilemapObj.Init(this._accountEnv.MakeObjID(),  bg.x, bg.y, lc.data.width, lc.data.height);
                    this._tilemap.Insert(_tilemapObj,_tilemapObj.Pos);
                } else if (lc.type == "image") {
                    let bg4: egret.Bitmap = new egret.Bitmap(RES.getRes(lc.data.res));
                    bg4.x = lc.data.x;
                    bg4.y = lc.data.y;
                    cts.addChild(bg4);
                   
                    let _tilemapObj: tgame.Obj = new tgame.Obj(); // 准确位置
                    _tilemapObj.Init(this._accountEnv.MakeObjID(), bg4.x, bg4.y,  bg4.width, bg4.height);
                    this._tilemap.Insert(_tilemapObj,_tilemapObj.Pos);
                } else if (lc.type == "animation") {
                    let tmpActor: Mecha = new Mecha(this._accountEnv);
                    tmpActor.setName(lc.data.name);
                    tmpActor.setParent(this, cts, lc.data.x, lc.data.y);
                    tmpActor.setMoveRange(3 * this.stage_width, this.stage_height);

                    if (lc.data.name.length > 0 && tmpActor) {
                        this._roles.add(lc.data.name, tmpActor);
                    }

                    tmpActor._land = this;

                    let tmpActorAI: EasyAI = new EasyAI();
                    tmpActorAI.setActor(tmpActor);
                    this.AddEasyAI(tmpActorAI);
                }
            }

            this._viewPos.setTo(this.stage_width / 2, this.stage_height / 2);

            
        }

        public ShowLand(s: egret.DisplayObjectContainer) {
            for (let i = 0; i < this.citySprite.length; ++i) {
                s.addChild(this.citySprite[i]);
            }
            // 子弹层
            s.addChild(this._bulletSprite);

            // 显示成功
            for (let key in this._roles.items) {
                this._roles.items[key].OnShowland();
            }
            for (let i in this._actions) {
                this._actions[i].OnShowland();
            }
        }

        public DelRole(name: string) {
            if (name.length > 0 && this._roles.has(name)) {
                this._roles.get(name).leaveParent();
                this._roles.del(name);
            }
        }

        public AddAction(a: Mecha) {
            if (a) {
                this._actions.push(a);
            }
        }

        public DelAction(a: Mecha) {
            if (a) {
                a.leaveParent();
                for (let i of this._actions) {
                    if (i == a) {
                        var index = this._actions.indexOf(i, 0);
                        if (index > -1) {
                            this._actions.splice(index, 1);
                        }
                        break;
                    }
                }
            }
        }

        public AddEasyAI(e: EasyAI) {
            if (e) {
                this._easyActorAI.push(e);
            }
        }

        public Update() {

            for (let i in this._easyActorAI) {
                this._easyActorAI[i].update();
            }
            for (let key in this._roles.items) {
                this._roles.items[key].update();
            }
            for (let i in this._actions) {
                this._actions[i].update();
            }

            let i = this._bullets.length;
            while (i--) {
                const bullet = this._bullets[i];
                if (bullet.update()) {
                    this._bullets.splice(i, 1);
                }
            }

            this._player.update();

            //视口滚动
            this.ScrollLand();
        }

        public addBullet(bullet: Bullet): void {
            this._bullets.push(bullet);
        }

        public getBulletLayer(): egret.Sprite {
            return this._bulletSprite;
        }

        public _touchMove(x: number, y: number) {
            if (this._player) {
                this._player._touchMove(x, y);
            }
        }

        public _touchHandler(event: egret.TouchEvent): void {
            if (this._player) {
                this._player._touchHandler(event);
            }
        }

        public _keyHandler(event: KeyboardEvent): void {
            if (this._player) {
                this._player._keyHandler(event);
            }
        }

        public OnMotion(event: egret.MotionEvent): void {
            if (this._player) {
                this._player.OnMotion(event);
            }
        }

        public OnOrientationChange(horiz: boolean): void {
            if (this._player) {
                this._player.OnOrientationChange(horiz);
            }
        }


        /**
         * 网络消息处理
         */
        private onPlayerEnter(data: any, ret: string, msg: string) {
            if (data["account"] == this._accountEnv.account)
                return;
            if (!this._accountEasyAIs.has(data["account"])) {
                let easyAI = this.AddRole(data["account"], data["pos_x"], data["pos_y"]);
                easyAI.enablePlayer(true);
                this._accountEasyAIs.add(data["account"], easyAI);
            }
        }

        private onPlayerLeave(data: any, ret: string, msg: string) {
            if (this._accountEasyAIs.has(data["account"])) {
                let acc = this._accountEasyAIs.get(data["account"]);
                if (acc != null) {
                    this.DelRole(data["account"]);
                    this._accountEasyAIs.del(data["account"]);
                }
            }
        }

        private onSkill(data: any, ret: string, msg: string) {
            if (data["account"] == this._accountEnv.account)
                return;

            if (this._accountEasyAIs.has(data["account"])) {
                let acc = this._accountEasyAIs.get(data["account"]);
                if (acc != null) {
                    switch (data["name"]) {
                        case "move_left":
                            acc.moveLeft(data["isDown"]);
                            break;
                        case "move_right":
                            acc.moveRight(data["isDown"]);
                            break;
                        case "jump":
                            acc.jump(data["isDown"]);
                            break;
                        case "squat":
                            acc.squat(data["isDown"]);
                            break;
                        case "switchWeaponR":
                            acc.switchWeaponR(data["isDown"]);
                            break;
                        case "switchWeaponL":
                            acc.switchWeaponL(data["isDown"]);
                            break;
                        case "aim":
                            acc.getActor().aim(data["x"], data["y"])
                            break;
                        case "attack":
                            acc.getActor().attack(data["begin"]);
                            break;
                    }
                }
            }
        }

        private onPlayerPoint(data: any, ret: string, msg: string) {
            let acc = this._accountEasyAIs.get(data["account"]);
            if (acc != null) {
                switch (data["name"]) {
                    case "update":
                        break;
                }
            }
        }
    }
}

