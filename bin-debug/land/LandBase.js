// TypeScript file
var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var tgame;
(function (tgame) {
    var LandBase = (function () {
        function LandBase(l) {
            this.up_height = 240;
            this.up2_height = 100;
            this.middle_height = 200;
            this.down_height = 100;
            this.citySprite = [];
            this.landView = null;
            this._viewPos = new egret.Point();
            this._targetViewPos = new egret.Point();
            this._targetViewSpeed = 0.1;
            this._targetViewRun = false;
            this.landView = l;
        }
        LandBase.prototype.AddActor = function (name, x, y) {
            var tmpActor = new tgame.Mecha();
            tmpActor.setName(name);
            tmpActor.setParent(this.landView, this.citySprite[2], x, y);
            tmpActor.setMoveRange(3 * 1136, 640);
            this.landView.AddActor(tmpActor);
            var tmpActorAI = new tgame.EasyAI();
            tmpActorAI.setActor(tmpActor);
            this.landView.AddEasyAI(tmpActorAI);
            return tmpActorAI;
        };
        LandBase.prototype.SetTargetViewPos = function (p) {
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
        LandBase.prototype.ScrollLand = function () {
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
        LandBase.prototype.loadCityEx = function (row, y, height) {
            var cts = new egret.Sprite();
            cts.x = 0;
            cts.y = y;
            this.citySprite.push(cts);
            var i = 0;
            for (var p in this.cnfs.citys) {
                if (this.cnfs.citys[p] != null) {
                    var cityRow = null;
                    switch (row) {
                        case 0:
                            cityRow = this.cnfs.citys[p].up;
                            break;
                        case 1:
                            cityRow = this.cnfs.citys[p].up2;
                            break;
                        case 2:
                            cityRow = this.cnfs.citys[p].middle;
                            break;
                        case 3:
                            cityRow = this.cnfs.citys[p].down;
                            break;
                    }
                    if (cityRow != null)
                        this.LoadCityRow(cts, cityRow, i * 1136, 0, 1136, height);
                }
                ++i;
            }
            i = 0;
            for (var p in this.cnfs.citys) {
                if (this.cnfs.builds[p] != null) {
                    var cityRow = null;
                    switch (row) {
                        case 0:
                            cityRow = this.cnfs.builds[p].up;
                            break;
                        case 1:
                            cityRow = this.cnfs.builds[p].up2;
                            break;
                        case 2:
                            cityRow = this.cnfs.builds[p].middle;
                            break;
                        case 3:
                            cityRow = this.cnfs.builds[p].down;
                            break;
                    }
                    if (cityRow != null)
                        this.LoadCityBuild(cts, cityRow, i * 1136, 0, 1136, height);
                }
                ++i;
            }
            i = 0;
            for (var p in this.cnfs.citys) {
                if (this.cnfs.actors[p] != null) {
                    var cityRow = null;
                    switch (row) {
                        case 0:
                            cityRow = this.cnfs.actors[p].up;
                            break;
                        case 1:
                            cityRow = this.cnfs.actors[p].up2;
                            break;
                        case 2:
                            cityRow = this.cnfs.actors[p].middle;
                            break;
                        case 3:
                            cityRow = this.cnfs.actors[p].down;
                            break;
                    }
                    if (cityRow != null)
                        this.LoadCityActor(cts, cityRow, i * 1136, 0, 1136, height);
                }
                ++i;
            }
        };
        LandBase.prototype.LoadLand = function (jsonData) {
            this.cnfs = jsonData;
            this.loadCityEx(0, 0, this.up_height);
            this.loadCityEx(1, this.up_height, this.up2_height);
            this.loadCityEx(2, this.up_height + this.up2_height, this.middle_height);
            this.loadCityEx(3, this.up_height + this.up2_height + this.middle_height, this.down_height);
            this._viewPos.setTo(1136 / 2, 640 / 2);
        };
        LandBase.prototype.ShowLand = function (s) {
            for (var i = 0; i < this.citySprite.length; ++i) {
                s.addChild(this.citySprite[i]);
            }
        };
        LandBase.prototype.LoadCityRow = function (cts, ctr, x, y, w, h) {
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
        LandBase.prototype.LoadCityBuild = function (cts, ctr, x, y, w, h) {
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
                    tmpActor.setParent(this.landView, cts, x + lc.data.x, y + lc.data.y);
                    tmpActor.setMoveRange(3 * 1136, 640);
                    this.landView.AddActor(tmpActor);
                }
            }
        };
        LandBase.prototype.LoadCityActor = function (cts, ctr, x, y, w, h) {
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
                    tmpActor.setParent(this.landView, cts, x + lc.data.x, y + lc.data.y);
                    tmpActor.setMoveRange(3 * 1136, 640);
                    this.landView.AddActor(tmpActor);
                    var tmpActorAI = new tgame.EasyAI();
                    tmpActorAI.setActor(tmpActor);
                    this.landView.AddEasyAI(tmpActorAI);
                }
            }
        };
        return LandBase;
    }());
    tgame.LandBase = LandBase;
    __reflect(LandBase.prototype, "tgame.LandBase");
})(tgame || (tgame = {}));
//# sourceMappingURL=LandBase.js.map