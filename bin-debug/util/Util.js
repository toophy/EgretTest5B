var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
// TypeScript file
var GameUtil = (function () {
    function GameUtil() {
    }
    /**基于矩形的碰撞检测*/
    GameUtil.hitTest = function (obj1, obj2) {
        var rect1 = obj1.getBounds();
        var rect2 = obj2.getBounds();
        if (obj1.parent) {
            var p1 = obj1.parent.localToGlobal(obj1.x, obj1.y);
            rect1.x = p1.x;
            rect1.y = p1.y;
        }
        else {
            rect1.x = obj1.x;
            rect1.y = obj1.y;
        }
        if (obj2.parent) {
            var p2 = obj2.parent.localToGlobal(obj2.x, obj2.y);
            rect2.x = p2.x;
            rect2.y = p2.y;
        }
        else {
            rect2.x = obj2.x;
            rect2.y = obj2.y;
        }
        return rect1.intersects(rect2);
    };
    return GameUtil;
}());
__reflect(GameUtil.prototype, "GameUtil");
var Dictionary = (function () {
    function Dictionary(init) {
        this._keys = [];
        this._values = [];
        for (var x = 0; x < init.length; x++) {
            this[init[x].key] = init[x].value;
            this._keys.push(init[x].key);
            this._values.push(init[x].value);
        }
    }
    Dictionary.prototype.add = function (key, value) {
        this[key] = value;
        this._keys.push(key);
        this._values.push(value);
    };
    Dictionary.prototype.remove = function (key) {
        var index = this._keys.indexOf(key, 0);
        this._keys.splice(index, 1);
        this._values.splice(index, 1);
        delete this[key];
    };
    Dictionary.prototype.keys = function () {
        return this._keys;
    };
    Dictionary.prototype.values = function () {
        return this._values;
    };
    Dictionary.prototype.containsKey = function (key) {
        if (typeof this[key] === "undefined") {
            return false;
        }
        return true;
    };
    Dictionary.prototype.toLookup = function () {
        return this;
    };
    return Dictionary;
}());
__reflect(Dictionary.prototype, "Dictionary");
var MapStr = (function () {
    function MapStr() {
        this.items = {};
        this.curCount = 0;
        this.maxCount = 0;
    }
    MapStr.prototype.add = function (key, value) {
        if (!this.has(key)) {
            ++this.curCount;
            ++this.maxCount;
        }
        this.items[key] = value;
    };
    MapStr.prototype.has = function (key) {
        return key in this.items;
    };
    MapStr.prototype.get = function (key) {
        return this.items[key];
    };
    MapStr.prototype.del = function (key) {
        if (this.has(key)) {
            delete this.items[key];
            --this.curCount;
        }
    };
    MapStr.prototype.getCount = function () {
        return this.curCount;
    };
    MapStr.prototype.getMaxCount = function () {
        return this.maxCount;
    };
    return MapStr;
}());
__reflect(MapStr.prototype, "MapStr");
var MapNum = (function () {
    function MapNum() {
        this.items = {};
        this.curCount = 0;
        this.maxCount = 0;
        this.maxKey = 0;
    }
    MapNum.prototype.add = function (key, value) {
        if (!this.has(key)) {
            ++this.curCount;
            ++this.maxCount;
            if (key > this.maxKey) {
                this.maxKey = key;
            }
        }
        this.items[key] = value;
    };
    MapNum.prototype.has = function (key) {
        return key in this.items;
    };
    MapNum.prototype.get = function (key) {
        return this.items[key];
    };
    MapNum.prototype.del = function (key) {
        if (this.has(key)) {
            delete this.items[key];
            --this.curCount;
        }
    };
    MapNum.prototype.getCount = function () {
        return this.curCount;
    };
    MapNum.prototype.getMaxCount = function () {
        return this.maxCount;
    };
    MapNum.prototype.getMaxKey = function () {
        return this.maxKey;
    };
    return MapNum;
}());
__reflect(MapNum.prototype, "MapNum");
//# sourceMappingURL=Util.js.map