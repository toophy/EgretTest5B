// TypeScript file

namespace tgame {
    export class LandView {

        private _base: LandBase = null;

        private _actors: Array<Mecha> = [];
        private _bullets: Array<Bullet> = [];
        private _easyActorAI: Array<EasyAI> = [];
        private _bulletSprite: egret.Sprite = null;
        private _player: Mecha = null;
        private _playerAI: EasyAI = null;

        private _netWork: Network;
        private _account: string;
        private _pwd: string;

        public constructor() {
            this._base = new LandBase(this);
            this._bulletSprite = new egret.Sprite();
            this._netWork = new Network();
            this._netWork.setConnectHandler(this.onNetConnected, this);
            this._netWork.setCloseHandler(this.onNetClose, this);
            this._netWork.setErrorHandler(this.onNetError, this);
        }

        public LoadLand(jsonData: any) {
            this._base.LoadLand(jsonData);
        }

        public ShowLand(s: egret.Sprite) {
            this._base.ShowLand(s);
            // 子弹层
            s.addChild(this._bulletSprite);
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

        public AccountLogin(account: string, pwd: string) {
            this._account = account;
            this._pwd = pwd;
            this._netWork.connect("localhost", "echo", 8080);
        }

        private onNetConnected() {
            if (this._netWork) {
                this._netWork.bind("Index.Login", this.onLogin, this);
                this._netWork.bind("Scene.Skill", this.onSkill, this);

                this._netWork.send("Index", "Login", { "name": this._account, "pwd": this._pwd });
            }
        }

        private onNetError() {
        }

        private onNetClose() {
        }

        private onLogin(data: any) {
            console.log("onLogin %s:%s:%s", data["name"], data["pwd"], data["ret"]);
        }

        private onSkill(data: any) {
            // 技能名称
            // 技能目标
            // 
            // data["account"]
            // 某一个帐号
            switch (data["name"]) {
                case "move_left":
                    break;
                case "move_right":
                    break;
                case "jump":
                    break;
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

            if (this._player != null) {
                let point: egret.Point = new egret.Point();
                this._player.getPoint(point);
                this._base.SetTargetViewPos(point);
            }

            //视口滚动
            this._base.ScrollLand();
        }

        public addBullet(bullet: Bullet): void {
            this._bullets.push(bullet);
        }

        public getBulletLayer(): egret.Sprite {
            return this._bulletSprite;
        }

        private randomPlayer() {
            if (this._easyActorAI.length > 0) {
                if (this._playerAI != null) {
                    this._playerAI.enablePlayer(false);
                    this._player = null;
                    this._playerAI = null;
                }

                let nextPlayer: number = Math.floor(Math.random() * this._easyActorAI.length);
                if (nextPlayer < this._easyActorAI.length) {
                    this._playerAI = this._easyActorAI[nextPlayer];
                    this._player = this._playerAI.getActor();
                    this._playerAI.enablePlayer(true);
                }
            }
        }

        public _touchMove(x: number, y: number) {
            if (this._player != null) {
                this._player.aim(x, y);
            }
        }

        public _touchHandler(event: egret.TouchEvent): void {
            if (this._player != null) {
                this._player.aim(event.stageX, event.stageY);

                if (event.type == egret.TouchEvent.TOUCH_BEGIN) {
                    this._player.attack(true);
                } else {
                    this._player.attack(false);
                }

                //this.TouchNewActor(event.stageX, event.stageY);
            }
        }

        public _keyHandler(event: KeyboardEvent): void {

            const isDown: boolean = event.type == "keydown";
            if (event.keyCode == 13) {
                if (!isDown) {
                    this.randomPlayer();
                }
                return;
            }

            if (this._player == null) {
                return;
            }

            switch (event.keyCode) {
                case 37:
                case 65:
                    {
                        this._playerAI._left = isDown;
                        this._playerAI._updateMove(-1);
                    }
                    break;

                case 39:
                case 68:
                    {
                        this._playerAI._right = isDown;
                        this._playerAI._updateMove(1);
                    }
                    break;

                case 38:
                case 87:
                    if (isDown) {
                        this._player.jump();
                    }
                    break;

                case 83:
                case 40:
                    {
                        this._player.squat(isDown);
                    }
                    break;

                case 81:
                    if (isDown) {
                        this._player.switchWeaponR();
                    }
                    break;

                case 69:
                    if (isDown) {
                        this._player.switchWeaponL();
                    }
                    break;

                case 32:
                    if (isDown) {
                        this._player.switchWeaponR();
                        this._player.switchWeaponL();
                    }
                    break;
            }
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

