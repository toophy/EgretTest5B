// TypeScript file
namespace tgame {
    export class Mecha {
        private static NORMAL_ANIMATION_GROUP: string = "normal";
        private static AIM_ANIMATION_GROUP: string = "aim";
        private static ATTACK_ANIMATION_GROUP: string = "attack";
        private static JUMP_SPEED: number = 15;
        private static NORMALIZE_MOVE_SPEED: number = 3.6;
        private static MAX_MOVE_SPEED_FRONT: number = Mecha.NORMALIZE_MOVE_SPEED * 1.4;
        private static MAX_MOVE_SPEED_BACK: number = Mecha.NORMALIZE_MOVE_SPEED * 1.0;
        private static WEAPON_R_LIST: Array<string> = ["weapon_1502b_r", "weapon_1005", "weapon_1005b", "weapon_1005c", "weapon_1005d", "weapon_1005e"];
        private static WEAPON_L_LIST: Array<string> = ["weapon_1502b_l", "weapon_1005", "weapon_1005b", "weapon_1005c", "weapon_1005d"];


        private _isJumpingA: boolean = false;
        private _isJumpingB: boolean = false;
        private _isSquating: boolean = false;
        private _isAttackingA: boolean = false;
        private _isAttackingB: boolean = false;
        private _weaponRIndex: number = 0;
        private _weaponLIndex: number = 0;
        private _faceDir: number = 1;
        private _aimDir: number = 0;
        private _moveDir: number = 0;
        private _aimRadian: number = 0;
        public _speedX: number = 0;
        public _speedY: number = 0;
        private _armature: dragonBones.Armature = null;
        private _armatureDisplay: dragonBones.EgretArmatureDisplay = null;
        private _weaponR: dragonBones.Armature = null;
        private _weaponL: dragonBones.Armature = null;
        private _aimState: dragonBones.AnimationState = null;
        private _walkState: dragonBones.AnimationState = null;
        private _attackState: dragonBones.AnimationState = null;
        private _target: egret.Point = new egret.Point();

        public _accountEnv: tgame.AccountEnv;
        public _parent: egret.Sprite = null;
        private _ground_y: number = 0;
        private _moveRangeWidth: number = 0;
        private _moveRangeHeight: number = 0;
        public _land: tgame.LandView = null;
        private _sayLabel: eui.Label = null;
        private _nameLabel: eui.Label = null;
        public _easyAI: EasyAI = null;



        public constructor(accountEnv: tgame.AccountEnv) {
            this._accountEnv = accountEnv;
            this._armature = this._accountEnv.factory.buildArmature("mecha_1502b");
            this._armatureDisplay = <dragonBones.EgretArmatureDisplay>this._armature.display;
            // this._armatureDisplay.x = this._accountEnv.rootContainer.stage.stageWidth * 0.5;
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

            // this._accountEnv.addChild(this._armatureDisplay);
            dragonBones.WorldClock.clock.add(this._armature);
        }

        public setEasyAI(a: EasyAI) {
            this._easyAI = a;
        }

        public setParent(land: tgame.LandView, p: egret.Sprite, x: number, y: number) {
            if (this._parent != null) {
                if (this._nameLabel)
                    this._parent.removeChild(this._nameLabel);
                if (this._sayLabel)
                    this._parent.removeChild(this._sayLabel);
                if (this._armatureDisplay)
                    this._parent.removeChild(this._armatureDisplay);
            }
            this._land = land;

            this._parent = p
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

        }

        public leaveParent() {
            if (this._parent != null) {
                if (this._nameLabel)
                    this._parent.removeChild(this._nameLabel);
                if (this._sayLabel)
                    this._parent.removeChild(this._sayLabel);
                if (this._armatureDisplay)
                    this._parent.removeChild(this._armatureDisplay);
            }
        }

        public setMoveRange(w: number, h: number) {
            this._moveRangeWidth = w;
            this._moveRangeHeight = h;
        }

        public getPoint(resultPoint: egret.Point) {
            resultPoint.x = this._armatureDisplay.x;
            resultPoint.y = this._armatureDisplay.y;
        }

        public move(dir: number): void {
            if (this._moveDir == dir) {
                return;
            }

            this._moveDir = dir;
            this._updateAnimation();
        }

        public jump(): void {
            if (this._isJumpingA) {
                return;
            }

            this._isJumpingA = true;
            this._armature.animation.fadeIn("jump_1", -1, -1, 0, Mecha.NORMAL_ANIMATION_GROUP);
            this._walkState = null;
        }

