namespace tui {
	export class LoginDlg extends eui.Component {

		private accountEnv: tgame.AccountEnv;

		private Lgn_AccountID: eui.TextInput;
		private Lgn_AccountPwdID: eui.TextInput;
		private Lgn_EnterID: eui.Button;
		private Lgn_LeaveID: eui.Button;

		constructor(accountEnv: tgame.AccountEnv) {
			super();
			this.skinName = "resource/assets/MainUI/LoginDlg/LoginDlg.exml";
			this.accountEnv = accountEnv;
			this.addEventListener(eui.UIEvent.COMPLETE, this.uiCompHandler, this);
		}

		public InitNetworkProc() {
			this.accountEnv.sceneConn.bind("Index.Login", this.onLogin, this);
		}

		protected childrenCreated(): void {
			super.childrenCreated();
		}

		private uiCompHandler(): void {

			this.x = this.stage.stageWidth / 2 - this.skin.width / 2;
			this.y = this.stage.stageHeight / 2 - this.skin.height / 2;

			// 注册事件 : 点击登录按钮
			this.Lgn_EnterID.addEventListener(egret.TouchEvent.TOUCH_TAP,
				(event: egret.TouchEvent) => {
					this.accountEnv.ChangeState("帐号登录", {
						"domain": window.location.hostname,
						"api": "echo",
						"port": "8080",
						"account": this.Lgn_AccountID.text,
						"pwd": this.Lgn_AccountPwdID.text,
						"pos_x": 0,
						"pos_y": 600
					})
				}, this);

			// 注册事件 : 点击离开按钮
			this.Lgn_LeaveID.addEventListener(egret.TouchEvent.TOUCH_TAP, (event: egret.TouchEvent) => {
			}, this);
		}

		/**
		 * 网络消息处理
		 */
		private onLogin(data: any, ret: string, msg: string) {
			if (data["account"] == this.accountEnv.account) {
				if (!this.accountEnv._lands._accountEasyAIs.has(data["account"])) {
					let easyAI = this.accountEnv._lands.AddRole(data["account"], data["pos_x"], data["pos_y"]);
					easyAI.enablePlayer(true);
					this.accountEnv._lands._accountEasyAIs.add(data["account"], easyAI);
					this.accountEnv._lands._player.setAccount(this.accountEnv.account, easyAI);
				}

				this.visible = false;
			}
		}
	}
}