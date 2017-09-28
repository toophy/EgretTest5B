// TypeScript file
var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var tgame;
(function (tgame) {
    var LandView = (function () {
        function LandView() {
            this._base = null;
            this._actors = [];
            this._bullets = [];
            this._easyActorAI = [];
            this._bulletSprite = null;
            this._player = null;
            this._playerAI = null;
            this._base = new tgame.LandBase(this);
            this._bulletSprite = new egret.Sprite();
            this._netWork = new Network();
            this._netWork.setConnectHandler(this.onNetConnected, this);
            this._netWork.setCloseHandler(this.onNetClose, this);
            this._netWork.setErrorHandler(this.onNetError, this);
        }
        LandView.prototype.LoadLand = function (jsonData) {
            this._base.LoadLand(jsonData);
        };
        LandView.prototype.ShowLand = function (s) {
            this._base.ShowLand(s);
            // 子弹层
            s.addChild(this._bulletSprite);
        };
        LandView.prototype.AddActor = function (a) {
            if (a) {
                this._actors.push(a);
            }
        };
        LandView.prototype.AddEasyAI = function (e) {
            if (e) {
                this._easyActorAI.push(e);
            }
        };
        LandView.prototype.AccountLogin = function (account, pwd) {
            this._account = account;
            this._pwd = pwd;
            this._netWork.connect("localhost", "echo", 8080);
        };
        LandView.prototype.onNetConnected = function () {
            if (this._netWork) {
                this._netWork.bind("Index.Login", this.onLogin, this);
                this._netWork.bind("Scene.Skill", this.onSkill, this);
                this._netWork.send("Index", "Login", { "name": this._account, "pwd": this._pwd });
            }
        };
        LandView.prototype.onNetError = function () {
        };
        LandView.prototype.onNetClose = function () {
        };
        LandView.prototype.onLogin = function (data) {
            console.log("onLogin %s:%s:%s", data["name"], data["pwd"], data["ret"]);
        };
        LandView.prototype.onSkill = function (data) {
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
        };
        LandView.prototype.Update = function () {
            for (var i_1 in this._easyActorAI) {
                this._easyActorAI[i_1].update();
            }
            for (var i_2 in this._actors) {
                this._actors[i_2].update();
            }
            var i = this._bullets.length;
            while (i--) {
                var bullet = this._bullets[i];
                if (bullet.update()) {
                    this._bullets.splice(i, 1);
                }
            }
            if (this._player != null) {
                var point = new egret.Point();
                this._player.getPoint(point);
                this._base.SetTargetViewPos(point);
            }
            //视口滚动
            this._base.ScrollLand();
        };
        LandView.prototype.addBullet = function (bullet) {
            this._bullets.push(bullet);
        };
        LandView.prototype.getBulletLayer = function () {
            return this._bulletSprite;
        };
        LandView.prototype.randomPlayer = function () {
            if (this._easyActorAI.length > 0) {
                if (this._playerAI != null) {
                    this._playerAI.enablePlayer(false);
                    this._player = null;
                    this._playerAI = null;
                }
                var nextPlayer = Math.floor(Math.random() * this._easyActorAI.length);
                if (nextPlayer < this._easyActorAI.length) {
                    this._playerAI = this._easyActorAI[nextPlayer];
                    this._player = this._playerAI.getActor();
                    this._playerAI.enablePlayer(true);
                }
            }
        };
        LandView.prototype._touchMove = function (x, y) {
            if (this._player != null) {
                this._player.aim(x, y);
            }
        };
        LandView.prototype._touchHandler = function (event) {
            if (this._player != null) {
                this._player.aim(event.stageX, event.stageY);
                if (event.type == egret.TouchEvent.TOUCH_BEGIN) {
                    this._player.attack(true);
                }
                else {
                    this._player.attack(false);
                }
                //this.TouchNewActor(event.stageX, event.stageY);
            }
        };
        LandView.prototype._keyHandler = function (event) {
            var isDown = event.type == "keydown";
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
        };
        return LandView;
    }());
    tgame.LandView = LandView;
    __reflect(LandView.prototype, "tgame.LandView");
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
})(tgame || (tgame = {}));
//# sourceMappingURL=MyLand.js.map