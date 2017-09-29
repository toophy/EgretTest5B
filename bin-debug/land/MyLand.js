// TypeScript file
var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var tgame;
(function (tgame) {
    var LandView = (function () {
        function LandView() {
            this._base = null;
            this._player = null;
            this._netWork = null;
            this._actions = [];
            this._bullets = [];
            this._easyActorAI = [];
            this._bulletSprite = null;
            this._base = new tgame.LandBase(this);
            this._player = new tgame.LandPlayer(this);
            this._netWork = new tgame.LandNetwork(this);
            this._roles = new MapStr();
            this._bulletSprite = new egret.Sprite();
        }
        LandView.prototype.LoadLand = function (jsonData) {
            this._base.LoadLand(jsonData);
        };
        LandView.prototype.ShowLand = function (s) {
            this._base.ShowLand(s);
            // 子弹层
            s.addChild(this._bulletSprite);
            var randName = ["lady", "gaga", "momo", "kaka", "hehe", "你妹啊", "找找找", "咚咚咚"];
            var t = new Date().getTime() + 1000;
            var idx = randomInt(t, 0, randName.length);
            this._netWork.AccountLogin(randName[idx], "123456");
        };
        LandView.prototype.AddRole = function (name, a) {
            if (name.length > 0 && a) {
                this._roles.add(name, a);
            }
        };
        LandView.prototype.DelRole = function (name) {
            if (name.length > 0) {
                this._roles.del(name);
            }
        };
        LandView.prototype.AddAction = function (a) {
            if (a) {
                this._actions.push(a);
            }
        };
        LandView.prototype.DelAction = function (a) {
        };
        LandView.prototype.AddEasyAI = function (e) {
            if (e) {
                this._easyActorAI.push(e);
            }
        };
        LandView.prototype.Update = function () {
            for (var i_1 in this._easyActorAI) {
                this._easyActorAI[i_1].update();
            }
            for (var key in this._roles.items) {
                this._roles.items[key].update();
            }
            for (var i_2 in this._actions) {
                this._actions[i_2].update();
            }
            var i = this._bullets.length;
            while (i--) {
                var bullet = this._bullets[i];
                if (bullet.update()) {
                    this._bullets.splice(i, 1);
                }
            }
            this._player.update();
            //视口滚动
            this._base.ScrollLand();
        };
        LandView.prototype.addBullet = function (bullet) {
            this._bullets.push(bullet);
        };
        LandView.prototype.getBulletLayer = function () {
            return this._bulletSprite;
        };
        LandView.prototype._touchMove = function (x, y) {
            this._player._touchMove(x, y);
        };
        LandView.prototype._touchHandler = function (event) {
            this._player._touchHandler(event);
        };
        LandView.prototype._keyHandler = function (event) {
            this._player._keyHandler(event);
        };
        return LandView;
    }());
    tgame.LandView = LandView;
    __reflect(LandView.prototype, "tgame.LandView");
})(tgame || (tgame = {}));
//# sourceMappingURL=MyLand.js.map