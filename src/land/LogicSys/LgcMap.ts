// TypeScript file

namespace xgame {

    // 演员
    export class CnfActorBlock {
        public name: string;
        public shape: string;
        public color: number;
        public res: string;
        public x: number;
        public y: number;
        public width: number;
        public height: number;
    }
    // 演员类型配置
    export class CnfActorRow {
        public type: string;
        public data: CnfActorBlock;
    }
    // 陆地配置
    export class CnfLand {
        public actors: Array<CnfActorRow>;
    }

    // 逻辑地图
    export class LgcMap {
        protected initOk: boolean;
        public W: number;
        public H: number;
        protected tileW: number;
        protected tileH: number;
        protected realW: number;
        protected realH: number;
        public CellCount: number;
        public Cells: Array<Cell>;

        private stage_width: number = 1136;
        private stage_height: number = 640;
        private cnfs: CnfLand;
        public _roles: MapNum<LgcRole>;


        constructor(accountEnv: tgame.AccountEnv) {
            this.initOk = false;
            this.W = 0;
            this.H = 0;
            this.tileW = 0;
            this.tileH = 0;
            this.realW = 0;
            this.realH = 0;
            this.CellCount = 0;
            this.Cells = new Array<Cell>();

            this._roles = new MapNum<LgcRole>();
        }

        // Init 初始化TileMap
        public Init(tileW: number, tileH: number, realW: number, realH: number): boolean {

            if (tileW < 1 || tileH < 1 || realW < 0 || realH < 0 || tileW > realW || tileH > realH) {
                return false;
            }

            this.Destroy();
            this.realW = realW;
            this.realH = realH;
            this.tileW = tileW;
            this.tileH = tileH;
            this.W = Math.floor((realW + tileW - 1) / tileW);
            this.H = Math.floor((realH + tileH - 1) / tileH);

            this.CellCount = this.W * this.H;
            this.initOk = true;

            this.Clear();

            return true;
        }


        // GetCrossCells 获取矩形交叉的Cell
        public GetCrossCells(x: number, y: number, w: number, h: number): Array<number> {
            let rets = new Array<number>();
            if (x < 0 || y < 0 || w < 0 || h < 0 || x + w > this.realW || y + h > this.realH) {
                return rets;
            }
            let x2: number = x + w;
            let y2: number = y + h;
            let cx: number = Math.floor(x / this.tileW);
            let cy: number = Math.floor(y / this.tileH);
            let cx2: number = Math.floor(x2 / this.tileW);
            let cy2: number = Math.floor(y2 / this.tileH);
            for (let r: number = cy; r <= cy2; r++) {
                for (let c: number = cx; c <= cx2; c++) {
                    rets.push(r * this.W + c);
                }
            }
            return rets;
        }

        // CanInsert 检查对象使用新矩形能否插入
        public CanInsert(x: number, y: number, w: number, h: number, o: Obj): boolean {
            if (o == null) {
                return false;
            }

            let newCells: Array<number> = this.GetCrossCells(x, y, w, h);
            if (newCells.length == 0) {
                return false;
            }

            for (let v in newCells) {
                for (let cv in this.Cells[newCells[v]].Objs.items) {
                    if (o.ID != this.Cells[newCells[v]].Objs.items[cv].ID &&
                        this.Cells[newCells[v]].Objs.items[cv].Pos.Cross(x, y, w, h)) {
                        return false;
                    }
                }
            }

            return true;
        }

        // Insert 进行插入
        public Insert(o: Obj, newRect: Rect): boolean {
            if (o != null) {
                if (newRect != null) {
                    o.Pos = newRect;
                }
                if (this.CanInsert(o.Pos.X, o.Pos.Y, o.Pos.W, o.Pos.H, o)) {
                    // 褪色
                    for (let v in o.Cells) {
                        this.Cells[o.Cells[v]].Objs.del(o.ID);
                    }
                    // 染色
                    let newCells = this.GetCrossCells(o.Pos.X, o.Pos.Y, o.Pos.W, o.Pos.H);
                    for (let v in newCells) {
                        this.Cells[newCells[v]].Objs.add(o.ID, o);
                    }
                    o.Cells = newCells
                    return true
                }
            }
            return false
        }

        // // Erase 擦除一个对象
        public Erase(o: Obj) {
            if (o != null) {
                // 褪色
                for (let v in o.Cells) {
                    this.Cells[o.Cells[v]].Objs.del(o.ID);
                }
            }
        }

        // Clear 清除所有对象痕迹
        public Clear() {
            if (this.initOk) {
                for (let i: number = 0; i < this.CellCount; i++) {
                    this.Cells[i] = new Cell();
                }
            }
        }

        // Destroy 摧毁TileMap
        public Destroy() {
            if (this.initOk) {
                this.W = 0;
                this.H = 0;
                this.tileW = 0;
                this.tileH = 0;
                this.realW = 0;
                this.realH = 0;
                this.Cells = null;
                this.CellCount = 0;
                this.initOk = false;
            }
        }

        public InitNetWorkProc() {
            if (GetMain().sceneConn) {
                GetMain().sceneConn.bind("Scene.PlayerEnter", this.onPlayerEnter, this);
                GetMain().sceneConn.bind("Scene.PlayerLeave", this.onPlayerLeave, this);
                GetMain().sceneConn.bind("Scene.Skill", this.onSkill, this);
                GetMain().sceneConn.bind("Scene.PlayerPoint", this.onPlayerPoint, this);
            }
        }

        public AddRole(name: string, x: number, y: number): EasyAI {

            let tmpActor: LgcRole = new LgcRole();
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

        public DelRole(name: string) {
            if (name.length > 0 && this._roles.has(name)) {
                this._roles.get(name).leaveParent();
                this._roles.del(name);
            }
        }


        public LoadLand(jsonData: any) {
            this.cnfs = <CnfLand>jsonData;

            this.Init(100, 100, 1136, 640);

            for (let i in this.cnfs.actors) {
                let lc = this.cnfs.actors[i]

                if (lc.type == "shape") {
                    let _tilemapObj: tgame.Obj = new tgame.Obj(); // 准确位置
                    _tilemapObj.Init(GetMain().MakeObjID(), bg.x, bg.y, lc.data.width, lc.data.height);
                    this.Insert(_tilemapObj, _tilemapObj.Pos);
                } else if (lc.type == "image") {
                    let _tilemapObj: tgame.Obj = new tgame.Obj(); // 准确位置
                    _tilemapObj.Init(GetMain().MakeObjID(), bg4.x, bg4.y, bg4.width, bg4.height);
                    this.Insert(_tilemapObj, _tilemapObj.Pos);
                } else if (lc.type == "animation") {
                    let tmpActor: LgcRole = new LgcRole();
                    if (lc.data.name.length > 0 && tmpActor) {
                        this._roles.add(lc.data.name, tmpActor);
                    }

                    tmpActor._land = this;

                    let tmpActorAI: EasyAI = new EasyAI();
                    tmpActorAI.setActor(tmpActor);
                    this.AddEasyAI(tmpActorAI);
                }
            }
        }

        public Update() {
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
            if (data["account"] == GetMain().account)
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
            if (data["account"] == GetMain().account)
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