        public squat(isSquating: boolean): void {
            if (this._isSquating == isSquating) {
                return;
            }

            this._isSquating = isSquating;
            this._updateAnimation();
        }

        public attack(isAttacking: boolean): void {
            if (this._isAttackingA == isAttacking) {
                return;
            }

            this._isAttackingA = isAttacking;
        }

        public switchWeaponR(): void {
            this._weaponRIndex++;
            if (this._weaponRIndex >= Mecha.WEAPON_R_LIST.length) {
                this._weaponRIndex = 0;
            }

            this._weaponR.removeEventListener(dragonBones.EventObject.FRAME_EVENT, this._frameEventHandler, this);

            const weaponName = Mecha.WEAPON_R_LIST[this._weaponRIndex];
            this._weaponR = this._accountEnv.factory.buildArmature(weaponName);
            this._armature.getSlot("weapon_r").childArmature = this._weaponR;
            this._weaponR.addEventListener(dragonBones.EventObject.FRAME_EVENT, this._frameEventHandler, this);
        }

        public switchWeaponL(): void {
            this._weaponLIndex++;
            if (this._weaponLIndex >= Mecha.WEAPON_L_LIST.length) {
                this._weaponLIndex = 0;
            }

            this._weaponL.removeEventListener(dragonBones.EventObject.FRAME_EVENT, this._frameEventHandler, this);

            const weaponName = Mecha.WEAPON_L_LIST[this._weaponLIndex];
            this._weaponL = this._accountEnv.factory.buildArmature(weaponName);
            this._armature.getSlot("weapon_l").childArmature = this._weaponL;
            this._weaponL.addEventListener(dragonBones.EventObject.FRAME_EVENT, this._frameEventHandler, this);
        }

        public setName(s: string) {
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
        }

        public _updateNameLablePos() {
            if (this._nameLabel != null) {
                this._nameLabel.x = this._armatureDisplay.x;
                this._nameLabel.y = this._armatureDisplay.y;
            }
        }


        public saySome(s: string) {
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

            var timer: egret.Timer = new egret.Timer(1500, 1);
            timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, this.onsayOver, this);
            timer.start();
        }


        public _updateSayLabalePos() {
            if (this._sayLabel != null) {
                this._sayLabel.x = this._armatureDisplay.x;
                this._sayLabel.y = this._armatureDisplay.y;
            }
        }

        private onsayOver(event: egret.TimerEvent) {
            this._sayLabel.visible = false;
        }

        public aim(x: number, y: number): void {
            if (this._aimDir == 0) {
                this._aimDir = 10;
            }

            this._target.setTo(x, y);
        }

        public update(): void {
            this._updatePosition();
            this._updateAim();
            this._updateAttack();
            this._updateNameLablePos();
            this._updateSayLabalePos();
        }

