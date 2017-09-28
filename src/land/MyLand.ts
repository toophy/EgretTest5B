// TypeScript file

namespace tgame {
    export class LandView {

        public _base: LandBase = null;
        public _player: LandPlayer = null;
        public _netWork: LandNetwork = null;

        private _actors: Array<Mecha> = [];
        private _bullets: Array<Bullet> = [];
        public _easyActorAI: Array<EasyAI> = [];
        private _bulletSprite: egret.Sprite = null;

        public constructor() {
            this._base = new LandBase(this);
            this._player = new LandPlayer(this);
            this._netWork = new LandNetwork(this);

            this._bulletSprite = new egret.Sprite();

        }

        public LoadLand(jsonData: any) {
            this._base.LoadLand(jsonData);
        }

        public ShowLand(s: egret.Sprite) {
            this._base.ShowLand(s);
            // 子弹层
            s.addChild(this._bulletSprite);

            this._netWork.AccountLogin("lady", "gaga");
        }

        public AddActor(a: Mecha) {
            if (a) {
                this._actors.push(a);
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
            for (let i in this._actors) {
                this._actors[i].update();
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
            this._base.ScrollLand();
        }

        public addBullet(bullet: Bullet): void {
            this._bullets.push(bullet);
        }

        public getBulletLayer(): egret.Sprite {
            return this._bulletSprite;
        }

        public _touchMove(x: number, y: number) {
            this._player._touchMove(x, y);
        }

        public _touchHandler(event: egret.TouchEvent): void {
            this._player._touchHandler(event);
        }

        public _keyHandler(event: KeyboardEvent): void {
            this._player._keyHandler(event);
        }


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

    }

    // land 再次划分
    // 分为 页, 行, 列
    // 第一页 : 背景
    //         上 中上 中 下 四行
    // 第二页 : 建筑
    //         上 中上 中 下 四行, 一般是由中上行存在建筑
    // 第三页 : 角色
    //         上 中上 中 下 四行, 一般是由中行存在角色
    // 第四页 : 装饰
    //         上 中上 中 下 四行, 一般是下行存在装饰
    //
    // Load 一个城市的配置, 分为不同页
    //
    // 依据上面的结论, 提前划分为不同的sprite, 按照显示顺序排排队
    // 第一页 上, 第二页 上,...
    // 第一页 中上, 第二页中上 ...

}

