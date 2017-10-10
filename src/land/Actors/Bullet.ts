// TypeScript file
namespace tgame {
    export class Bullet {
        private _accountEnv: tgame.AccountEnv;

        private _speedX: number = 0;
        private _speedY: number = 0;

        private _armature: dragonBones.Armature = null;
        private _armatureDisplay: dragonBones.EgretArmatureDisplay = null;
        private _effect: dragonBones.Armature = null;
        private _master: egret.Sprite = null;
        private _maxWidth: number = 0;
        private _maxHeight: number = 0;

        public constructor(accountEnv: tgame.AccountEnv,cts: egret.Sprite, armatureName: string, effectArmatureName: string, radian: number, speed: number, position: egret.Point) {
            this._accountEnv = accountEnv;
            this._master = cts;

            this._speedX = Math.cos(radian) * speed;
            this._speedY = Math.sin(radian) * speed;

            this._armature = this._accountEnv.factory.buildArmature(armatureName);
            this._armatureDisplay = <dragonBones.EgretArmatureDisplay>this._armature.display;
            this._armatureDisplay.x = position.x;
            this._armatureDisplay.y = position.y;
            this._armatureDisplay.rotation = radian * 180 / Math.PI;// dragonBones.DragonBones.RADIAN_TO_ANGLE;
            this._armature.animation.play("idle");

            if (effectArmatureName) {
                this._effect = this._accountEnv.factory.buildArmature(effectArmatureName);
                const effectDisplay = <dragonBones.EgretArmatureDisplay>this._effect.display;
                effectDisplay.rotation = radian * 180 / Math.PI;// dragonBones.DragonBones.RADIAN_TO_ANGLE;
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

        public setMaxRange(w: number, h: number) {
            this._maxWidth = w;
            this._maxHeight = h;
        }

        public update(): Boolean {
            this._armatureDisplay.x += this._speedX;
            this._armatureDisplay.y += this._speedY;

            if (
                this._armatureDisplay.x < -100 || this._armatureDisplay.x >= this._maxWidth + 100 ||
                this._armatureDisplay.y < -100 || this._armatureDisplay.y >= this._maxHeight + 100
            ) {
                dragonBones.WorldClock.clock.remove(this._armature);
                this._master.removeChild(this._armatureDisplay);
                this._armature.dispose();

                if (this._effect) {
                    dragonBones.WorldClock.clock.remove(this._effect);
                    this._master.removeChild(<dragonBones.EgretArmatureDisplay>this._effect.display);
                    this._effect.dispose();
                }

                return true;
            }

            return false;
        }
    }
}