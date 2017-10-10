// TypeScript file

namespace tgame {
    export class LandView {

        private _accountEnv: tgame.AccountEnv;

        public _base: LandBase = null;
        public _player: LandPlayer = null;
        public _netWork: LandNetwork = null;

        private _roles: MapStr<Mecha>;
        private _actions: Array<Mecha> = [];
        private _bullets: Array<Bullet> = [];
        public _easyActorAI: Array<EasyAI> = [];
        private _bulletSprite: egret.Sprite = null;

        public constructor(accountEnv: tgame.AccountEnv) {
            this._accountEnv = accountEnv;
            this._base = new LandBase(accountEnv, this);
            this._player = new LandPlayer(this);
            this._netWork = new LandNetwork(this);
            this._roles = new MapStr<Mecha>();

            this._bulletSprite = new egret.Sprite();
        }

        public LoadLand(jsonData: any) {
            this._base.LoadLand(jsonData);
        }

        public ShowLand(s: egret.DisplayObjectContainer) {
            this._base.ShowLand(s);
            // 子弹层
            s.addChild(this._bulletSprite);

            let randName: Array<string> = ["lady", "gaga", "momo", "kaka", "hehe", "你妹啊", "找找找", "咚咚咚"];

            let t: number = new Date().getTime() + 1000;

            let idx: number = randomInt(t, 0, randName.length);

            this._netWork.AccountLogin(randName[idx], "123456");
        }

        public AddRole(name: string, a: Mecha) {
            if (name.length > 0 && a) {
                this._roles.add(name, a);
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