        private _animationEventHandler(event: dragonBones.EgretEvent): void {
            switch (event.type) {
                case dragonBones.EventObject.FADE_IN_COMPLETE:
                    if (event.eventObject.animationState.name == "jump_1") {
                        this._isJumpingB = true;
                        this._speedY = -Mecha.JUMP_SPEED;
                        this._armature.animation.fadeIn("jump_2", -1, -1, 0, Mecha.NORMAL_ANIMATION_GROUP);
                    } else if (event.eventObject.animationState.name == "jump_4") {
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
        }

        private static _globalPoint: egret.Point = new egret.Point();
        private _frameEventHandler(event: dragonBones.EgretEvent): void {
            if (event.eventObject.name == "onFire") {
                const firePointBone = event.eventObject.armature.getBone("firePoint");
                (<dragonBones.EgretArmatureDisplay>event.eventObject.armature.display).localToGlobal(firePointBone.global.x, firePointBone.global.y, Mecha._globalPoint);

                this._fire(Mecha._globalPoint);
            }
        }

        private _fire(firePoint: egret.Point): void {
            firePoint.x += Math.random() * 2 - 1;
            firePoint.y += Math.random() * 2 - 1;

            const radian = this._faceDir < 0 ? Math.PI - this._aimRadian : this._aimRadian;
            const bullet = new Bullet(this._accountEnv, this._land.getBulletLayer(), "bullet_01", "fireEffect_01", radian + Math.random() * 0.02 - 0.01, 40, firePoint);
            bullet.setMaxRange(this._moveRangeWidth, this._moveRangeHeight);

            this._land.addBullet(bullet);
        }

        private _updateAnimation(): void {
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
            } else {
                if (!this._walkState) {
                    this._walkState = this._armature.animation.fadeIn("walk", -1, -1, 0, Mecha.NORMAL_ANIMATION_GROUP);
                }

                if (this._moveDir * this._faceDir > 0) {
                    this._walkState.timeScale = Mecha.MAX_MOVE_SPEED_FRONT / Mecha.NORMALIZE_MOVE_SPEED;
                } else {
                    this._walkState.timeScale = -Mecha.MAX_MOVE_SPEED_BACK / Mecha.NORMALIZE_MOVE_SPEED;
                }

                if (this._moveDir * this._faceDir > 0) {
                    this._speedX = Mecha.MAX_MOVE_SPEED_FRONT * this._faceDir;
                } else {
                    this._speedX = -Mecha.MAX_MOVE_SPEED_BACK * this._faceDir;
                }
            }
        }

        private _updatePosition(): void {
            if (this._easyAI.isStopMove()) {
                this._isJumpingA = false;
                this._isJumpingB = false;
                this._speedY = 0;
                this._speedX = 0;
                return;
            }

            let tmpX = this._armatureDisplay.x;
            let tmpY = this._armatureDisplay.y;
            if (this._speedX != 0) {
                tmpX += this._speedX;
                if (tmpX < 0) {
                    tmpX = 0;
                } else if (tmpX > this._moveRangeWidth) {
                    tmpX = this._moveRangeWidth;
                }
            }

            if (this._speedY != 0) {
                if (this._speedY < 5 && this._speedY + this._accountEnv.G >= 5) {
                    this._armature.animation.fadeIn("jump_3", -1, -1, 0, Mecha.NORMAL_ANIMATION_GROUP);
                }

                this._speedY += this._accountEnv.G;

                tmpY += this._speedY;
                if (tmpY > this._ground_y) {
                    tmpY = this._ground_y;
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

            this._armatureDisplay.x = tmpX;
            this._armatureDisplay.y = tmpY;
        }

        private _updateAim(): void {
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

            const aimOffsetY = this._armature.getBone("chest").global.y * this._armatureDisplay.scaleY;

            if (this._faceDir > 0) {
                this._aimRadian = Math.atan2(this._target.y - this._armatureDisplay.y - aimOffsetY, this._target.x - this._armatureDisplay.x);
            } else {
                this._aimRadian = Math.PI - Math.atan2(this._target.y - this._armatureDisplay.y - aimOffsetY, this._target.x - this._armatureDisplay.x);
                if (this._aimRadian > Math.PI) {
                    this._aimRadian -= Math.PI * 2;
                }
            }

            let aimDir = 0;
            if (this._aimRadian > 0) {
                aimDir = -1;
            } else {
                aimDir = 1;
            }

            if (this._aimDir != aimDir) {
                this._aimDir = aimDir;

                // Animation mixing.
                if (this._aimDir >= 0) {
                    this._aimState = this._armature.animation.fadeIn(
                        "aimUp", 0, 1,
                        0, Mecha.AIM_ANIMATION_GROUP, dragonBones.AnimationFadeOutMode.SameGroup
                    );
                } else {
                    this._aimState = this._armature.animation.fadeIn(
                        "aimDown", 0, 1,
                        0, Mecha.AIM_ANIMATION_GROUP, dragonBones.AnimationFadeOutMode.SameGroup
                    );
                }

                // Add bone mask.
                //_aimState.addBoneMask("pelvis");
            }

            this._aimState.weight = Math.abs(this._aimRadian / Math.PI * 2);

            //_armature.invalidUpdate("pelvis"); // Only update bone mask.
            this._armature.invalidUpdate();
        }

        private _updateAttack(): void {
            if (!this._isAttackingA || this._isAttackingB) {
                return;
            }

            this._isAttackingB = true;

            // Animation mixing.
            this._attackState = this._armature.animation.fadeIn(
                "attack_01", -1, -1,
                0, Mecha.ATTACK_ANIMATION_GROUP, dragonBones.AnimationFadeOutMode.SameGroup
            );

            this._attackState.autoFadeOutTime = this._attackState.fadeTotalTime;
            this._attackState.addBoneMask("pelvis");
        }

        public OnShowland(): void {
            let point: egret.Point = new egret.Point();
            this.getPoint(point);

            this._easyAI.updateActorShow(point);
        }
    }
}