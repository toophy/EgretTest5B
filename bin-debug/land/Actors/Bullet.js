var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
// TypeScript file
var tgame;
(function (tgame) {
    var Bullet = (function () {
        function Bullet(cts, armatureName, effectArmatureName, radian, speed, position) {
            this._speedX = 0;
            this._speedY = 0;
            this._armature = null;
            this._armatureDisplay = null;
            this._effect = null;
            this._master = null;
            this._maxWidth = 0;
            this._maxHeight = 0;
            this._master = cts;
            this._speedX = Math.cos(radian) * speed;
            this._speedY = Math.sin(radian) * speed;
            this._armature = tgame.GameMapContainer.instance.factory.buildArmature(armatureName);
            this._armatureDisplay = this._armature.display;
            this._armatureDisplay.x = position.x;
            this._armatureDisplay.y = position.y;
            this._armatureDisplay.rotation = radian * 180 / Math.PI; // dragonBones.DragonBones.RADIAN_TO_ANGLE;
            this._armature.animation.play("idle");
            if (effectArmatureName) {
                this._effect = tgame.GameMapContainer.instance.factory.buildArmature(effectArmatureName);
                var effectDisplay = this._effect.display;
                effectDisplay.rotation = radian * 180 / Math.PI; // dragonBones.DragonBones.RADIAN_TO_ANGLE;
                effectDisplay.x = position.x;
                effectDisplay.y = position.y;
                effectDisplay.scaleX = 1 + Math.random() * 1;
                effectDisplay.scaleY = 1 + Math.random() * 0.5;
                if (Math.random() < 0.5) {
                    effectDisplay.scaleY *= -1;
                }
                this._effect.animation.play("idle");
                dragonBones.WorldClock.clock.add(this._effect);
                cts.addChild(effectDisplay);
            }
            dragonBones.WorldClock.clock.add(this._armature);
            cts.addChild(this._armatureDisplay);
        }
        Bullet.prototype.setMaxRange = function (w, h) {
            this._maxWidth = w;
            this._maxHeight = h;
        };
        Bullet.prototype.update = function () {
            this._armatureDisplay.x += this._speedX;
            this._armatureDisplay.y += this._speedY;
            if (this._armatureDisplay.x < -100 || this._armatureDisplay.x >= this._maxWidth + 100 ||
                this._armatureDisplay.y < -100 || this._armatureDisplay.y >= this._maxHeight + 100) {
                dragonBones.WorldClock.clock.remove(this._armature);
                this._master.removeChild(this._armatureDisplay);
                this._armature.dispose();
                if (this._effect) {
                    dragonBones.WorldClock.clock.remove(this._effect);
                    this._master.removeChild(this._effect.display);
                    this._effect.dispose();
                }
                return true;
            }
            return false;
        };
        return Bullet;
    }());
    tgame.Bullet = Bullet;
    __reflect(Bullet.prototype, "tgame.Bullet");
})(tgame || (tgame = {}));
//# sourceMappingURL=Bullet.js.map