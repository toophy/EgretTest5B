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

            let randName: Array<string> = ["lady", "gaga", "momo", "kaka", "hehe"];

            this._netWork.AccountLogin( randName[Math.floor(Math.random()*randName.length)], "123456");
        }

        public AddActor(a: Mecha) {
            if (a) {
                this._actors.push(a);
            }
        }

        public DelActor(a: Mecha) {
            if (a) {
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

    }
}

