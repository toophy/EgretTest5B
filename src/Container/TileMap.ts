// TypeScript file

namespace tgame {
    // 方向定义
    enum Dir {
        Up = 1,  // 向左
        Down,  // 向右
        Left,  // 向上
        Right  // 向下
    }

    // Rect 矩形
    export class Rect {
        public X: number;
        public Y: number;
        public W: number; // 最小值 1
        public H: number; // 最小值 1

        constructor() {
            this.X = 0;
            this.Y = 0;
            this.W = 0;
            this.H = 0;
        }

        // CrossEx 碰撞
        public CrossEx(a: Rect): boolean {
            return this.Cross(a.X, a.Y, a.W, a.H);
        }

        // Cross 碰撞
        public Cross(x: number, y: number, w: number, h: number): boolean {
            if (x + w - 1 < this.X) {
                return false;
            }
            if (x > this.X + this.W - 1) {
                return false;
            }
            if (y + h - 1 < this.Y) {
                return false;
            }
            if (y > this.Y + this.H - 1) {
                return false;
            }
            return true;
        }

    }


    // Obj 地图对象
    export class Obj {
        public ID: number;
        public Pos: Rect;
        public SpeedX: number;
        public SpeedY: number;
        public Cells: Array<number>; // 最后一次染色单元格

        constructor() {
            this.ID = 0;
            this.Pos = new Rect();
            this.SpeedX = 0;
            this.SpeedY = 0;
            this.Cells = new Array<number>();
        }

        public Init(id: number, x: number, y: number, w: number, h: number) {
            this.ID = id;
            this.Pos.X = x;
            this.Pos.Y = y;
            this.Pos.W = w;
            this.Pos.H = h;
            this.SpeedX = 0;
            this.SpeedY = 0;
        }
    }

    // Cell 地图单元格
    export class Cell {
        public Objs: MapNum<Obj>;

        constructor() {
            this.Objs = new MapNum<Obj>();
        }
    }


    // TileMap 染色 tile, 一个物品可以挂在多个tile下面, 用来进行碰撞抽检, 用ID作为碰撞顺序标准
    export class TileMap {
        protected initOk: boolean;
        public W: number;
        public H: number;
        protected tileW: number;
        protected tileH: number;
        protected realW: number;
        protected realH: number;
        public CellCount: number;
        public Cells: Array<Cell>;

        public shapebg: egret.Shape = new egret.Shape();

        constructor() {
            this.initOk = false;
            this.W = 0;
            this.H = 0;
            this.tileW = 0;
            this.tileH = 0;
            this.realW = 0;
            this.realH = 0;
            this.CellCount = 0;
            this.Cells = new Array<Cell>();
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

        public FocusShape(newRect: Rect) {
            this.shapebg.graphics.beginFill(3000, 100);
            this.shapebg.graphics.drawRect(0, 0, newRect.W, newRect.H);
            this.shapebg.graphics.endFill();
            this.shapebg.x = newRect.X + 1136/2;
            this.shapebg.y = newRect.Y;
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



    }

}