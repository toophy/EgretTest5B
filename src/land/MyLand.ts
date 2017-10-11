// TypeScript file

namespace tgame {
    export class LandView {

        public _accountEnv: tgame.AccountEnv;

        public _base: LandBase = null;
        public _player: LandPlayer = null;

        private _roles: MapStr<Mecha>;
        private _actions: Array<Mecha> = [];
        private _bullets: Array<Bullet> = [];
        public _easyActorAI: Array<EasyAI> = [];
        private _bulletSprite: egret.Sprite = null;

        public _accountEasyAIs: MapStr<EasyAI>;

        public constructor(accountEnv: tgame.AccountEnv) {
            this._accountEnv = accountEnv;
            this._base = new LandBase(accountEnv, this);
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
            }
        }

        public LoadLand(jsonData: any) {
            this._base.LoadLand(jsonData);
        }

        public ShowLand(s: egret.DisplayObjectContainer) {
            this._base.ShowLand(s);
            // 子弹层
            s.addChild(this._bulletSprite);

            // let randName: Array<string> = ["lady", "gaga", "momo", "kaka", "hehe", "你妹啊", "找找找", "咚咚咚"];
            // let t: number = new Date().getTime() + 1000;
            // let idx: number = randomInt(t, 0, randName.length);
            // this._netWork.AccountLogin(randName[idx], "123456");
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

        /**
         * 网络消息处理
         */
        private onPlayerEnter(data: any, ret: string, msg: string) {
            if (data["account"] == this._accountEnv.name)
                return;
            if (!this._accountEasyAIs.has(data["account"])) {
                let easyAI = this._base.AddRole(data["account"], data["pos_x"], data["pos_y"]);
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
            if (data["account"] == this._accountEnv.name)
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
    }
}

