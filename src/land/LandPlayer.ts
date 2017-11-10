// TypeScript file

namespace tgame {
	export class LandPlayer {

		private _player: Mecha = null;
		private _playerAI: EasyAI = null;
		private landView: LandView = null;
		private _account: string = "";
		private _motion_on: boolean = false;
		private _motion_x: number = 0.0;
		private _motion_y: number = 0.0;
		private _motion_z: number = 0.0;
		private _motion_time: number = 0;

		public constructor(l: LandView) {
			this.landView = l;
		}

		public update() {
			if (this._player != null) {
				let point: egret.Point = new egret.Point();
				this._player.getPoint(point);
				this.landView._accountEnv.sceneConn.send("Scene", "PlayerPoint", { "account": this._account, "name": "update", "isDown": false, "x": point.x, "y": point.y });
				this.landView._base.SetTargetViewPos(point);
			}
		}

		public setAccount(a: string, ai: EasyAI) {
			this._account = a;
			this._playerAI = ai;
			this._player = ai.getActor();
		}

		public _touchMove(x: number, y: number) {
			if (this._player != null) {
				this.landView._accountEnv.sceneConn.send("Scene", "Skill", { "account": this._account, "name": "aim", "isDown": false, "x": x, "y": y });
				this._player.aim(x, y);
			}
		}

		public _touchHandler(event: egret.TouchEvent): void {
		}

		public OnMotion(event: egret.MotionEvent): void {
			if (event.accelerationIncludingGravity.x == null) {
				return;
			}

			let change_diff: number = 0.4;
			let check_time: number = 300; // 检查间隔时间(毫秒)
			if (this._motion_on) {
				let now_time: number = new Date().getTime();

				if (now_time > this._motion_time + check_time) {
					this._motion_time = now_time;
					if (GetMain().IsHorizScreen()) {
						let diff_y: number = event.accelerationIncludingGravity.y - this._motion_y;
						if (diff_y >= -change_diff && diff_y <= change_diff) {
							this.landView._accountEnv.sceneConn.send("Scene", "Skill", { "account": this._account, "name": "move_left", "isDown": false });
							this._playerAI.moveLeft(false);
							this._playerAI.moveRight(false);
						} else if (diff_y < -change_diff) {
							this.landView._accountEnv.sceneConn.send("Scene", "Skill", { "account": this._account, "name": "move_left", "isDown": true });
							this._playerAI.moveLeft(true);
						} else if (diff_y > change_diff) {
							this.landView._accountEnv.sceneConn.send("Scene", "Skill", { "account": this._account, "name": "move_right", "isDown": true });
							this._playerAI.moveRight(true);
						}
					} else {
						let diff_x: number = event.accelerationIncludingGravity.x - this._motion_x;
						if (diff_x >= -change_diff && diff_x <= change_diff) {
							this.landView._accountEnv.sceneConn.send("Scene", "Skill", { "account": this._account, "name": "move_left", "isDown": false });
							this._playerAI.moveLeft(false);
							this._playerAI.moveRight(false);
						} else if (diff_x < -change_diff) {
							this.landView._accountEnv.sceneConn.send("Scene", "Skill", { "account": this._account, "name": "move_right", "isDown": true });
							this._playerAI.moveRight(true);
						} else if (diff_x > change_diff) {
							this.landView._accountEnv.sceneConn.send("Scene", "Skill", { "account": this._account, "name": "move_left", "isDown": true });
							this._playerAI.moveLeft(true);
						}
					}
				}
			} else {
				this._motion_x = 0.0;//event.accelerationIncludingGravity.x;
				this._motion_y = 0.0;//event.accelerationIncludingGravity.y;
				this._motion_z = 0.0;//event.accelerationIncludingGravity.z;
				this._motion_on = true;
				this._motion_time = new Date().getTime();
			}
		}

		public OnOrientationChange(horiz: boolean): void {
			this._playerAI.moveLeft(false);
			this._playerAI.moveRight(false);
			this._motion_on = false;
		}

		public SelfUseSkill(id: number): void {
			if (this._player != null) {
				switch (id) {
					case -1:
						this.landView._accountEnv.TipMessage("停止使用技能");
						this.landView._accountEnv.sceneConn.send("Scene", "Skill", { "account": this._account, "name": "attack", "isDown": false, "begin": true });
						this._player.attack(false);
						break;
					case 0:
						this.landView._accountEnv.TipMessage("使用技能 X");
						this.landView._accountEnv.sceneConn.send("Scene", "Skill", { "account": this._account, "name": "attack", "isDown": false, "begin": true });
						this._player.attack(true);
						break;
					case 1:
						this.landView._accountEnv.TipMessage("使用技能 A");
						this.landView._accountEnv.sceneConn.send("Scene", "Skill", { "account": this._account, "name": "attack", "isDown": false, "begin": true });
						this._player.attack(true);
						break;
					case 2:
						this.landView._accountEnv.TipMessage("使用技能 B");
						this.landView._accountEnv.sceneConn.send("Scene", "Skill", { "account": this._account, "name": "attack", "isDown": false, "begin": true });
						this._player.attack(true);
						break;
					case 3:
						this.landView._accountEnv.TipMessage("使用技能 C");
						this.landView._accountEnv.sceneConn.send("Scene", "Skill", { "account": this._account, "name": "attack", "isDown": false, "begin": true });
						this._player.attack(true);
						break;
				}
			}
		}


		public _keyHandler(event: KeyboardEvent): void {

			const isDown: boolean = event.type == "keydown";

			if (this._player == null) {
				return;
			}

			switch (event.keyCode) {
				case 37:
				case 65:
					this.landView._accountEnv.sceneConn.send("Scene", "Skill", { "account": this._account, "name": "move_left", "isDown": isDown });
					this._playerAI.moveLeft(isDown);
					break;

				case 39:
				case 68:
					this.landView._accountEnv.sceneConn.send("Scene", "Skill", { "account": this._account, "name": "move_right", "isDown": isDown });
					this._playerAI.moveRight(isDown);
					break;

				case 38:
				case 87:
					if (isDown) {
						this.landView._accountEnv.sceneConn.send("Scene", "Skill", { "account": this._account, "name": "jump", "isDown": isDown });
						this._playerAI.jump(isDown);
					}
					break;

				case 83:
				case 40:
					{
						this.landView._accountEnv.sceneConn.send("Scene", "Skill", { "account": this._account, "name": "squat", "isDown": isDown });
						this._playerAI.squat(isDown);
					}
					break;

				case 81:
					if (isDown) {
						this.landView._accountEnv.sceneConn.send("Scene", "Skill", { "account": this._account, "name": "switchWeaponR", "isDown": isDown });
						this._playerAI.switchWeaponR(isDown);
					}
					break;

				case 69:
					if (isDown) {
						this.landView._accountEnv.sceneConn.send("Scene", "Skill", { "account": this._account, "name": "switchWeaponL", "isDown": isDown });
						this._playerAI.switchWeaponL(isDown);
					}
					break;

				case 32:
					if (isDown) {
						this.landView._accountEnv.sceneConn.send("Scene", "Skill", { "account": this._account, "name": "switchWeaponR", "isDown": isDown });
						this.landView._accountEnv.sceneConn.send("Scene", "Skill", { "account": this._account, "name": "switchWeaponL", "isDown": isDown });
						this._playerAI.switchWeaponR(isDown);
						this._playerAI.switchWeaponL(isDown);
					}
					break;
			}
		}

	}
}

