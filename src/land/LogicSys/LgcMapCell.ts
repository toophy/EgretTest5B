// TypeScript file
namespace xgame {
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
}
