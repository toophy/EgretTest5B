// TypeScript file
class GameUtil {
    /**基于矩形的碰撞检测*/
    public static hitTest(obj1: egret.DisplayObject, obj2: egret.DisplayObject): boolean {
        var rect1: egret.Rectangle = obj1.getBounds();
        var rect2: egret.Rectangle = obj2.getBounds();

        if (obj1.parent) {
            let p1 = obj1.parent.localToGlobal(obj1.x, obj1.y)
            rect1.x = p1.x;
            rect1.y = p1.y;
        } else {
            rect1.x = obj1.x;
            rect1.y = obj1.y;
        }

        if (obj2.parent) {
            let p2 = obj2.parent.localToGlobal(obj2.x, obj2.y)
            rect2.x = p2.x;
            rect2.y = p2.y;
        } else {
            rect2.x = obj2.x;
            rect2.y = obj2.y;
        }

        return rect1.intersects(rect2);
    }
}

interface IDictionary {
    add(key: string, value: any): void;
    remove(key: string): void;
    containsKey(key: string): boolean;
    keys(): string[];
    values(): any[];
}

class Dictionary {

    _keys: string[] = [];
    _values: any[] = [];

    constructor(init: { key: string; value: any; }[]) {

        for (var x = 0; x < init.length; x++) {
            this[init[x].key] = init[x].value;
            this._keys.push(init[x].key);
            this._values.push(init[x].value);
        }
    }

    add(key: string, value: any) {
        this[key] = value;
        this._keys.push(key);
        this._values.push(value);
    }

    remove(key: string) {
        var index = this._keys.indexOf(key, 0);
        this._keys.splice(index, 1);
        this._values.splice(index, 1);

        delete this[key];
    }

    keys(): string[] {
        return this._keys;
    }

    values(): any[] {
        return this._values;
    }

    containsKey(key: string) {
        if (typeof this[key] === "undefined") {
            return false;
        }

        return true;
    }

    toLookup(): IDictionary {
        return this;
    }
}

class MapStr<T> {
    public items: { [key: string]: T };
    public curCount: number;
    public maxCount: number;

    constructor() {
        this.items = {};
        this.curCount = 0;
        this.maxCount = 0;
    }

    public add(key: string, value: T): void {
        if (!this.has(key)) {
            ++this.curCount;
            ++this.maxCount;
        }
        this.items[key] = value;
    }

    public has(key: string): boolean {
        return key in this.items;
    }

    public get(key: string): T {
        return this.items[key];
    }

    public del(key: string) {
        if (this.has(key)) {
            delete this.items[key];
            --this.curCount;
        }
    }

    public getCount(): number {
        return this.curCount;
    }

    public getMaxCount(): number {
        return this.maxCount;
    }
}

class MapNum<T> {
    public items: { [key: number]: T };
    private curCount: number;
    private maxCount: number;
    private maxKey: number;

    constructor() {
        this.items = {};
        this.curCount = 0;
        this.maxCount = 0;
        this.maxKey = 0;
    }

    public add(key: number, value: T): void {
        if (!this.has(key)) {
            ++this.curCount;
            ++this.maxCount;
            if (key > this.maxKey) {
                this.maxKey = key;
            }
        }
        this.items[key] = value;
    }

    public has(key: number): boolean {
        return key in this.items;
    }

    public get(key: number): T {
        return this.items[key];
    }

    public del(key: number) {
        if (this.has(key)) {
            delete this.items[key];
            --this.curCount;
        }
    }

    public getCount(): number {
        return this.curCount;
    }

    public getMaxCount(): number {
        return this.maxCount;
    }

    public getMaxKey(): number {
        return this.maxKey;
    }
}

function randomInt(seed: number, min: number, max: number): number {
    max = max || 0;
    min = min || 0;

    seed = (seed * 9301 + 49297) % 233280;

    return Math.floor(min + (seed / 233280) * (max - min));
}

function randomDouble(seed: number, min: number, max: number): number {
    max = max || 0;
    min = min || 0;

    seed = (seed * 9301 + 49297) % 233280;

    return min + (seed / 233280) * (max - min);
}

class RNG {
    private seed: number;

    constructor(seed: number) {
        this.seed = seed;
    }

    private next(min: number, max: number): number {
        return randomDouble(this.seed, min, max);
    }

    // http://indiegamr.com/generate-repeatable-random-numbers-in-js/
    public nextInt(min: number, max: number): number {
        return Math.round(this.next(min, max));
    }

    public nextDouble(): number {
        return this.next(0, 1);
    }

    public pick(collection: any[]): any {
        return collection[this.nextInt(0, collection.length - 1)];
    }
}


// 是不是在台式机
function IsPC(): boolean {
    var userAgentInfo: string = navigator.userAgent.toString();
    var Agents: string[] = ["Android", "iPhone",
        "SymbianOS", "Windows Phone",
        "iPad", "iPod"];
    var flag: boolean = true;
    for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
            flag = false;
            break;
        }
    }
    return flag;
}

    // function getQueryString(name) {
    //     var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    //     var r = window.location.search.substr(1).match(reg);
    //     if (r != null) {
    //         return unescape(r[2]);
    //     }
    //     return null;
    // }