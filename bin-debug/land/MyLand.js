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
            this._actors = [];
            this._bullets = [];
            this._easyActorAI = [];
            this._bulletSprite = null;
            this._base = new tgame.LandBase(this);
            this._player = new tgame.LandPlayer(this);
            this._netWork = new tgame.LandNetwork(this);
            this._bulletSprite = new egret.Sprite();
        }
        LandView.prototype.LoadLand = function (jsonData) {
            this._base.LoadLand(jsonData);
        };
        LandView.prototype.ShowLand = function (s) {
            this._base.ShowLand(s);
            // 子弹层
            s.addChild(this._bulletSprite);
            this._netWork.AccountLogin("lady", "gaga");
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