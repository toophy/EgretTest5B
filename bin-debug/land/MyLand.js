// TypeScript file
var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var tgame;
(function (tgame) {
    var LandView = (function () {
        function LandView() {
            this.up_height = 240;
            this.up2_height = 100; //66;
            this.middle_height = 200; //76;
            this.down_height = 100; //62;
            this.citySprite = [];
            this._actors = [];
            this._bullets = [];
            this._easyActorAI = [];
            this._bulletSprite = null;
            this._player = null;
            this._playerAI = null;
            this._viewPos = new egret.Point();
            this._targetViewPos = new egret.Point();
            this._targetViewSpeed = 0.1;
            this._targetViewRun = false;
            this._bulletSprite = new egret.Sprite();
            this._netWork = new Network();
            this._netWork.setConnectHandler(this.onNetConnected, this);
            this._netWork.setCloseHandler(this.onNetClose, this);
            this._netWork.setErrorHandler(this.onNetError, this);
        }
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
        LandView.prototype.loadCityUp = function () {
            var cts = new egret.Sprite();
            cts.x = 0;
            cts.y = 0;
            this.citySprite.push(cts);
            var i = 0;
            for (var p in this.cnfs.citys) {
                if (this.cnfs.citys[p] != null) {
                    this.LoadCityRow(cts, this.cnfs.citys[p].up, i * 1136, 0, 1136, this.up_height);
                }
                ++i;
            }
            i = 0;
            for (var p in this.cnfs.citys) {
                if (this.cnfs.builds[p] != null) {
                    this.LoadCityBuild(cts, this.cnfs.builds[p].up, i * 1136, 0, 1136, this.up_height);
                }
                ++i;
            }
            i = 0;
            for (var p in this.cnfs.citys) {
                if (this.cnfs.actors[p] != null) {
                    this.LoadCityActor(cts, this.cnfs.actors[p].up, i * 1136, 0, 1136, this.up_height);
                }
                ++i;
            }
        };
        LandView.prototype.loadCityUp2 = function () {
            var cts = new egret.Sprite();
            cts.x = 0;
            cts.y = this.up_height;
            this.citySprite.push(cts);
            var i = 0;
            for (var p in this.cnfs.citys) {
                if (this.cnfs.citys[p] != null) {
                    this.LoadCityRow(cts, this.cnfs.citys[p].up2, i * 1136, 0, 1136, this.up2_height);
                }
                ++i;
            }
            i = 0;
            for (var p in this.cnfs.citys) {
                if (this.cnfs.builds[p] != null) {
                    this.LoadCityBuild(cts, this.cnfs.builds[p].up2, i * 1136, 0, 1136, this.up2_height);
                }
                ++i;
            }
            i = 0;
            for (var p in this.cnfs.citys) {
                if (this.cnfs.actors[p] != null) {
                    this.LoadCityActor(cts, this.cnfs.actors[p].up2, i * 1136, 0, 1136, this.up2_height);
                }
                ++i;
            }
        };
        LandView.prototype.loadCityMiddle = function () {
            var cts = new egret.Sprite();
            cts.x = 0;
            cts.y = this.up_height + this.up2_height;
            this.citySprite.push(cts);
            var i = 0;
            for (var p in this.cnfs.citys) {
                if (this.cnfs.citys[p] != null) {
                    this.LoadCityRow(cts, this.cnfs.citys[p].middle, i * 1136, 0, 1136, this.middle_height);
                }
                ++i;
            }
            i = 0;
            for (var p in this.cnfs.citys) {
                if (this.cnfs.builds[p] != null) {
                    this.LoadCityBuild(cts, this.cnfs.builds[p].middle, i * 1136, 0, 1136, this.middle_height);
                }
                ++i;
            }
            i = 0;
            for (var p in this.cnfs.citys) {
                if (this.cnfs.actors[p] != null) {
                    this.LoadCityActor(cts, this.cnfs.actors[p].middle, i * 1136, 0, 1136, this.middle_height);
                }
                ++i;
            }
        };
        LandView.prototype.loadCityDown = function () {
            var cts = new egret.Sprite();
            cts.x = 0;
            cts.y = this.up_height + this.up2_height + this.middle_height;
            this.citySprite.push(cts);
            var i = 0;
            for (var p in this.cnfs.citys) {
                if (this.cnfs.citys[p] != null) {
                    this.LoadCityRow(cts, this.cnfs.citys[p].down, i * 1136, 0, 1136, this.down_height);
                }
                ++i;
            }
            i = 0;
            for (var p in this.cnfs.citys) {
                if (this.cnfs.builds[p] != null) {
                    this.LoadCityBuild(cts, this.cnfs.builds[p].down, i * 1136, 0, 1136, this.down_height);
                }
                ++i;
            }
            i = 0;
            for (var p in this.cnfs.citys) {
                if (this.cnfs.actors[p] != null) {
                    this.LoadCityActor(cts, this.cnfs.actors[p].down, i * 1136, 0, 1136, this.down_height);
                }
                ++i;
            }
        };
        LandView.prototype.LoadLand = function (jsonData) {
            this.cnfs = jsonData;
            this.loadCityUp();
            this.loadCityUp2();
            this.loadCityMiddle();
            this.loadCityDown();
            this._viewPos.setTo(1136 / 2, 640 / 2);
        };
        LandView.prototype.ShowLand = function (s) {
            for (var i = 0; i < this.citySprite.length; ++i) {
                s.addChild(this.citySprite[i]);
            }
            // 子弹层
            s.addChild(this._bulletSprite);
        };
        LandView.prototype.ScrollLand = function () {
            if (!this._targetViewRun) {
                return;
            }
            if (egret.Point.distance(this._targetViewPos, this._viewPos) > Math.abs(this._targetViewSpeed)) {
                var oldx = this._viewPos.x;
                this._viewPos.x = oldx + this._targetViewSpeed;
                for (var i = 0; i < this.citySprite.length; ++i) {
                    this.citySprite[i].x += (oldx - this._viewPos.x);
                }
            }
            else {
                this._targetViewRun = false;
                var oldx = this._viewPos.x;
                this._viewPos.x = this._targetViewPos.x;
                for (var i = 0; i < this.citySprite.length; ++i) {
                    this.citySprite[i].x += (oldx - this._viewPos.x);
                }
            }
        };
        LandView.prototype.SetTargetViewPos = function (p) {
            var distance = egret.Point.distance(this._targetViewPos, p);
            if (distance > 1.0) {
                this._targetViewRun = true;
                this._targetViewPos.x = p.x;
                this._targetViewPos.y = p.y;
                this._targetViewPos.y = this._viewPos.y;
                var speed = 5;
                if (distance > 30)
                    speed = 100;
                if (this._viewPos.x <= this._targetViewPos.x) {
                    this._targetViewSpeed = speed;
                }
                else {
                    this._targetViewSpeed = -speed;
                }
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
                this.SetTargetViewPos(point);
            }
            //视口滚动
            this.ScrollLand();
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
                this.TouchNewActor(event.stageX, event.stageY);
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
        LandView.prototype.TouchNewActor = function (x, y) {
            // 新建演员
            // 属于谁?
            var newPos = new egret.Point();
            this.citySprite[2].globalToLocal(x, y, newPos);
            var tmpActor = new tgame.Mecha();
            tmpActor.setParent(this, this.citySprite[2], newPos.x, 150 /*newPos.y*/);
            tmpActor.setMoveRange(3 * 1136, 640);
            this._actors.push(tmpActor);
            var tmpActorAI = new tgame.EasyAI();
            tmpActorAI.setActor(tmpActor);
            this._easyActorAI.push(tmpActorAI);
        };
        LandView.prototype.LoadCityRow = function (cts, ctr, x, y, w, h) {
            if (ctr == null || cts == null) {
                return;
            }
            if (ctr.type == "shape") {
                var bg = new egret.Shape();
                bg.graphics.beginFill(ctr.data.color, 100);
                bg.graphics.drawRect(0, 0, ctr.data.width, ctr.data.height);
                bg.graphics.endFill();
                bg.width = w;
                bg.height = h;
                bg.x = x;
                bg.y = y;
                cts.addChild(bg);
            }
            else if (ctr.type == "image") {
                var bg4 = new egret.Bitmap(RES.getRes(ctr.data.res));
                bg4.width = w;
                bg4.height = h;
                bg4.x = x;
                bg4.y = y;
                cts.addChild(bg4);
            }
        };
        LandView.prototype.LoadCityBuild = function (cts, ctr, x, y, w, h) {
            if (ctr == null || cts == null) {
                return;
            }
            for (var i in ctr) {
                var lc = ctr[i];
                if (lc.type == "shape") {
                    var bg = new egret.Shape();
                    bg.graphics.beginFill(lc.data.color, 100);
                    bg.graphics.drawRect(0, 0, lc.data.width, lc.data.height);
                    bg.graphics.endFill();
                    bg.x = x + lc.data.x;
                    bg.y = y + lc.data.y;
                    cts.addChild(bg);
                }
                else if (lc.type == "image") {
                    var bg4 = new egret.Bitmap(RES.getRes(lc.data.res));
                    bg4.x = x + lc.data.x;
                    bg4.y = y + lc.data.y;
                    cts.addChild(bg4);
                }
                else if (lc.type == "animation") {
                    var tmpActor = new tgame.Mecha();
                    tmpActor.setParent(this, cts, x + lc.data.x, y + lc.data.y);
                    tmpActor.setMoveRange(3 * 1136, 640);
                    this._actors.push(tmpActor);
                }
            }
        };
        LandView.prototype.LoadCityActor = function (cts, ctr, x, y, w, h) {
            if (ctr == null || cts == null) {
                return;
            }
            for (var i in ctr) {
                var lc = ctr[i];
                if (lc.type == "shape") {
                    var bg = new egret.Shape();
                    bg.graphics.beginFill(lc.data.color, 100);
                    bg.graphics.drawRect(0, 0, lc.data.width, lc.data.height);
                    bg.graphics.endFill();
                    bg.x = x + lc.data.x;
                    bg.y = y + lc.data.y;
                    cts.addChild(bg);
                }
                else if (lc.type == "image") {
                    var bg4 = new egret.Bitmap(RES.getRes(lc.data.res));
                    bg4.x = x + lc.data.x;
                    bg4.y = y + lc.data.y;
                    cts.addChild(bg4);
                }
                else if (lc.type == "animation") {
                    var tmpActor = new tgame.Mecha();
                    tmpActor.setName(lc.data.name);
                    tmpActor.setParent(this, cts, x + lc.data.x, y + lc.data.y);
                    tmpActor.setMoveRange(3 * 1136, 640);
                    this._actors.push(tmpActor);
                    var tmpActorAI = new tgame.EasyAI();
                    tmpActorAI.setActor(tmpActor);
                    this._easyActorAI.push(tmpActorAI);
                }
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