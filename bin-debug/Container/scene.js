// TypeScript file
var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var tgame;
(function (tgame) {
    var GameMapContainer = (function (_super) {
        __extends(GameMapContainer, _super);
        function GameMapContainer(root) {
            var _this = _super.call(this) || this;
            _this.factory = new dragonBones.EgretFactory();
            _this.rootContainer = root;
            GameMapContainer.instance = _this;
            return _this;
            //      this._resourceConfigURL = "resource/CoreElement.json";
        }
        GameMapContainer.prototype.createScene = function () {
            GameMapContainer.GROUND = this.rootContainer.stage.stageHeight - 150;
            this.factory.parseDragonBonesData(RES.getRes("CoreElement_json"));
            this.factory.parseTextureAtlasData(RES.getRes("CoreElement_texture_1_json"), RES.getRes("CoreElement_texture_1_png"));
            // mouse move        
            var onTouchMove = egret.sys.TouchHandler.prototype.onTouchMove;
            egret.sys.TouchHandler.prototype.onTouchMove = function (x, y, touchPointID) {
                onTouchMove.call(this, x, y, touchPointID);
                if (GameMapContainer.instance._lands != null) {
                    GameMapContainer.instance._lands._touchMove(x, y);
                }
            };
            var data = RES.getRes("land_json");
            this._lands = new tgame.LandView();
            this._lands.LoadLand(data);
            this._lands.ShowLand(this);
            this._lands.AccountLogin("lady", "gaga");
            this.touchEnabled = true;
            this.addEventListener(egret.Event.ENTER_FRAME, this.onUpdateFrame, this);
            this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this._touchHandler, this);
            this.addEventListener(egret.TouchEvent.TOUCH_END, this._touchHandler, this);
            document.addEventListener("keydown", this._keyHandler);
            document.addEventListener("keyup", this._keyHandler);
        };
        GameMapContainer.prototype._touchHandler = function (event) {
            if (GameMapContainer.instance._lands != null) {
                GameMapContainer.instance._lands._touchHandler(event);
            }
        };
        GameMapContainer.prototype._keyHandler = function (event) {
            if (GameMapContainer.instance._lands != null) {
                GameMapContainer.instance._lands._keyHandler(event);
            }
        };
        GameMapContainer.prototype.onUpdateFrame = function (evt) {
            if (this._lands != null) {
                this._lands.Update();
            }
            dragonBones.WorldClock.clock.advanceTime(-1);
        };
        //
        GameMapContainer.GROUND = 100;
        GameMapContainer.G = 0.6;
        GameMapContainer.instance = null;
        return GameMapContainer;
    }(egret.Sprite));
    tgame.GameMapContainer = GameMapContainer;
    __reflect(GameMapContainer.prototype, "tgame.GameMapContainer");
})(tgame || (tgame = {}));
//# sourceMappingURL=scene.js.map