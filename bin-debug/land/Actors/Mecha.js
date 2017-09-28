var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
// TypeScript file
var tgame;
(function (tgame) {
    var Mecha = (function () {
        function Mecha() {
            this._isJumpingA = false;
            this._isJumpingB = false;
            this._isSquating = false;
            this._isAttackingA = false;
            this._isAttackingB = false;
            this._weaponRIndex = 0;
            this._weaponLIndex = 0;
            this._faceDir = 1;
            this._aimDir = 0;
            this._moveDir = 0;
            this._aimRadian = 0;
            this._speedX = 0;
            this._speedY = 0;
            this._armature = null;
            this._armatureDisplay = null;
            this._weaponR = null;
            this._weaponL = null;
            this._aimState = null;
            this._walkState = null;
            this._attackState = null;
            this._target = new egret.Point();
            this._parent = null;
            this._ground_y = 0;
            this._moveRangeWidth = 0;
            this._moveRangeHeight = 0;
            this._land = null;
            this._sayLabel = null;
            this._nameLabel = null;
            this._armature = tgame.GameMapContainer.instance.factory.buildArmature("mecha_1502b");
            this._armatureDisplay = this._armature.display;
            // this._armatureDisplay.x = GameMapContainer.instance.rootContainer.stage.stageWidth * 0.5;
            // this._armatureDisplay.y = GameMapContainer.GROUND;
            this._armatureDisplay.scaleX = this._armatureDisplay.scaleY = 0.4;
            this._armatureDisplay.addEventListener(dragonBones.EventObject.FADE_IN_COMPLETE, this._animationEventHandler, this);
            this._armatureDisplay.addEventListener(dragonBones.EventObject.FADE_OUT_COMPLETE, this._animationEventHandler, this);
            // Mecha effects only controled by normalAnimation.
            this._armature.getSlot("effects_1").displayController = Mecha.NORMAL_ANIMATION_GROUP;
            this._armature.getSlot("effects_2").displayController = Mecha.NORMAL_ANIMATION_GROUP;
            // Get weapon childArmature.
            this._weaponR = this._armature.getSlot("weapon_r").childArmature;
            this._weaponL = this._armature.getSlot("weapon_l").childArmature;
            this._weaponR.addEventListener(dragonBones.EventObject.FRAME_EVENT, this._frameEventHandler, this);
            this._weaponL.addEventListener(dragonBones.EventObject.FRAME_EVENT, this._frameEventHandler, this);
            this._updateAnimation();
            // GameMapContainer.instance.addChild(this._armatureDisplay);
            dragonBones.WorldClock.clock.add(this._armature);
        }
        Mecha.prototype.setParent = function (land, p, x, y) {
            if (this._parent != null) {
                this._parent.removeChild(this._nameLabel);
                this._parent.removeChild(this._sayLabel);
                this._parent.removeChild(this._armatureDisplay);
            }
            this._land = land;
            this._parent = p;
            if (this._parent) {
                if (this._armatureDisplay)
                    this._parent.addChild(this._armatureDisplay);
                if (this._nameLabel)
                    this._parent.addChild(this._nameLabel);
                if (this._sayLabel)
                    this._parent.addChild(this._sayLabel);
            }
            this._ground_y = y;
            this._armatureDisplay.x = x;
            this._armatureDisplay.y = this._ground_y;
        };
        Mecha.prototype.setMoveRange = function (w, h) {
            this._moveRangeWidth = w;
            this._moveRangeHeight = h;
        };
        Mecha.prototype.getPoint = function (resultPoint) {
            this._parent.stage.localToGlobal(this._armatureDisplay.x, this._armatureDisplay.y, resultPoint);
        };
        Mecha.prototype.move = function (dir) {
            if (this._moveDir == dir) {
                return;
            }
            this._moveDir = dir;
            this._updateAnimation();
        };
        Mecha.prototype.jump = function () {
            if (this._isJumpingA) {
                return;
            }
            this._isJumpingA = true;
            this._armature.animation.fadeIn("jump_1", -1, -1, 0, Mecha.NORMAL_ANIMATION_GROUP);
            this._walkState = null;
        };
        Mecha.prototype.squat = function (isSquating) {
            if (this._isSquating == isSquating) {
                return;
            }
            this._isSquating = isSquating;
            this._updateAnimation();
        };
        Mecha.prototype.attack = function (isAttacking) {
            if (this._isAttackingA == isAttacking) {
                return;
            }
            this._isAttackingA = isAttacking;
        };
        Mecha.prototype.switchWeaponR = function () {
            this._weaponRIndex++;
            if (this._weaponRIndex >= Mecha.WEAPON_R_LIST.length) {
                this._weaponRIndex = 0;
            }
            this._weaponR.removeEventListener(dragonBones.EventObject.FRAME_EVENT, this._frameEventHandler, this);
            var weaponName = Mecha.WEAPON_R_LIST[this._weaponRIndex];
            this._weaponR = tgame.GameMapContainer.instance.factory.buildArmature(weaponName);
            this._armature.getSlot("weapon_r").childArmature = this._weaponR;
            this._weaponR.addEventListener(dragonBones.EventObject.FRAME_EVENT, this._frameEventHandler, this);
        };
        Mecha.prototype.switchWeaponL = function () {
            this._weaponLIndex++;
            if (this._weaponLIndex >= Mecha.WEAPON_L_LIST.length) {
                this._weaponLIndex = 0;
            }
            this._weaponL.removeEventListener(dragonBones.EventObject.FRAME_EVENT, this._frameEventHandler, this);
            var weaponName = Mecha.WEAPON_L_LIST[this._weaponLIndex];
            this._weaponL = tgame.GameMapContainer.instance.factory.buildArmature(weaponName);
            this._armature.getSlot("weapon_l").childArmature = this._weaponL;
            this._weaponL.addEventListener(dragonBones.EventObject.FRAME_EVENT, this._frameEventHandler, this);
        };
        Mecha.prototype.setName = function (s) {
            if (this._nameLabel == null) {
                this._nameLabel = new eui.Label();
                this._nameLabel.fontFamily = "宋体";
                this._nameLabel.size = 20;
                this._nameLabel.width = this._armatureDisplay.width * 0.8;
                this._nameLabel.height = 30;
                this._nameLabel.anchorOffsetX = this._nameLabel.width / 2;
                this._nameLabel.anchorOffsetY = this._armatureDisplay.height / 2 + 10;
                this._nameLabel.x = this._armatureDisplay.x;
                this._nameLabel.y = this._armatureDisplay.y;
                this._nameLabel.textColor = 0x0000ff;
                this._nameLabel.background = true;
                this._nameLabel.backgroundColor = 0x999999;
                this._nameLabel.textAlign = egret.HorizontalAlign.CENTER;
                this._nameLabel.verticalAlign = egret.VerticalAlign.MIDDLE;
                this._nameLabel.alpha = 0.7;
                if (this._parent)
                    this._parent.addChild(this._nameLabel);
            }
            if (this._nameLabel != null) {
                this._nameLabel.text = s;
                this._nameLabel.visible = true;
            }
        };
        Mecha.prototype._updateNameLablePos = function () {
            if (this._nameLabel != null) {
                this._nameLabel.x = this._armatureDisplay.x;
                this._nameLabel.y = this._armatureDisplay.y;
            }
        };
        Mecha.prototype.saySome = function (s) {
            if (this._sayLabel == null) {
                this._sayLabel = new eui.Label();
                this._sayLabel.fontFamily = "宋体";
                this._sayLabel.size = 20;
                this._sayLabel.width = this._armatureDisplay.width * 0.8;
                this._sayLabel.height = 30;
                this._sayLabel.anchorOffsetX = this._sayLabel.width / 2;
                this._sayLabel.anchorOffsetY = this._armatureDisplay.height / 2 + 40;
                this._sayLabel.x = this._armatureDisplay.x;
                this._sayLabel.y = this._armatureDisplay.y;
                this._sayLabel.background = true;
                this._sayLabel.backgroundColor = 0xff0000;
                this._sayLabel.textAlign = egret.HorizontalAlign.CENTER;
                this._sayLabel.verticalAlign = egret.VerticalAlign.MIDDLE;
                this._sayLabel.alpha = 0.7;
                if (this._parent)
                    this._parent.addChild(this._sayLabel);
            }
            if (this._sayLabel != null) {
                this._sayLabel.text = s;
                this._sayLabel.visible = true;
            }
            var timer = new egret.Timer(1500, 1);
            timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, this.onsayOver, this);
            timer.start();
        };
        Mecha.prototype._updateSayLabalePos = function () {
            if (this._sayLabel != null) {
                this._sayLabel.x = this._armatureDisplay.x;
                this._sayLabel.y = this._armatureDisplay.y;
            }
        };
        Mecha.prototype.onsayOver = function (event) {
            this._sayLabel.visible = false;
        };
        Mecha.prototype.aim = function (x, y) {
            if (this._aimDir == 0) {
                this._aimDir = 10;
            }
            this._target.setTo(x, y);
        };
        Mecha.prototype.update = function () {
            this._updatePosition();
            this._updateAim();
            this._updateAttack();
            this._updateNameLablePos();
            this._updateSayLabalePos();
        };
        Mecha.prototype._animationEventHandler = function (event) {
            switch (event.type) {
                case dragonBones.EventObject.FADE_IN_COMPLETE:
                    if (event.eventObject.animationState.name == "jump_1") {
                        this._isJumpingB = true;
                        this._speedY = -Mecha.JUMP_SPEED;
                        this._armature.animation.fadeIn("jump_2", -1, -1, 0, Mecha.NORMAL_ANIMATION_GROUP);
                    }
                    else if (event.eventObject.animationState.name == "jump_4") {
                        this._updateAnimation();
                    }
                    break;
                case dragonBones.EventObject.FADE_OUT_COMPLETE:
                    if (event.eventObject.animationState.name == "attack_01") {
                        this._isAttackingB = false;
                        this._attackState = null;
                    }
                    break;
            }
        };
        Mecha.prototype._frameEventHandler = function (event) {
            if (event.eventObject.name == "onFire") {
                var firePointBone = event.eventObject.armature.getBone("firePoint");
                event.eventObject.armature.display.localToGlobal(firePointBone.global.x, firePointBone.global.y, Mecha._globalPoint);
                this._fire(Mecha._globalPoint);
            }
        };
        Mecha.prototype._fire = function (firePoint) {
            firePoint.x += Math.random() * 2 - 1;
            firePoint.y += Math.random() * 2 - 1;
            var radian = this._faceDir < 0 ? Math.PI - this._aimRadian : this._aimRadian;
            var bullet = new tgame.Bullet(this._land.getBulletLayer(), "bullet_01", "fireEffect_01", radian + Math.random() * 0.02 - 0.01, 40, firePoint);
            bullet.setMaxRange(this._moveRangeWidth, this._moveRangeHeight);
            this._land.addBullet(bullet);
        };
        Mecha.prototype._updateAnimation = function () {
            if (this._isJumpingA) {
                return;
            }
            if (this._isSquating) {
                this._speedX = 0;
                this._armature.animation.fadeIn("squat", -1, -1, 0, Mecha.NORMAL_ANIMATION_GROUP);
                this._walkState = null;
                return;
            }
            if (this._moveDir == 0) {
                this._speedX = 0;
                this._armature.animation.fadeIn("idle", -1, -1, 0, Mecha.NORMAL_ANIMATION_GROUP);
                this._walkState = null;
            }
            else {
                if (!this._walkState) {
                    this._walkState = this._armature.animation.fadeIn("walk", -1, -1, 0, Mecha.NORMAL_ANIMATION_GROUP);
                }
                if (this._moveDir * this._faceDir > 0) {
                    this._walkState.timeScale = Mecha.MAX_MOVE_SPEED_FRONT / Mecha.NORMALIZE_MOVE_SPEED;
                }
                else {
                    this._walkState.timeScale = -Mecha.MAX_MOVE_SPEED_BACK / Mecha.NORMALIZE_MOVE_SPEED;
                }
                if (this._moveDir * this._faceDir > 0) {
                    this._speedX = Mecha.MAX_MOVE_SPEED_FRONT * this._faceDir;
                }
                else {
                    this._speedX = -Mecha.MAX_MOVE_SPEED_BACK * this._faceDir;
                }
            }
        };
        Mecha.prototype._updatePosition = function () {
            if (this._speedX != 0) {
                this._armatureDisplay.x += this._speedX;
                if (this._armatureDisplay.x < 0) {
                    this._armatureDisplay.x = 0;
                }
                else if (this._armatureDisplay.x > this._moveRangeWidth) {
                    this._armatureDisplay.x = this._moveRangeWidth;
                }
            }
            if (this._speedY != 0) {
                if (this._speedY < 5 && this._speedY + tgame.GameMapContainer.G >= 5) {
                    this._armature.animation.fadeIn("jump_3", -1, -1, 0, Mecha.NORMAL_ANIMATION_GROUP);
                }
                this._speedY += tgame.GameMapContainer.G;
                this._armatureDisplay.y += this._speedY;
                if (this._armatureDisplay.y > this._ground_y) {
                    this._armatureDisplay.y = this._ground_y;
                    this._isJumpingA = false;
                    this._isJumpingB = false;
                    this._speedY = 0;
                    this._speedX = 0;
                    this._armature.animation.fadeIn("jump_4", -1, -1, 0, Mecha.NORMAL_ANIMATION_GROUP);
                    if (this._isSquating || this._moveDir) {
                        this._updateAnimation();
                    }
                }
            }
        };
        Mecha.prototype._updateAim = function () {
            if (this._aimDir == 0) {
                return;
            }
            this._faceDir = this._target.x > this._armatureDisplay.x ? 1 : -1;
            if (this._armatureDisplay.scaleX * this._faceDir < 0) {
                this._armatureDisplay.scaleX *= -1;
                if (this._moveDir) {
                    this._updateAnimation();
                }
            }
            var aimOffsetY = this._armature.getBone("chest").global.y * this._armatureDisplay.scaleY;
            if (this._faceDir > 0) {
                this._aimRadian = Math.atan2(this._target.y - this._armatureDisplay.y - aimOffsetY, this._target.x - this._armatureDisplay.x);
            }
            else {
                this._aimRadian = Math.PI - Math.atan2(this._target.y - this._armatureDisplay.y - aimOffsetY, this._target.x - this._armatureDisplay.x);
                if (this._aimRadian > Math.PI) {
                    this._aimRadian -= Math.PI * 2;
                }
            }
            var aimDir = 0;
            if (this._aimRadian > 0) {
                aimDir = -1;
            }
            else {
                aimDir = 1;
            }
            if (this._aimDir != aimDir) {
                this._aimDir = aimDir;
                // Animation mixing.
                if (this._aimDir >= 0) {
                    this._aimState = this._armature.animation.fadeIn("aimUp", 0, 1, 0, Mecha.AIM_ANIMATION_GROUP, 2 /* SameGroup */);
                }
                else {
                    this._aimState = this._armature.animation.fadeIn("aimDown", 0, 1, 0, Mecha.AIM_ANIMATION_GROUP, 2 /* SameGroup */);
                }
                // Add bone mask.
                //_aimState.addBoneMask("pelvis");
            }
            this._aimState.weight = Math.abs(this._aimRadian / Math.PI * 2);
            //_armature.invalidUpdate("pelvis"); // Only update bone mask.
            this._armature.invalidUpdate();
        };
        Mecha.prototype._updateAttack = function () {
            if (!this._isAttackingA || this._isAttackingB) {
                return;
            }
            this._isAttackingB = true;
            // Animation mixing.
            this._attackState = this._armature.animation.fadeIn("attack_01", -1, -1, 0, Mecha.ATTACK_ANIMATION_GROUP, 2 /* SameGroup */);
            this._attackState.autoFadeOutTime = this._attackState.fadeTotalTime;
            this._attackState.addBoneMask("pelvis");
        };
        Mecha.NORMAL_ANIMATION_GROUP = "normal";
        Mecha.AIM_ANIMATION_GROUP = "aim";
        Mecha.ATTACK_ANIMATION_GROUP = "attack";
        Mecha.JUMP_SPEED = 15;
        Mecha.NORMALIZE_MOVE_SPEED = 3.6;
        Mecha.MAX_MOVE_SPEED_FRONT = Mecha.NORMALIZE_MOVE_SPEED * 1.4;
        Mecha.MAX_MOVE_SPEED_BACK = Mecha.NORMALIZE_MOVE_SPEED * 1.0;
        Mecha.WEAPON_R_LIST = ["weapon_1502b_r", "weapon_1005", "weapon_1005b", "weapon_1005c", "weapon_1005d", "weapon_1005e"];
        Mecha.WEAPON_L_LIST = ["weapon_1502b_l", "weapon_1005", "weapon_1005b", "weapon_1005c", "weapon_1005d"];
        Mecha._globalPoint = new egret.Point();
        return Mecha;
    }());
    tgame.Mecha = Mecha;
    __reflect(Mecha.prototype, "tgame.Mecha");
})(tgame || (tgame = {}));
//# sourceMappingURL=Mecha.js.map